import axios from 'axios';

// Create Axios instance pointing to the FastAPI backend
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Papers API
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

// Generate Questions (Mock)
export const generateQuestions = async (config) => {
  // Normally this would be a POST to /generate, but we mock it here for the MVP frontend
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { text: 'Describe the process of photosynthesis.', answer: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods from carbon dioxide and water.', bloom_level: 'Understand' },
        { text: 'Calculate the force if mass is 5kg and acceleration is 9.8m/s².', answer: 'F = ma = 5 * 9.8 = 49N', bloom_level: 'Apply' }
      ]);
    }, 2000);
  });
};

export default api;
