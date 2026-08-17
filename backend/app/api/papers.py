from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.paper import Paper, Question
from ..schemas import PaperCreate, PaperResponse, QuestionCreate, QuestionResponse

router = APIRouter(prefix="/papers", tags=["papers"])

@router.post("/", response_model=PaperResponse)
def create_paper(paper_in: PaperCreate, db: Session = Depends(get_db)):
    # Create the paper
    db_paper = Paper(
        title=paper_in.title,
        subject=paper_in.subject,
        exam_board=paper_in.exam_board,
        qualification_level=paper_in.qualification_level,
        template_type=paper_in.template_type,
        total_marks=paper_in.total_marks,
        duration_minutes=paper_in.duration_minutes,
        bloom_distribution=paper_in.bloom_distribution,
        ao_distribution=paper_in.ao_distribution,
    )
    db.add(db_paper)
    db.commit()
    db.refresh(db_paper)

    # Create associated questions if any
    if paper_in.questions:
        for q_in in paper_in.questions:
            db_question = Question(
                paper_id=db_paper.id,
                text=q_in.text,
                answer=q_in.answer,
                mark_value=q_in.mark_value,
                bloom_level=q_in.bloom_level,
                ao_code=q_in.ao_code,
                question_type=q_in.question_type,
                options=q_in.options,
                correct_option=q_in.correct_option
            )
            db.add(db_question)
        db.commit()
        db.refresh(db_paper)

    return db_paper

@router.get("/", response_model=List[PaperResponse])
def get_papers(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    papers = db.query(Paper).filter(Paper.is_archived == False).offset(skip).limit(limit).all()
    return papers

@router.get("/{paper_id}", response_model=PaperResponse)
def get_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    return paper

@router.delete("/{paper_id}")
def delete_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    # Soft delete
    paper.is_archived = True
    db.commit()
    return {"message": "Paper archived successfully"}
