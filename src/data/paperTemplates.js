/**
 * QUESTIFY — Paper Templates
 * Board-specific assessment structure presets
 *
 * Each template pre-fills:
 *   - typeCounts (per question type)
 *   - duration (minutes)
 *   - bloom (Bloom's Taxonomy distribution)
 *   - aoSplit (AO1/AO2/AO3 distribution)
 *   - boardHint (which boards commonly use this format)
 */

import { sumTypeCounts } from './questionTypes';

export const PAPER_TEMPLATES = [
  {
    id: 'quick-quiz',
    name: 'Quick Quiz',
    icon: '⚡',
    description: '10 MCQs for a rapid in-class formative check',
    badge: 'Formative',
    badgeColor: '#3b82f6',
    typeCounts: { MCQ: 10, 'True/False': 0, 'Short Answer': 0, 'Fill-in': 0, Structured: 0, Essay: 0 },
    duration: 20,
    boardHint: ['All boards'],
    bloom: { Remember: 40, Understand: 40, Apply: 15, Analyze: 5, Evaluate: 0, Create: 0 },
    aoSplit: { AO1: 70, AO2: 25, AO3: 5 }
  },
  {
    id: 'unit-test',
    name: 'Unit Test',
    icon: '📋',
    description: '20 mixed questions for end-of-unit assessment',
    badge: 'Formative',
    badgeColor: '#8b5cf6',
    typeCounts: { MCQ: 8, 'True/False': 4, 'Short Answer': 6, 'Fill-in': 2, Structured: 0, Essay: 0 },
    duration: 45,
    boardHint: ['All boards'],
    bloom: { Remember: 20, Understand: 30, Apply: 30, Analyze: 15, Evaluate: 5, Create: 0 },
    aoSplit: { AO1: 40, AO2: 45, AO3: 15 }
  },
  {
    id: 'midterm',
    name: 'Mid-Term Paper',
    icon: '📚',
    description: '35 questions covering the first half of syllabus',
    badge: 'Summative',
    badgeColor: '#f97316',
    typeCounts: { MCQ: 12, 'True/False': 5, 'Short Answer': 10, 'Fill-in': 4, Structured: 3, Essay: 1 },
    duration: 90,
    boardHint: ['All boards'],
    bloom: { Remember: 15, Understand: 25, Apply: 30, Analyze: 20, Evaluate: 10, Create: 0 },
    aoSplit: { AO1: 35, AO2: 45, AO3: 20 }
  },
  {
    id: 'final-exam',
    name: 'Final Exam',
    icon: '🏆',
    description: '50 comprehensive questions for end-of-year examination',
    badge: 'Summative',
    badgeColor: '#ef4444',
    typeCounts: { MCQ: 16, 'True/False': 6, 'Short Answer': 14, 'Fill-in': 6, Structured: 5, Essay: 3 },
    duration: 120,
    boardHint: ['All boards'],
    bloom: { Remember: 10, Understand: 20, Apply: 25, Analyze: 25, Evaluate: 15, Create: 5 },
    aoSplit: { AO1: 30, AO2: 45, AO3: 25 }
  },
  {
    id: 'cambridge-igcse-paper1',
    name: 'Cambridge IGCSE — Paper 1',
    icon: '🎓',
    description: '30 MCQs · 45 min · AO1: 35% / AO2: 45% / AO3: 20%',
    badge: 'Cambridge',
    badgeColor: '#10b981',
    typeCounts: { MCQ: 30, 'True/False': 0, 'Short Answer': 0, 'Fill-in': 0, Structured: 0, Essay: 0 },
    duration: 45,
    boardHint: ['cambridge-sri-lanka'],
    bloom: { Remember: 15, Understand: 20, Apply: 30, Analyze: 25, Evaluate: 10, Create: 0 },
    aoSplit: { AO1: 35, AO2: 45, AO3: 20 }
  },
  {
    id: 'cambridge-igcse-paper2',
    name: 'Cambridge IGCSE — Paper 2',
    icon: '📝',
    description: '40 structured questions · 90 min · Application focus',
    badge: 'Cambridge',
    badgeColor: '#10b981',
    typeCounts: { MCQ: 0, 'True/False': 0, 'Short Answer': 24, 'Fill-in': 4, Structured: 12, Essay: 0 },
    duration: 90,
    boardHint: ['cambridge-sri-lanka'],
    bloom: { Remember: 10, Understand: 15, Apply: 35, Analyze: 25, Evaluate: 15, Create: 0 },
    aoSplit: { AO1: 25, AO2: 55, AO3: 20 }
  },
  {
    id: 'cambridge-alevel',
    name: 'Cambridge A-Level Paper',
    icon: '🔬',
    description: 'Higher-order questions · 120 min · Evaluation-heavy',
    badge: 'A-Level',
    badgeColor: '#06b6d4',
    typeCounts: { MCQ: 8, 'True/False': 2, 'Short Answer': 15, 'Fill-in': 2, Structured: 12, Essay: 6 },
    duration: 120,
    boardHint: ['cambridge-sri-lanka'],
    bloom: { Remember: 5, Understand: 20, Apply: 35, Analyze: 25, Evaluate: 15, Create: 0 },
    aoSplit: { AO1: 25, AO2: 50, AO3: 25 }
  },
  {
    id: 'edexcel-igcse',
    name: 'Edexcel IGCSE Paper',
    icon: '📊',
    description: '40 questions · 60 min · AO1: 40% / AO2: 40% / AO3: 20%',
    badge: 'Edexcel',
    badgeColor: '#8b5cf6',
    typeCounts: { MCQ: 16, 'True/False': 6, 'Short Answer': 12, 'Fill-in': 4, Structured: 2, Essay: 0 },
    duration: 60,
    boardHint: ['edexcel-sri-lanka'],
    bloom: { Remember: 20, Understand: 20, Apply: 30, Analyze: 20, Evaluate: 10, Create: 0 },
    aoSplit: { AO1: 40, AO2: 40, AO3: 20 }
  },
  {
    id: 'edexcel-alevel',
    name: 'Edexcel A-Level Paper',
    icon: '📈',
    description: 'Extended questions · 120 min · Application & Evaluation',
    badge: 'Edexcel',
    badgeColor: '#8b5cf6',
    typeCounts: { MCQ: 8, 'True/False': 0, 'Short Answer': 16, 'Fill-in': 2, Structured: 16, Essay: 8 },
    duration: 120,
    boardHint: ['edexcel-sri-lanka'],
    bloom: { Remember: 5, Understand: 25, Apply: 35, Analyze: 20, Evaluate: 15, Create: 0 },
    aoSplit: { AO1: 35, AO2: 40, AO3: 25 }
  },
  {
    id: 'essay-based',
    name: 'Essay / Extended Response',
    icon: '✍️',
    description: '8 essay questions for higher-order critical thinking',
    badge: 'HOT',
    badgeColor: '#f59e0b',
    typeCounts: { MCQ: 0, 'True/False': 0, 'Short Answer': 0, 'Fill-in': 0, Structured: 0, Essay: 8 },
    duration: 75,
    boardHint: ['All boards'],
    bloom: { Remember: 0, Understand: 5, Apply: 15, Analyze: 25, Evaluate: 35, Create: 20 },
    aoSplit: { AO1: 10, AO2: 35, AO3: 55 }
  }
];

PAPER_TEMPLATES.forEach((tpl) => {
  tpl.questionCount = sumTypeCounts(tpl.typeCounts);
});

/**
 * Get templates filtered by board suitability
 * @param {string} boardId
 */
export const getTemplatesForBoard = (boardId) =>
  PAPER_TEMPLATES.filter(t =>
    t.boardHint.includes('All boards') || t.boardHint.includes(boardId)
  );

export default PAPER_TEMPLATES;
