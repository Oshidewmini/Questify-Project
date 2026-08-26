import json
import os
import re
import time
from collections import defaultdict
from typing import Any, Dict, List, Optional, Tuple

from google import genai
from google.genai import types

from ..config import settings
from .allocation import (
    BLOOM_AO_MAP,
    BLOOM_DISPLAY,
    BLOOMS_COMMAND_WORDS,
    BLOOMS_ORDER,
    QUESTION_TYPES,
    build_generation_jobs,
)

TOPIC_TEXT_LIMIT = 12000
QUOTA_RETRY_CAP_SECONDS = 45

FORMAT_INSTRUCTIONS = {
    "MCQ": (
        "Each question must have exactly 4 options (A, B, C, D), one correct answer. "
        "Distractors should be plausible, based on common misconceptions from the source material. "
        "Return a JSON list, each item shaped like: "
        '{"question": str, "options": {"A": str, "B": str, "C": str, "D": str}, '
        '"correct_answer": "A"|"B"|"C"|"D", "marks": int, "blooms_level": str, "topic": str}'
    ),
    "True/False": (
        "Each item is a single factual statement that is unambiguously True or False. "
        "Return a JSON list, each item shaped like: "
        '{"question": str, "correct_answer": "True"|"False", "explanation": str, "marks": 1, '
        '"blooms_level": str, "topic": str}'
    ),
    "Short Answer": (
        "Each question requires a concise written response (one to four sentences or a short calculation). "
        "Return a JSON list, each item shaped like: "
        '{"question": str, "expected_answer": str, "marks": int, "blooms_level": str, "topic": str}'
    ),
    "Fill-in": (
        "Each question is a sentence with one blank shown as ________. "
        "The blank is a key term or short phrase from the source material. "
        "Return a JSON list, each item shaped like: "
        '{"question": str, "answer": str, "marks": 1, "blooms_level": str, "topic": str}'
    ),
    "Structured": (
        "Each item has a short stem plus 2 to 4 linked parts labelled a, b, c (and d if needed). "
        "Parts should increase in demand. Include a marking scheme per part. "
        "Return a JSON list, each item shaped like: "
        '{"stem": str, "parts": [{"label": "a", "question": str, "marks": int, '
        '"marking_scheme": [str, ...]}, ...], "blooms_level": str, "topic": str}'
    ),
    "Essay": (
        "Each question requires an extended written response, not a single fact. "
        "Include a mark allocation and a marking scheme (list of expected discussion points). "
        "Return a JSON list, each item shaped like: "
        '{"question": str, "marks": int, "marking_scheme": [str, str, ...], '
        '"blooms_level": str, "topic": str}'
    ),
}


def _gemini_api_key() -> str:
    return (os.getenv("GEMINI_API_KEY") or "").strip()


def _gemini_model() -> str:
    return (os.getenv("GEMINI_MODEL") or "gemini-2.0-flash-lite").strip()


def _client():
    api_key = _gemini_api_key()
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Add it to backend/.env (https://aistudio.google.com/apikey)."
        )
    return genai.Client(api_key=api_key)


def _parse_questions_payload(raw_text: str) -> List[dict]:
    cleaned = re.sub(r"```json|```", "", raw_text or "").strip()
    data = json.loads(cleaned)
    if isinstance(data, dict):
        for key in ("questions", "items", "data"):
            if isinstance(data.get(key), list):
                data = data[key]
                break
        else:
            data = [data]
    if not isinstance(data, list):
        raise json.JSONDecodeError("Expected a JSON list of questions", cleaned, 0)
    return data


def _as_list(value: Any) -> List[str]:
    if value is None:
        return []
    if isinstance(value, list):
        return [str(v) for v in value if v is not None]
    return [str(value)]


def _normalize_options(raw: Any) -> Optional[Dict[str, str]]:
    if not raw:
        return None
    if isinstance(raw, dict):
        return {str(k): str(v) for k, v in raw.items()}
    if isinstance(raw, list):
        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        return {letters[i]: str(item) for i, item in enumerate(raw)}
    return None


def _parts_total_marks(parts: List[dict]) -> int:
    total = 0
    for part in parts:
        try:
            total += int(part.get("marks") or 0)
        except (TypeError, ValueError):
            continue
    return total or 1


def _resolve_bloom(raw: dict, fallback: str) -> str:
    value = str(
        raw.get("blooms_level") or raw.get("bloom_level") or fallback or "remember"
    ).strip().lower()
    return value if value in BLOOM_DISPLAY else (fallback or "remember")


def _resolve_topic(raw: dict, fallback: str, known_topics: List[str]) -> str:
    value = str(raw.get("topic") or fallback or "").strip()
    if value in known_topics:
        return value
    lowered = value.lower()
    for topic in known_topics:
        if topic.lower() == lowered:
            return topic
    return fallback or (known_topics[0] if known_topics else value)


def normalize_question(raw: dict, qtype: str, blooms_level: str, topic: str) -> dict:
    bloom_key = _resolve_bloom(raw, blooms_level)
    bloom_display = BLOOM_DISPLAY.get(bloom_key, bloom_key.title())
    ao_code = BLOOM_AO_MAP.get(bloom_key, "AO1")
    options = _normalize_options(raw.get("options"))
    parts = raw.get("parts") if isinstance(raw.get("parts"), list) else None
    marking_scheme = _as_list(raw.get("marking_scheme") or raw.get("markingScheme"))

    if qtype == "Structured":
        text = str(raw.get("stem") or raw.get("question") or "").strip()
        clean_parts = []
        for idx, part in enumerate(parts or []):
            label = str(part.get("label") or chr(ord("a") + idx))
            clean_parts.append({
                "label": label,
                "question": str(part.get("question") or "").strip(),
                "marks": int(part.get("marks") or 1),
                "marking_scheme": _as_list(part.get("marking_scheme")),
            })
        marks = _parts_total_marks(clean_parts)
        answer_bits = []
        for part in clean_parts:
            scheme = "; ".join(part["marking_scheme"]) if part["marking_scheme"] else ""
            answer_bits.append(f"({part['label']}) {scheme}".strip())
        answer = " ".join(answer_bits)
        return {
            "text": text,
            "answer": answer,
            "mark_value": marks,
            "bloom_level": bloom_display,
            "ao_code": ao_code,
            "question_type": qtype,
            "options": None,
            "correct_option": None,
            "parts": clean_parts,
            "marking_scheme": marking_scheme,
            "topic": topic,
        }

    text = str(raw.get("question") or raw.get("stem") or raw.get("text") or "").strip()
    correct = raw.get("correct_answer") or raw.get("correct_option") or raw.get("answer")
    expected = raw.get("expected_answer") or raw.get("explanation")
    marks = int(raw.get("marks") or (8 if qtype == "Essay" else 2 if qtype == "Short Answer" else 1))

    if qtype == "MCQ":
        answer = str(correct or "")
        if options and answer in options:
            display_answer = f"{answer}) {options[answer]}"
        else:
            display_answer = answer
        return {
            "text": text,
            "answer": display_answer,
            "mark_value": marks,
            "bloom_level": bloom_display,
            "ao_code": ao_code,
            "question_type": qtype,
            "options": options,
            "correct_option": str(correct) if correct is not None else None,
            "parts": None,
            "marking_scheme": marking_scheme,
            "topic": topic,
        }

    if qtype == "True/False":
        answer = str(correct or "").strip().title()
        explanation = str(expected or "").strip()
        return {
            "text": text,
            "answer": f"{answer}. {explanation}".strip() if explanation else answer,
            "mark_value": marks,
            "bloom_level": bloom_display,
            "ao_code": ao_code,
            "question_type": qtype,
            "options": {"A": "True", "B": "False"},
            "correct_option": answer,
            "parts": None,
            "marking_scheme": marking_scheme,
            "topic": topic,
        }

    if qtype == "Fill-in":
        blank_answer = str(raw.get("answer") or correct or "").strip()
        return {
            "text": text,
            "answer": blank_answer,
            "mark_value": marks,
            "bloom_level": bloom_display,
            "ao_code": ao_code,
            "question_type": qtype,
            "options": None,
            "correct_option": None,
            "parts": None,
            "marking_scheme": marking_scheme,
            "topic": topic,
        }

    if qtype == "Essay":
        answer = " ".join(marking_scheme) if marking_scheme else str(expected or "")
        return {
            "text": text,
            "answer": answer,
            "mark_value": marks,
            "bloom_level": bloom_display,
            "ao_code": ao_code,
            "question_type": qtype,
            "options": None,
            "correct_option": None,
            "parts": None,
            "marking_scheme": marking_scheme,
            "topic": topic,
        }

    answer = str(expected or correct or raw.get("answer") or "").strip()
    return {
        "text": text,
        "answer": answer,
        "mark_value": marks,
        "bloom_level": bloom_display,
        "ao_code": ao_code,
        "question_type": qtype,
        "options": None,
        "correct_option": None,
        "parts": None,
        "marking_scheme": marking_scheme,
        "topic": topic,
    }


def _is_quota_error(exc: Exception) -> bool:
    text = str(exc)
    return "429" in text or "RESOURCE_EXHAUSTED" in text


def _quota_retry_delay(exc: Exception) -> float:
    text = str(exc)
    match = re.search(r"retry in ([\d.]+)\s*s", text, re.I)
    if match:
        return min(QUOTA_RETRY_CAP_SECONDS, float(match.group(1)))
    match = re.search(r"retryDelay['\"]:\s*['\"](\d+)s['\"]", text)
    if match:
        return min(QUOTA_RETRY_CAP_SECONDS, float(match.group(1)))
    return min(QUOTA_RETRY_CAP_SECONDS, 30.0)


def _group_jobs_by_type(jobs: List[dict]) -> Dict[str, List[dict]]:
    grouped: Dict[str, List[dict]] = defaultdict(list)
    for job in jobs:
        grouped[job["question_type"]].append(job)
    return grouped


def _quota_lines(jobs: List[dict]) -> Tuple[str, int]:
    lines = []
    total = 0
    for job in jobs:
        n = int(job.get("n") or 0)
        if n <= 0:
            continue
        total += n
        bloom = BLOOM_DISPLAY.get(job["blooms_level"], str(job["blooms_level"]).title())
        lines.append(f'- {n} {bloom} question(s) on topic "{job["topic"]}"')
    return "\n".join(lines), total


def _lesson_blocks(jobs: List[dict], topic_text_lookup: Dict[str, str]) -> str:
    seen = []
    for job in jobs:
        topic = job["topic"]
        if topic not in seen:
            seen.append(topic)
    blocks = []
    for topic in seen:
        text = (topic_text_lookup.get(topic) or "")[:TOPIC_TEXT_LIMIT]
        blocks.append(f'Topic: "{topic}"\n"""\n{text}\n"""')
    return "\n\n".join(blocks)


def _command_words_for_jobs(jobs: List[dict]) -> str:
    levels = []
    for job in jobs:
        level = job["blooms_level"]
        if level not in levels:
            levels.append(level)
    parts = []
    for level in BLOOMS_ORDER:
        if level in levels:
            parts.append(f"{BLOOM_DISPLAY[level]}: {BLOOMS_COMMAND_WORDS[level]}")
    return "; ".join(parts)


def call_gemini_for_type_batch(
    client,
    qtype: str,
    jobs: List[dict],
    topic_text_lookup: Dict[str, str],
    subject: str,
    exam_board: str,
    qualification_level: str,
) -> List[dict]:
    quota_text, total_n = _quota_lines(jobs)
    if total_n <= 0:
        return []

    known_topics = []
    for job in jobs:
        if job["topic"] not in known_topics:
            known_topics.append(job["topic"])
    fallback_bloom = jobs[0]["blooms_level"]
    fallback_topic = jobs[0]["topic"]
    format_instructions = FORMAT_INSTRUCTIONS[qtype]
    command_words = _command_words_for_jobs(jobs)
    lesson = _lesson_blocks(jobs, topic_text_lookup)

    prompt = f"""You are an exam question writer for {exam_board} {qualification_level} {subject}.

Using ONLY the lesson content below as source material, write exactly {total_n} {qtype} exam question(s).

Follow this quota exactly (counts must match):
{quota_text}

Use command words appropriate to each Bloom's level: {command_words}.

Question type: {qtype}.
{format_instructions}

Each JSON item MUST include "blooms_level" (one of: remember, understand, apply, analyze, evaluate, create) and "topic" (exactly one of: {", ".join(repr(t) for t in known_topics)}).

Return ONLY the JSON list of {total_n} items. No markdown fences, no preamble, no explanation.

Lesson content:
{lesson}
"""

    delay = float(os.getenv("GEMINI_REQUEST_DELAY") or settings.GEMINI_REQUEST_DELAY or 2)
    last_error = None
    quota_retried = False
    parse_attempts = 0
    max_parse_attempts = 2

    while True:
        try:
            response = client.models.generate_content(
                model=_gemini_model(),
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )
            time.sleep(delay)
            parsed = _parse_questions_payload(response.text)
            normalized = []
            for item in parsed[:total_n]:
                raw = item if isinstance(item, dict) else {"question": str(item)}
                bloom = _resolve_bloom(raw, fallback_bloom)
                topic = _resolve_topic(raw, fallback_topic, known_topics)
                normalized.append(normalize_question(raw, qtype, bloom, topic))
            return normalized
        except json.JSONDecodeError as exc:
            last_error = f"JSON parse error: {exc}"
            parse_attempts += 1
            if parse_attempts >= max_parse_attempts:
                break
            time.sleep(delay)
        except Exception as exc:
            last_error = str(exc)
            if _is_quota_error(exc) and not quota_retried:
                quota_retried = True
                time.sleep(_quota_retry_delay(exc))
                continue
            break

    raise RuntimeError(f"Failed generating {qtype} questions: {last_error}")


def generate_questions(
    topics: List[Dict[str, str]],
    type_counts: Dict[str, int],
    bloom_distribution: Dict[str, float],
    subject: str,
    exam_board: str,
    qualification_level: str,
) -> Dict[str, Any]:
    client = _client()
    topic_labels = [t["topic_label"] for t in topics]
    topic_text_lookup = {t["topic_label"]: t.get("text") or "" for t in topics}
    jobs = build_generation_jobs(type_counts, bloom_distribution, topic_labels)
    grouped = _group_jobs_by_type(jobs)

    questions: List[dict] = []
    warnings: List[str] = []

    for qtype in QUESTION_TYPES:
        type_jobs = grouped.get(qtype) or []
        if not type_jobs:
            continue
        try:
            batch = call_gemini_for_type_batch(
                client=client,
                qtype=qtype,
                jobs=type_jobs,
                topic_text_lookup=topic_text_lookup,
                subject=subject,
                exam_board=exam_board,
                qualification_level=qualification_level,
            )
            questions.extend(batch)
        except Exception as exc:
            warnings.append(str(exc))

    total_marks = sum(int(q.get("mark_value") or 0) for q in questions)
    return {
        "questions": questions,
        "total_marks": total_marks,
        "question_count": len(questions),
        "warnings": warnings,
    }
