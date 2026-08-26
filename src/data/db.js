/**
 * QUESTIFY — Firestore database utility
 *
 * Papers are stored in the `papers` collection, scoped to the signed-in user.
 * User profiles live at `users/{uid}`.
 * Settings and activity remain in localStorage until those screens are wired.
 */

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { auth, db as firestore } from '../firebase';

const KEYS = {
  SETTINGS: 'questify_settings',
  ACTIVITY: 'questify_activity',
};

const requireUser = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be signed in to access papers.');
  }
  return user;
};

const papersCol = () => collection(firestore, 'papers');
const questionsCol = () => collection(firestore, 'questions');

const toPaper = (snapshot) => ({
  id: snapshot.id,
  ...snapshot.data(),
});

const sortByCreatedAtDesc = (papers) =>
  [...papers].sort((a, b) => {
    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });

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

export const savePaper = async (paper) => {
  const user = requireUser();
  const now = new Date().toISOString();
  const payload = {
    title: paper.title,
    subject: paper.subject ?? null,
    exam_board: paper.exam_board ?? null,
    qualification_level: paper.qualification_level ?? null,
    template_type: paper.template_type ?? null,
    type_counts: paper.type_counts ?? null,
    bloom_distribution: paper.bloom_distribution ?? null,
    ao_distribution: paper.ao_distribution ?? null,
    total_marks: paper.total_marks ?? 0,
    question_count: paper.question_count ?? 0,
    duration_minutes: paper.duration_minutes ?? null,
    topic_labels: paper.topic_labels ?? [],
    userId: user.uid,
    created_at: now,
    updated_at: now,
  };
  const ref = await addDoc(papersCol(), payload);
  return { id: ref.id, ...payload };
};

export const saveQuestions = async (paperId, paperMeta, questions) => {
  const user = requireUser();
  const now = new Date().toISOString();
  const saved = [];
  for (const q of questions || []) {
    const payload = {
      paperId,
      paperTitle: paperMeta.title ?? null,
      userId: user.uid,
      text: q.text,
      answer: q.answer ?? null,
      mark_value: q.mark_value ?? q.marks ?? 1,
      bloom_level: q.bloom_level ?? q.bloom ?? null,
      ao_code: q.ao_code ?? q.ao ?? null,
      question_type: q.question_type ?? q.type ?? null,
      options: q.options ?? null,
      correct_option: q.correct_option ?? q.correctOption ?? null,
      parts: q.parts ?? null,
      marking_scheme: q.marking_scheme ?? null,
      topic: q.topic ?? null,
      subject: paperMeta.subject ?? null,
      exam_board: paperMeta.exam_board ?? null,
      qualification_level: paperMeta.qualification_level ?? null,
      created_at: now,
    };
    const ref = await addDoc(questionsCol(), payload);
    saved.push({ id: ref.id, ...payload });
  }
  return saved;
};

export const saveGeneratedAssessment = async (paper, questions) => {
  const savedPaper = await savePaper(paper);
  const savedQuestions = await saveQuestions(savedPaper.id, savedPaper, questions);
  return { paper: savedPaper, questions: savedQuestions };
};

export const getQuestions = async () => {
  const user = requireUser();
  const q = query(questionsCol(), where('userId', '==', user.uid));
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
};

export const getQuestionsByPaperId = async (paperId) => {
  const all = await getQuestions();
  return all.filter((q) => q.paperId === paperId);
};

export const getPapers = async () => {
  const user = requireUser();
  const q = query(papersCol(), where('userId', '==', user.uid));
  const snap = await getDocs(q);
  return sortByCreatedAtDesc(snap.docs.map(toPaper));
};

export const getPaperById = async (id) => {
  const user = requireUser();
  const snapshot = await getDoc(doc(firestore, 'papers', id));
  if (!snapshot.exists()) return null;
  const paper = toPaper(snapshot);
  if (paper.userId !== user.uid) return null;
  return paper;
};

export const updatePaper = async (id, updates) => {
  const existing = await getPaperById(id);
  if (!existing) return null;
  const payload = {
    ...updates,
    userId: existing.userId,
    updated_at: new Date().toISOString(),
  };
  await updateDoc(doc(firestore, 'papers', id), payload);
  return { ...existing, ...payload, id };
};

export const deletePaper = async (id) => {
  const existing = await getPaperById(id);
  if (!existing) return false;
  await deleteDoc(doc(firestore, 'papers', id));
  return true;
};

export const getPaperStats = async () => {
  const papers = await getPapers();
  return {
    totalPapers: papers.length,
    totalQuestions: papers.reduce((sum, p) => sum + (p.question_count || p.questions?.length || 0), 0),
    subjects: [...new Set(papers.map((p) => p.subject).filter(Boolean))],
    recentPapers: papers.slice(0, 5),
  };
};

const userDoc = (uid) => doc(firestore, 'users', uid);

export const getUserProfile = async (uid) => {
  const snapshot = await getDoc(userDoc(uid));
  if (!snapshot.exists()) return null;
  return { uid: snapshot.id, ...snapshot.data() };
};

export const createUserProfile = async (uid, { name, email, jobTitle, department }) => {
  const now = new Date().toISOString();
  const payload = {
    name: (name || '').trim(),
    email: email || '',
    jobTitle: (jobTitle || '').trim(),
    department: (department || '').trim(),
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(userDoc(uid), payload);
  return { uid, ...payload };
};

export const updateUserProfile = async (uid, updates) => {
  const now = new Date().toISOString();
  const payload = {
    name: (updates.name || '').trim(),
    jobTitle: (updates.jobTitle || '').trim(),
    department: (updates.department || '').trim(),
    updatedAt: now,
  };
  if (updates.email) payload.email = updates.email;
  await setDoc(userDoc(uid), payload, { merge: true });
  const snapshot = await getDoc(userDoc(uid));
  return { uid, ...snapshot.data() };
};

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
    weekly: false,
  },
};

export const getSettings = () => ({
  ...DEFAULT_SETTINGS,
  ...readJSON(KEYS.SETTINGS, {}),
});

export const saveSettings = (updates) => {
  const current = getSettings();
  const merged = { ...current, ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.SETTINGS, merged);
  return merged;
};

export const logActivity = (item) => {
  const activity = readJSON(KEYS.ACTIVITY, []);
  const newItem = {
    ...item,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };
  activity.unshift(newItem);
  writeJSON(KEYS.ACTIVITY, activity.slice(0, 50));
};

export const getActivity = (limit = 20) =>
  readJSON(KEYS.ACTIVITY, []).slice(0, limit);

export const clearActivity = () => writeJSON(KEYS.ACTIVITY, []);

const db = {
  savePaper,
  saveQuestions,
  saveGeneratedAssessment,
  getPapers,
  getPaperById,
  getQuestions,
  getQuestionsByPaperId,
  updatePaper,
  deletePaper,
  getPaperStats,
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getSettings,
  saveSettings,
  logActivity,
  getActivity,
  clearActivity,
};

export default db;
