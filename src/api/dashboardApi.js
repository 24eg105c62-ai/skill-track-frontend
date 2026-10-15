import { apiRequest } from './client';

export const dashboardApi = {
  getOverview: () =>
    apiRequest('/dashboard/overview', {
      method: 'GET',
    }),
};
