import { apiRequest } from './client';

export const authApi = {
  login: (credentials) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (studentData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  getMe: () =>
    apiRequest('/auth/me', {
      method: 'GET',
    }),

  updateProfile: (profileData) =>
    apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

