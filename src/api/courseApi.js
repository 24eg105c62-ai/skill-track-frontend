import { apiRequest } from './client';

export const courseApi = {
  getCourses: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.difficulty && params.difficulty !== 'ALL') query.append('difficulty', params.difficulty);
    if (params.page !== undefined) query.append('page', params.page);
    if (params.size !== undefined) query.append('size', params.size);

    return apiRequest(`/courses?${query.toString()}`, { method: 'GET' });
  },

  getCategories: () =>
    apiRequest('/courses/categories', { method: 'GET' }),

  getCourseDetail: (courseId) =>
    apiRequest(`/courses/${courseId}`, { method: 'GET' }),

  enroll: (courseId) =>
    apiRequest(`/courses/${courseId}/enroll`, { method: 'POST' }),

  toggleBookmark: (courseId) =>
    apiRequest(`/courses/${courseId}/bookmark`, { method: 'POST' }),

  getTopicDetail: (topicId) =>
    apiRequest(`/courses/topics/${topicId}`, { method: 'GET' }),

  completeTopic: (topicId) =>
    apiRequest(`/courses/topics/${topicId}/complete`, { method: 'POST' }),

  getMyEnrollments: () =>
    apiRequest('/courses/my-enrollments', { method: 'GET' }),
};
