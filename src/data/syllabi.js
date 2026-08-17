/**
 * QUESTIFY — Sri Lankan Syllabi Data
 * Cambridge Assessment International Education & Pearson Edexcel
 * Structured for the Sri Lankan curriculum context (Pilot: July 2026)
 *
 * Assessment Objective (AO) Alignment:
 *   AO1 — Knowledge & Understanding  → Bloom's: Remember, Understand
 *   AO2 — Application & Analysis     → Bloom's: Apply, Analyze
 *   AO3 — Evaluation & Synthesis     → Bloom's: Evaluate, Create
 */

/* ============================================================
   ASSESSMENT OBJECTIVE PROFILES (per board)
============================================================ */
export const AO_PROFILES = {
  'cambridge': {
    label: 'Cambridge Assessment International Education',
    objectives: {
      AO1: { name: 'Knowledge & Understanding', bloomLevels: ['Remember', 'Understand'], keywords: ['define', 'identify', 'state', 'describe', 'list', 'name', 'recall'] },
      AO2: { name: 'Application & Analysis',     bloomLevels: ['Apply', 'Analyze'],       keywords: ['calculate', 'apply', 'determine', 'explain', 'compare', 'classify', 'interpret'] },
      AO3: { name: 'Evaluation & Synthesis',     bloomLevels: ['Evaluate', 'Create'],     keywords: ['evaluate', 'justify', 'assess', 'discuss', 'recommend', 'design', 'create'] }
    }
  },
  'edexcel': {
    label: 'Pearson Edexcel International',
    objectives: {
      AO1: { name: 'Knowledge & Understanding', bloomLevels: ['Remember', 'Understand'], keywords: ['state', 'describe', 'identify', 'define', 'name', 'outline', 'recall'] },
      AO2: { name: 'Application & Analysis',     bloomLevels: ['Apply', 'Analyze'],       keywords: ['apply', 'calculate', 'analyse', 'explain', 'use', 'demonstrate', 'show'] },
      AO3: { name: 'Evaluation',                  bloomLevels: ['Evaluate', 'Create'],     keywords: ['evaluate', 'assess', 'discuss', 'justify', 'compare', 'review', 'critique'] }
    }
  }
};

/* ============================================================
   SYLLABUS DATABASE
============================================================ */
export const SYLLABI = {

  /* ──────────────────────────────────────────────────────────
     CAMBRIDGE ASSESSMENT INTERNATIONAL EDUCATION
  ────────────────────────────────────────────────────────── */
  'cambridge-sri-lanka': {
    label: 'Cambridge Assessment International Education',
    shortLabel: 'Cambridge',
    color: '#3b82f6',
    aoProfile: 'cambridge',
    website: 'https://www.cambridgeinternational.org',
    levels: {

      'cambridge-igcse': {
        label: 'Cambridge IGCSE (Grade 9/10)',
        description: 'International General Certificate of Secondary Education',
        typicalPaperDuration: 45,
        defaultAoSplit: { AO1: 35, AO2: 45, AO3: 20 },
        defaultBloom: { Remember: 15, Understand: 20, Apply: 30, Analyze: 25, Evaluate: 10, Create: 0 },
        subjects: [
          // Sciences
          { name: 'Biology',              code: '0610', category: 'Sciences'            },
          { name: 'Chemistry',            code: '0620', category: 'Sciences'            },
          { name: 'Physics',              code: '0625', category: 'Sciences'            },
          { name: 'Co-ordinated Sciences',code: '0654', category: 'Sciences'            },
          { name: 'Environmental Management', code: '0680', category: 'Sciences'       },
          // Mathematics
          { name: 'Mathematics',          code: '0580', category: 'Mathematics'        },
          { name: 'Additional Mathematics',code:'0606', category: 'Mathematics'        },
          { name: 'Statistics',           code: '0522', category: 'Mathematics'        },
          // English
          { name: 'English Language',     code: '0500', category: 'English'            },
          { name: 'English Literature',   code: '0475', category: 'English'            },
          { name: 'English as a Second Language', code:'0510', category: 'English'     },
          // Humanities
          { name: 'History',              code: '0470', category: 'Humanities'         },
          { name: 'Geography',            code: '0460', category: 'Humanities'         },
          { name: 'Religious Studies',    code: '0490', category: 'Humanities'         },
          // Social Sciences
          { name: 'Economics',            code: '0455', category: 'Social Sciences'    },
          { name: 'Accounting',           code: '0452', category: 'Social Sciences'    },
          { name: 'Business Studies',     code: '0450', category: 'Social Sciences'    },
          { name: 'Commerce',             code: '0452', category: 'Social Sciences'    },
          // Computing
          { name: 'Computer Science',     code: '0984', category: 'Computing'          },
          { name: 'Information & Communication Technology', code:'0417', category: 'Computing' },
          // Languages
          { name: 'Sinhala Language',     code: '0549', category: 'Languages'          },
          { name: 'Tamil Language',       code: '0336', category: 'Languages'          },
          { name: 'Arabic',               code: '0508', category: 'Languages'          },
          { name: 'French',               code: '0520', category: 'Languages'          },
          { name: 'German',               code: '0525', category: 'Languages'          },
          { name: 'Spanish',              code: '0530', category: 'Languages'          },
          // Creative
          { name: 'Art & Design',         code: '0400', category: 'Creative'           },
          { name: 'Drama',                code: '0411', category: 'Creative'           },
          { name: 'Music',                code: '0410', category: 'Creative'           },
          { name: 'Physical Education',   code: '0413', category: 'Physical'           }
        ]
      },

      'cambridge-ol': {
        label: 'Cambridge O-Level (Grade 10/11)',
        description: 'Cambridge Ordinary Level — widely used in Sri Lanka',
        typicalPaperDuration: 90,
        defaultAoSplit: { AO1: 35, AO2: 45, AO3: 20 },
        defaultBloom: { Remember: 20, Understand: 25, Apply: 25, Analyze: 20, Evaluate: 10, Create: 0 },
        subjects: [
          { name: 'Biology',              code: '5090', category: 'Sciences'            },
          { name: 'Chemistry',            code: '5070', category: 'Sciences'            },
          { name: 'Physics',              code: '5054', category: 'Sciences'            },
          { name: 'Combined Science',     code: '5129', category: 'Sciences'            },
          { name: 'Mathematics',          code: '4024', category: 'Mathematics'        },
          { name: 'Additional Mathematics', code:'4037', category: 'Mathematics'       },
          { name: 'Statistics',           code: '4040', category: 'Mathematics'        },
          { name: 'English Language',     code: '1123', category: 'English'            },
          { name: 'English Literature',   code: '2010', category: 'English'            },
          { name: 'Sinhala Language',     code: '3205', category: 'Languages'          },
          { name: 'Tamil Language',       code: '3226', category: 'Languages'          },
          { name: 'History',              code: '2147', category: 'Humanities'         },
          { name: 'Geography',            code: '2217', category: 'Humanities'         },
          { name: 'Economics',            code: '2281', category: 'Social Sciences'    },
          { name: 'Accounting',           code: '7110', category: 'Social Sciences'    },
          { name: 'Commerce',             code: '7100', category: 'Social Sciences'    },
          { name: 'Business Studies',     code: '7115', category: 'Social Sciences'    },
          { name: 'Computer Science',     code: '2210', category: 'Computing'          },
          { name: 'Information Technology', code:'2210', category: 'Computing'          },
          { name: 'Art & Design',         code: '6010', category: 'Creative'           },
          { name: 'Food & Nutrition',     code: '6065', category: 'Creative'           },
          { name: 'Physical Education',   code: '5096', category: 'Physical'           }
        ]
      },

      'cambridge-as': {
        label: 'Cambridge AS Level (Grade 12)',
        description: 'Advanced Subsidiary Level — typically sat in Grade 12',
        typicalPaperDuration: 90,
        defaultAoSplit: { AO1: 30, AO2: 50, AO3: 20 },
        defaultBloom: { Remember: 10, Understand: 20, Apply: 35, Analyze: 25, Evaluate: 10, Create: 0 },
        subjects: [
          { name: 'Biology',              code: '9700', category: 'Sciences'            },
          { name: 'Chemistry',            code: '9701', category: 'Sciences'            },
          { name: 'Physics',              code: '9702', category: 'Sciences'            },
          { name: 'Mathematics',          code: '9709', category: 'Mathematics'        },
          { name: 'Further Mathematics',  code: '9231', category: 'Mathematics'        },
          { name: 'Economics',            code: '9708', category: 'Social Sciences'    },
          { name: 'Accounting',           code: '9706', category: 'Social Sciences'    },
          { name: 'Business',             code: '9609', category: 'Social Sciences'    },
          { name: 'English Language',     code: '9093', category: 'English'            },
          { name: 'English Literature',   code: '9695', category: 'English'            },
          { name: 'History',              code: '9489', category: 'Humanities'         },
          { name: 'Geography',            code: '9696', category: 'Humanities'         },
          { name: 'Sociology',            code: '9699', category: 'Humanities'         },
          { name: 'Psychology',           code: '9990', category: 'Humanities'         },
          { name: 'Computer Science',     code: '9618', category: 'Computing'          },
          { name: 'Information Technology', code:'9626', category: 'Computing'          },
          { name: 'Law',                  code: '9084', category: 'Humanities'         },
          { name: 'Art & Design',         code: '9479', category: 'Creative'           },
          { name: 'Music',                code: '9483', category: 'Creative'           }
        ]
      },

      'cambridge-alevel': {
        label: 'Cambridge A-Level (Grade 12/13)',
        description: 'Advanced Level — full two-year qualification',
        typicalPaperDuration: 120,
        defaultAoSplit: { AO1: 25, AO2: 50, AO3: 25 },
        defaultBloom: { Remember: 5, Understand: 20, Apply: 35, Analyze: 25, Evaluate: 15, Create: 0 },
        subjects: [
          { name: 'Biology',              code: '9700', category: 'Sciences'            },
          { name: 'Chemistry',            code: '9701', category: 'Sciences'            },
          { name: 'Physics',              code: '9702', category: 'Sciences'            },
          { name: 'Mathematics',          code: '9709', category: 'Mathematics'        },
          { name: 'Further Mathematics',  code: '9231', category: 'Mathematics'        },
          { name: 'Economics',            code: '9708', category: 'Social Sciences'    },
          { name: 'Accounting',           code: '9706', category: 'Social Sciences'    },
          { name: 'Business',             code: '9609', category: 'Social Sciences'    },
          { name: 'English Language',     code: '9093', category: 'English'            },
          { name: 'English Literature',   code: '9695', category: 'English'            },
          { name: 'History',              code: '9489', category: 'Humanities'         },
          { name: 'Geography',            code: '9696', category: 'Humanities'         },
          { name: 'Sociology',            code: '9699', category: 'Humanities'         },
          { name: 'Psychology',           code: '9990', category: 'Humanities'         },
          { name: 'Computer Science',     code: '9618', category: 'Computing'          },
          { name: 'Information Technology', code:'9626', category: 'Computing'          },
          { name: 'Law',                  code: '9084', category: 'Humanities'         },
          { name: 'Art & Design',         code: '9479', category: 'Creative'           },
          { name: 'Music',                code: '9483', category: 'Creative'           },
          { name: 'Drama & Theatre',      code: '9482', category: 'Creative'           }
        ]
      }
    }
  },

  /* ──────────────────────────────────────────────────────────
     PEARSON EDEXCEL INTERNATIONAL
  ────────────────────────────────────────────────────────── */
  'edexcel-sri-lanka': {
    label: 'Pearson Edexcel International',
    shortLabel: 'Edexcel',
    color: '#8b5cf6',
    aoProfile: 'edexcel',
    website: 'https://qualifications.pearson.com',
    levels: {

      'edexcel-igcse': {
        label: 'Edexcel International GCSE (Grade 9/10)',
        description: 'Pearson Edexcel International GCSE — 40+ subjects available',
        typicalPaperDuration: 60,
        defaultAoSplit: { AO1: 40, AO2: 40, AO3: 20 },
        defaultBloom: { Remember: 20, Understand: 20, Apply: 30, Analyze: 20, Evaluate: 10, Create: 0 },
        subjects: [
          // Sciences
          { name: 'Biology',              code: '4BI1', category: 'Sciences'            },
          { name: 'Chemistry',            code: '4CH1', category: 'Sciences'            },
          { name: 'Physics',              code: '4PH1', category: 'Sciences'            },
          { name: 'Combined Science',     code: '4SC1', category: 'Sciences'            },
          { name: 'Human Biology',        code: '4HB1', category: 'Sciences'            },
          // Mathematics
          { name: 'Mathematics A',        code: '4MA1', category: 'Mathematics'        },
          { name: 'Mathematics B',        code: '4MB1', category: 'Mathematics'        },
          { name: 'Further Pure Mathematics', code:'4PM1', category: 'Mathematics'     },
          { name: 'Statistics',           code: '4ST1', category: 'Mathematics'        },
          // English
          { name: 'English Language A',   code: '4EA1', category: 'English'            },
          { name: 'English Language B',   code: '4EB1', category: 'English'            },
          { name: 'English Literature',   code: '4ET1', category: 'English'            },
          // Humanities
          { name: 'History',              code: '4HI1', category: 'Humanities'         },
          { name: 'Geography A',          code: '4GA1', category: 'Humanities'         },
          { name: 'Religious Studies',    code: '4RS1', category: 'Humanities'         },
          // Social Sciences
          { name: 'Business Studies',     code: '4BS1', category: 'Social Sciences'    },
          { name: 'Economics',            code: '4EC1', category: 'Social Sciences'    },
          { name: 'Accounting',           code: '4AC1', category: 'Social Sciences'    },
          { name: 'Commerce',             code: '4CM1', category: 'Social Sciences'    },
          // Computing
          { name: 'Computer Science',     code: '4CP1', category: 'Computing'          },
          { name: 'ICT',                  code: '4IT1', category: 'Computing'          },
          // Languages
          { name: 'French',               code: '4FR1', category: 'Languages'          },
          { name: 'Spanish',              code: '4SP1', category: 'Languages'          },
          { name: 'German',               code: '4GN1', category: 'Languages'          },
          { name: 'Arabic',               code: '4AR1', category: 'Languages'          },
          { name: 'Chinese',              code: '4CN1', category: 'Languages'          },
          // Creative
          { name: 'Art & Design',         code: '4AD1', category: 'Creative'           },
          { name: 'Music',                code: '4MU1', category: 'Creative'           },
          { name: 'Physical Education',   code: '4PE1', category: 'Physical'           }
        ]
      },

      'edexcel-as': {
        label: 'Edexcel International AS Level (Grade 12)',
        description: 'Pearson Edexcel International Advanced Subsidiary Level',
        typicalPaperDuration: 90,
        defaultAoSplit: { AO1: 40, AO2: 40, AO3: 20 },
        defaultBloom: { Remember: 10, Understand: 30, Apply: 30, Analyze: 20, Evaluate: 10, Create: 0 },
        subjects: [
          { name: 'Biology',              code: 'XBI11', category: 'Sciences'           },
          { name: 'Chemistry',            code: 'XCH11', category: 'Sciences'           },
          { name: 'Physics',              code: 'XPH11', category: 'Sciences'           },
          { name: 'Mathematics',          code: 'XMA11', category: 'Mathematics'       },
          { name: 'Further Mathematics',  code: 'XFM11', category: 'Mathematics'       },
          { name: 'Pure Mathematics',     code: 'XPM11', category: 'Mathematics'       },
          { name: 'Statistics',           code: 'XST11', category: 'Mathematics'       },
          { name: 'Mechanics',            code: 'XME11', category: 'Mathematics'       },
          { name: 'Business',             code: 'XBS11', category: 'Social Sciences'   },
          { name: 'Economics',            code: 'XEC11', category: 'Social Sciences'   },
          { name: 'Accounting',           code: 'XAC11', category: 'Social Sciences'   },
          { name: 'English Language',     code: 'XEN11', category: 'English'           },
          { name: 'English Literature',   code: 'XEL11', category: 'English'           },
          { name: 'History',              code: 'XHI11', category: 'Humanities'        },
          { name: 'Geography',            code: 'XGE11', category: 'Humanities'        },
          { name: 'Psychology',           code: 'XPS11', category: 'Humanities'        },
          { name: 'Sociology',            code: 'XSO11', category: 'Humanities'        },
          { name: 'Computer Science',     code: 'XCP11', category: 'Computing'         },
          { name: 'Law',                  code: 'XLW11', category: 'Humanities'        }
        ]
      },

      'edexcel-alevel': {
        label: 'Edexcel International A-Level (Grade 12/13)',
        description: 'Pearson Edexcel International Advanced Level — full qualification',
        typicalPaperDuration: 120,
        defaultAoSplit: { AO1: 35, AO2: 40, AO3: 25 },
        defaultBloom: { Remember: 5, Understand: 25, Apply: 35, Analyze: 20, Evaluate: 15, Create: 0 },
        subjects: [
          { name: 'Biology',              code: 'YBI01', category: 'Sciences'           },
          { name: 'Chemistry',            code: 'YCH01', category: 'Sciences'           },
          { name: 'Physics',              code: 'YPH01', category: 'Sciences'           },
          { name: 'Mathematics',          code: 'YMA01', category: 'Mathematics'       },
          { name: 'Further Mathematics',  code: 'YFM01', category: 'Mathematics'       },
          { name: 'Pure Mathematics',     code: 'YPM01', category: 'Mathematics'       },
          { name: 'Statistics',           code: 'YST01', category: 'Mathematics'       },
          { name: 'Mechanics',            code: 'YME01', category: 'Mathematics'       },
          { name: 'Business',             code: 'YBS01', category: 'Social Sciences'   },
          { name: 'Economics',            code: 'YEC01', category: 'Social Sciences'   },
          { name: 'Accounting',           code: 'YAC01', category: 'Social Sciences'   },
          { name: 'English Language',     code: 'YEN01', category: 'English'           },
          { name: 'English Literature',   code: 'YEL01', category: 'English'           },
          { name: 'History',              code: 'YHI01', category: 'Humanities'        },
          { name: 'Geography',            code: 'YGE01', category: 'Humanities'        },
          { name: 'Psychology',           code: 'YPS01', category: 'Humanities'        },
          { name: 'Sociology',            code: 'YSO01', category: 'Humanities'        },
          { name: 'Computer Science',     code: 'YCP01', category: 'Computing'         },
          { name: 'Law',                  code: 'YLW01', category: 'Humanities'        },
          { name: 'Art & Design',         code: 'YAD01', category: 'Creative'          }
        ]
      }
    }
  }
};

/* ============================================================
   PILOT SCHOOLS (Sri Lanka — Research Participants)
============================================================ */
export const PILOT_SCHOOLS = [
  {
    id: 'gateway-negombo',
    name: 'Gateway College',
    location: 'Negombo, Western Province',
    curriculum: ['Cambridge IGCSE', 'Cambridge A-Level'],
    participantCount: 5,
    primaryBoard: 'cambridge-sri-lanka',
    primaryLevel: 'cambridge-igcse',
    avgHoursPerPaper: 9,
    keyFeedback: [
      'Time spent per paper: 8–10 hours average',
      'Concerned with maintaining AO distribution',
      'Requested PDF export with special characters for Science papers',
      'Bloom\'s level visibility in generated questions'
    ]
  },
  {
    id: 'royal-institute-nugegoda',
    name: 'Royal Institute International School',
    location: 'Nugegoda, Western Province',
    curriculum: ['Cambridge IGCSE', 'Cambridge A-Level'],
    participantCount: 5,
    primaryBoard: 'cambridge-sri-lanka',
    primaryLevel: 'cambridge-igcse',
    avgHoursPerPaper: 8,
    keyFeedback: [
      'Need for both quick formative and summative assessments',
      'Concern about question quality consistency',
      'Requested answer validation to avoid unanswerable questions',
      'Interest in time-tracking metrics'
    ]
  }
];

/* ============================================================
   HELPER FUNCTIONS
============================================================ */

/** Get all boards as options for dropdowns */
export const getBoardOptions = () =>
  Object.entries(SYLLABI).map(([id, data]) => ({
    id,
    label: data.label,
    shortLabel: data.shortLabel,
    color: data.color
  }));

/** Get all levels for a board */
export const getLevelOptions = (boardId) => {
  if (!SYLLABI[boardId]) return [];
  return Object.entries(SYLLABI[boardId].levels).map(([id, data]) => ({
    id,
    label: data.label,
    description: data.description
  }));
};

/** Get subjects for a board + level (returns full objects with code & category) */
export const getSubjectOptions = (boardId, levelId) => {
  return SYLLABI[boardId]?.levels[levelId]?.subjects || [];
};

/** Get subjects grouped by category for a board + level */
export const getSubjectsByCategory = (boardId, levelId) => {
  const subjects = getSubjectOptions(boardId, levelId);
  return subjects.reduce((groups, subj) => {
    if (!groups[subj.category]) groups[subj.category] = [];
    groups[subj.category].push(subj);
    return groups;
  }, {});
};

/** Get default Bloom's distribution for a given board + level */
export const getDefaultBloom = (boardId, levelId) =>
  SYLLABI[boardId]?.levels[levelId]?.defaultBloom || {
    Remember: 20, Understand: 30, Apply: 25, Analyze: 15, Evaluate: 10, Create: 0
  };

/** Get default AO split for a given board + level */
export const getDefaultAoSplit = (boardId, levelId) =>
  SYLLABI[boardId]?.levels[levelId]?.defaultAoSplit || { AO1: 35, AO2: 45, AO3: 20 };

/** Get the AO profile for a board */
export const getAoProfile = (boardId) => {
  const profileKey = SYLLABI[boardId]?.aoProfile;
  return AO_PROFILES[profileKey] || null;
};

/** Get total subject count across all boards */
export const getTotalSubjectCount = () =>
  Object.values(SYLLABI).reduce((total, board) =>
    total + Object.values(board.levels).reduce((t, level) =>
      t + level.subjects.length, 0), 0);

export default SYLLABI;
