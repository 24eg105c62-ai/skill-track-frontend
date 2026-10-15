import { apiRequest } from './client';

export const adminApi = {
  getOverview: () =>
    apiRequest('/admin/overview', { method: 'GET' }),

  getUsers: (search = '', page = 0, size = 15) => {
    const q = search ? `&search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/admin/users?page=${page}&size=${size}${q}`, { method: 'GET' });
  },

  toggleUserStatus: (userId) =>
    apiRequest(`/admin/users/${userId}/toggle-status`, { method: 'POST' }),

  createCourse: (data) =>
    apiRequest('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCourse: (courseId, data) =>
    apiRequest(`/admin/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteCourse: (courseId) =>
    apiRequest(`/admin/courses/${courseId}`, { method: 'DELETE' }),

  addModule: (courseId, data) =>
    apiRequest(`/admin/courses/${courseId}/modules`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addTopic: (moduleId, data) =>
    apiRequest(`/admin/modules/${moduleId}/topics`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createQuestion: (data) =>
    apiRequest('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteQuestion: (questionId) =>
    apiRequest(`/admin/questions/${questionId}`, { method: 'DELETE' }),

  createAchievement: (data) =>
    apiRequest('/admin/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAuditLogs: (page = 0, size = 20) =>
    apiRequest(`/admin/audit-logs?page=${page}&size=${size}`, { method: 'GET' }),
};
