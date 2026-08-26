export const QUESTION_TYPES = [
  { value: 'MCQ',          label: 'Multiple Choice (MCQ)' },
  { value: 'True/False',   label: 'True / False' },
  { value: 'Short Answer', label: 'Short Answer (SAQ)' },
  { value: 'Fill-in',      label: 'Fill in the Blank' },
  { value: 'Structured',   label: 'Structured (Parts a, b, c)' },
  { value: 'Essay',        label: 'Essay / Extended Response' },
];

export const EMPTY_TYPE_COUNTS = QUESTION_TYPES.reduce((acc, t) => {
  acc[t.value] = 0;
  return acc;
}, {});

export const sumTypeCounts = (counts = {}) =>
  QUESTION_TYPES.reduce((sum, t) => sum + (Number(counts[t.value]) || 0), 0);

export const BLOOM_AO_MAP = {
  Remember: 'AO1',
  Understand: 'AO1',
  Apply: 'AO2',
  Analyze: 'AO2',
  Evaluate: 'AO3',
  Create: 'AO3',
};

export const BLOOM_COLORS = {
  Remember:   '#60a5fa',
  Understand: '#818cf8',
  Apply:      '#a78bfa',
  Analyze:    '#c084fc',
  Evaluate:   '#e879f9',
  Create:     '#f472b6',
};
