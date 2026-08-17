/**
 * QUESTIFY — Local Database Utility
 *
 * Uses localStorage as a structured persistent store.
 * Designed to be easily swapped for Firebase/Supabase later.
 *
 * Keys used:
 *   questify_papers    — saved generated papers
 *   questify_settings  — user preferences
 *   questify_activity  — recent activity log (last 20)
 */

const KEYS = {
  PAPERS: 'questify_papers',
  SETTINGS: 'questify_settings',
  ACTIVITY: 'questify_activity'
};

// ============================================================
// Helpers
// ============================================================

const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// ============================================================
// Papers API
// ============================================================

/**
 * Save a new paper to the database.
 * @param {object} paper - Paper object (title, subject, board, level, questions, etc.)
 * @returns {object} The saved paper with id and timestamps
 */
export const savePaper = (paper) => {
  const papers = readJSON(KEYS.PAPERS, []);
  const newPaper = {
    ...paper,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  papers.unshift(newPaper); // newest first
  writeJSON(KEYS.PAPERS, papers);
  logActivity({
    type: 'paper_created',
    title: newPaper.title,
    subject: newPaper.subject,
    paperId: newPaper.id
  });
  return newPaper;
};

/**
 * Get all saved papers.
 * @returns {Array} Array of paper objects, newest first
 */
export const getPapers = () => readJSON(KEYS.PAPERS, []);

/**
 * Get a single paper by id.
 * @param {string} id
 * @returns {object|null}
 */
export const getPaperById = (id) => {
  const papers = readJSON(KEYS.PAPERS, []);
  return papers.find(p => p.id === id) || null;
};

/**
 * Update a paper by id.
 * @param {string} id
 * @param {object} updates
 * @returns {object|null} Updated paper or null if not found
 */
export const updatePaper = (id, updates) => {
  const papers = readJSON(KEYS.PAPERS, []);
  const idx = papers.findIndex(p => p.id === id);
  if (idx === -1) return null;
  papers[idx] = { ...papers[idx], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.PAPERS, papers);
  return papers[idx];
};

/**
 * Delete a paper by id.
 * @param {string} id
 * @returns {boolean}
 */
export const deletePaper = (id) => {
  const papers = readJSON(KEYS.PAPERS, []);
  const filtered = papers.filter(p => p.id !== id);
  if (filtered.length === papers.length) return false;
  writeJSON(KEYS.PAPERS, filtered);
  logActivity({ type: 'paper_deleted', paperId: id });
  return true;
};

/**
 * Get stats from paper database.
 * @returns {{ totalPapers, totalQuestions, subjects }}
 */
export const getPaperStats = () => {
  const papers = readJSON(KEYS.PAPERS, []);
  return {
    totalPapers: papers.length,
    totalQuestions: papers.reduce((sum, p) => sum + (p.questionCount || 0), 0),
    subjects: [...new Set(papers.map(p => p.subject).filter(Boolean))],
    recentPapers: papers.slice(0, 5)
  };
};

// ============================================================
// Settings API
// ============================================================

const DEFAULT_SETTINGS = {
  name: 'Mr. John Smith',
  email: 'john.smith@school.com',
  jobTitle: 'Senior Teacher',
  department: 'Science',
  schoolName: 'Questify Academy International',
  defaultBoard: 'cambridge-sri-lanka',
  defaultLevel: 'cambridge-ol',
  defaultSubject: 'Biology',
  language: 'English (UK)',
  timezone: 'GMT +05:30 (Sri Lanka)',
  notifications: {
    email: true,
    inApp: true,
    weekly: false
  }
};

/**
 * Get user settings (with defaults).
 * @returns {object}
 */
export const getSettings = () => ({
  ...DEFAULT_SETTINGS,
  ...readJSON(KEYS.SETTINGS, {})
});

/**
 * Save user settings (merges with existing).
 * @param {object} updates
 * @returns {object} Full updated settings
 */
export const saveSettings = (updates) => {
  const current = getSettings();
  const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.SETTINGS, merged);
  return merged;
};

// ============================================================
// Activity Log API
// ============================================================

/**
 * Log an activity item.
 * @param {object} item - { type, title, subject, paperId, etc. }
 */
export const logActivity = (item) => {
  const activity = readJSON(KEYS.ACTIVITY, []);
  const newItem = {
    ...item,
    id: generateId(),
    timestamp: new Date().toISOString()
  };
  activity.unshift(newItem);
  // Keep only last 50 items
  writeJSON(KEYS.ACTIVITY, activity.slice(0, 50));
};

/**
 * Get recent activity.
 * @param {number} limit - Max items to return
 * @returns {Array}
 */
export const getActivity = (limit = 20) =>
  readJSON(KEYS.ACTIVITY, []).slice(0, limit);

/**
 * Clear all activity logs.
 */
export const clearActivity = () => writeJSON(KEYS.ACTIVITY, []);

// ============================================================
// Full DB export
// ============================================================

const db = {
  // Papers
  savePaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  getPaperStats,

  // Settings
  getSettings,
  saveSettings,

  // Activity
  logActivity,
  getActivity,
  clearActivity
};

export default db;
