import { apiRequest } from './client';

export const achievementApi = {
  getMyAchievements: () =>
    apiRequest('/achievements', { method: 'GET' }),

  getFeed: (page = 0, size = 10) =>
    apiRequest(`/achievements/feed?page=${page}&size=${size}`, { method: 'GET' }),

  react: (achievementId, reactionType) =>
    apiRequest(`/achievements/${achievementId}/react`, {
      method: 'POST',
      body: JSON.stringify({ reactionType }),
    }),

  getComments: (achievementId) =>
    apiRequest(`/achievements/${achievementId}/comments`, { method: 'GET' }),

  addComment: (achievementId, commentText) =>
    apiRequest(`/achievements/${achievementId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ commentText }),
    }),

  deleteComment: (commentId) =>
    apiRequest(`/achievements/comments/${commentId}`, { method: 'DELETE' }),
};
