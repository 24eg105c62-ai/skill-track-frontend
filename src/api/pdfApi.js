import { apiRequest } from './client';

export const pdfApi = {
  uploadPdf: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest('/pdf/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getMyDocuments: () =>
    apiRequest('/pdf/my-documents', { method: 'GET' }),

  getSummary: (docId) =>
    apiRequest(`/pdf/${docId}/summary`, { method: 'GET' }),
};
