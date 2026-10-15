import { apiRequest } from './client';

export const quizApi = {
  getQuizQuestions: (topicId, difficulty) => {
    const query = difficulty ? `?difficulty=${difficulty}` : '';
    return apiRequest(`/quizzes/topics/${topicId}${query}`, { method: 'GET' });
  },

  submitQuiz: (submissionData) =>
    apiRequest('/quizzes/attempts', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    }),

  getHistory: (page = 0, size = 10) =>
    apiRequest(`/quizzes/history?page=${page}&size=${size}`, { method: 'GET' }),
};
