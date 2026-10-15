import { apiRequest } from './client';

export const predictionApi = {
  getMyPrediction: () =>
    apiRequest('/predictions/my-prediction', { method: 'GET' }),
};
