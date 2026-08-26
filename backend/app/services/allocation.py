from collections import defaultdict
from typing import Dict, List

QUESTION_TYPES = [
    "MCQ",
    "True/False",
    "Short Answer",
    "Fill-in",
    "Structured",
    "Essay",
]

BLOOMS_ORDER = ["remember", "understand", "apply", "analyze", "evaluate", "create"]

BLOOMS_TYPE_AFFINITY = {
    "remember": {
        "MCQ": 0.5, "True/False": 0.3, "Fill-in": 0.2,
        "Short Answer": 0.1, "Structured": 0.0, "Essay": 0.0,
    },
    "understand": {
        "MCQ": 0.4, "True/False": 0.2, "Fill-in": 0.2,
        "Short Answer": 0.3, "Structured": 0.1, "Essay": 0.0,
    },
    "apply": {
        "MCQ": 0.2, "True/False": 0.1, "Fill-in": 0.1,
        "Short Answer": 0.5, "Structured": 0.3, "Essay": 0.1,
    },
    "analyze": {
        "MCQ": 0.1, "True/False": 0.0, "Fill-in": 0.0,
        "Short Answer": 0.4, "Structured": 0.4, "Essay": 0.3,
    },
    "evaluate": {
        "MCQ": 0.0, "True/False": 0.0, "Fill-in": 0.0,
        "Short Answer": 0.3, "Structured": 0.3, "Essay": 0.5,
    },
    "create": {
        "MCQ": 0.0, "True/False": 0.0, "Fill-in": 0.0,
        "Short Answer": 0.1, "Structured": 0.4, "Essay": 0.6,
    },
}

BLOOMS_COMMAND_WORDS = {
    "remember": "State, Define, List, Identify, Name",
    "understand": "Describe, Explain, Summarize, Outline",
    "apply": "Calculate, Demonstrate, Solve, Use",
    "analyze": "Compare, Contrast, Examine, Differentiate",
    "evaluate": "Justify, Assess, Critique, Evaluate",
    "create": "Design, Propose, Formulate, Construct",
}

BLOOM_AO_MAP = {
    "remember": "AO1",
    "understand": "AO1",
    "apply": "AO2",
    "analyze": "AO2",
    "evaluate": "AO3",
    "create": "AO3",
}

BLOOM_DISPLAY = {
    "remember": "Remember",
    "understand": "Understand",
    "apply": "Apply",
    "analyze": "Analyze",
    "evaluate": "Evaluate",
    "create": "Create",
}


def normalize_bloom_distribution(raw: Dict[str, float]) -> Dict[str, float]:
    dist = {level: 0.0 for level in BLOOMS_ORDER}
    for key, value in (raw or {}).items():
        level = str(key).strip().lower()
        if level in dist:
            dist[level] = float(value or 0)
    return dist


def normalize_type_counts(raw: Dict[str, int]) -> Dict[str, int]:
    counts = {t: 0 for t in QUESTION_TYPES}
    for key, value in (raw or {}).items():
        if key in counts:
            counts[key] = max(0, int(value or 0))
    return counts


def allocate_questions_by_blooms(num_questions: int, blooms_distribution: Dict[str, float]) -> Dict[str, int]:
    dist = normalize_bloom_distribution(blooms_distribution)
    raw = {lvl: (pct / 100.0) * num_questions for lvl, pct in dist.items()}
    floored = {lvl: int(v) for lvl, v in raw.items()}
    remainder = num_questions - sum(floored.values())
    fractions = sorted(raw.items(), key=lambda x: x[1] - int(x[1]), reverse=True)
    for i in range(max(0, remainder)):
        floored[fractions[i % len(fractions)][0]] += 1
    return floored


def allocate_types_by_blooms(
    blooms_counts: Dict[str, int],
    type_counts: Dict[str, int],
    affinity: Dict[str, Dict[str, float]] = None,
) -> Dict[str, Dict[str, int]]:
    affinity = affinity or BLOOMS_TYPE_AFFINITY
    types = normalize_type_counts(type_counts)
    remaining_types = dict(types)
    allocation = {lvl: {t: 0 for t in QUESTION_TYPES} for lvl in BLOOMS_ORDER}

    for level in BLOOMS_ORDER:
        for _ in range(int(blooms_counts.get(level, 0) or 0)):
            candidates = [t for t, n in remaining_types.items() if n > 0]
            if not candidates:
                break
            best = max(candidates, key=lambda t: affinity.get(level, {}).get(t, 0.0))
            allocation[level][best] += 1
            remaining_types[best] -= 1

    leftover_types = {t: n for t, n in remaining_types.items() if n > 0}
    if leftover_types:
        for qtype, n in leftover_types.items():
            for _ in range(n):
                level = max(
                    BLOOMS_ORDER,
                    key=lambda lvl: affinity.get(lvl, {}).get(qtype, 0.0),
                )
                allocation[level][qtype] += 1
                remaining_types[qtype] -= 1

    return allocation


def allocate_across_topics(count: int, topic_labels: List[str]) -> Dict[str, int]:
    if count <= 0 or not topic_labels:
        return {t: 0 for t in topic_labels}
    n = len(topic_labels)
    base, remainder = divmod(count, n)
    alloc = {t: base for t in topic_labels}
    for t in topic_labels[:remainder]:
        alloc[t] += 1
    return alloc


def build_generation_jobs(
    type_counts: Dict[str, int],
    bloom_distribution: Dict[str, float],
    topic_labels: List[str],
) -> List[Dict]:
    types = normalize_type_counts(type_counts)
    num_questions = sum(types.values())
    blooms_counts = allocate_questions_by_blooms(num_questions, bloom_distribution)
    type_allocation = allocate_types_by_blooms(blooms_counts, types)

    jobs = []
    for blooms_level in BLOOMS_ORDER:
        for qtype in QUESTION_TYPES:
            n = type_allocation[blooms_level][qtype]
            if n <= 0:
                continue
            topic_split = allocate_across_topics(n, topic_labels)
            for topic, topic_n in topic_split.items():
                if topic_n <= 0:
                    continue
                jobs.append({
                    "blooms_level": blooms_level,
                    "question_type": qtype,
                    "topic": topic,
                    "n": topic_n,
                })
    return jobs
