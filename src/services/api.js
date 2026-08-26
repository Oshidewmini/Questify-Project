import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPapers = async () => {
  const response = await api.get('/papers/');
  return response.data;
};

export const getPaperById = async (id) => {
  const response = await api.get(`/papers/${id}`);
  return response.data;
};

export const createPaper = async (paperData) => {
  const response = await api.post('/papers/', paperData);
  return response.data;
};

export const deletePaper = async (id) => {
  const response = await api.delete(`/papers/${id}`);
  return response.data;
};

export const extractDocuments = async (files, labels) => {
  const form = new FormData();
  files.forEach((file) => form.append('files', file));
  labels.forEach((label) => form.append('labels', label));
  form.append('labels_json', JSON.stringify(labels));
  const response = await api.post('/extract', form, {
    timeout: 120000,
    transformRequest: [
      (data, headers) => {
        if (headers) {
          delete headers['Content-Type'];
          if (typeof headers.set === 'function') headers.set('Content-Type', undefined);
        }
        return data;
      },
    ],
  });
  return response.data;
};

export const generateQuestions = async (payload) => {
  const response = await api.post('/generate', payload, {
    timeout: 600000,
  });
  return response.data;
};

export const exportDocx = async (payload) => {
  const response = await api.post('/export/docx', payload, {
    responseType: 'blob',
    timeout: 60000,
  });
  return response.data;
};

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const buildExportPayload = (header, questions) => ({
  header: {
    title: header.title,
    exam_board: header.exam_board,
    qualification_level: header.qualification_level,
    subject: header.subject,
    duration_minutes: header.duration_minutes || 60,
  },
  questions: (questions || []).map((q) => ({
    text: q.text,
    answer: q.answer || null,
    mark_value: q.mark_value || q.marks || 1,
    bloom_level: q.bloom_level || q.bloom || 'Remember',
    ao_code: q.ao_code || q.ao || 'AO1',
    question_type: q.question_type || q.type || 'Short Answer',
    options: q.options || null,
    correct_option: q.correct_option || q.correctOption || null,
    parts: q.parts || null,
    marking_scheme: q.marking_scheme || null,
    topic: q.topic || null,
  })),
});

export default api;
