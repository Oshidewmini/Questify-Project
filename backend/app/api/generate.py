from typing import List
import json

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from ..schemas import (
    ExtractedDoc,
    ExtractResponse,
    ExportRequest,
    GenerateRequest,
    GenerateResponse,
)
from ..services.docx_builder import build_docx_bytes, filename_for
from ..services.gemini_generator import generate_questions
from ..services.pdf_extract import extract_file

router = APIRouter(tags=["generate"])


@router.post("/extract", response_model=ExtractResponse)
async def extract_documents(
    files: List[UploadFile] = File(...),
    labels_json: str = Form(...),
):
    try:
        parsed = json.loads(labels_json)
        parsed_labels = [str(x) for x in parsed]
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="labels_json must be a JSON array of strings.") from exc

    if not files:
        raise HTTPException(status_code=400, detail="Upload at least one file.")
    if len(parsed_labels) != len(files):
        raise HTTPException(
            status_code=400,
            detail="Provide one topic label for each uploaded file, in the same order.",
        )

    documents = []
    for upload, label in zip(files, parsed_labels):
        topic_label = (label or "").strip() or (upload.filename or "Untitled topic")
        data = await upload.read()
        try:
            text, warnings = extract_file(upload.filename or "file.pdf", data)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Failed to extract {upload.filename}: {exc}") from exc

        documents.append(
            ExtractedDoc(
                topic_label=topic_label,
                text=text,
                char_count=len(text or ""),
                warnings=warnings,
            )
        )

    return ExtractResponse(documents=documents)


@router.post("/generate", response_model=GenerateResponse)
def generate_exam(payload: GenerateRequest):
    if not payload.topics:
        raise HTTPException(status_code=400, detail="Extract lesson content before generating questions.")
    if sum((payload.type_counts or {}).values()) <= 0:
        raise HTTPException(status_code=400, detail="Set at least one question type count greater than 0.")

    try:
        result = generate_questions(
            topics=[t.model_dump() for t in payload.topics],
            type_counts=payload.type_counts,
            bloom_distribution=payload.bloom_distribution,
            subject=payload.subject,
            exam_board=payload.exam_board,
            qualification_level=payload.qualification_level,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if not result["questions"]:
        detail = result["warnings"][0] if result["warnings"] else "No questions were generated."
        raise HTTPException(status_code=502, detail=detail)

    return GenerateResponse(**result)


@router.post("/export/docx")
def export_docx(payload: ExportRequest):
    if not payload.questions:
        raise HTTPException(status_code=400, detail="No questions to export.")

    header = payload.header.model_dump()
    questions = [q.model_dump() for q in payload.questions]
    content = build_docx_bytes(header, questions)
    filename = filename_for(header.get("title") or "question_paper")
    return Response(
        content=content,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
