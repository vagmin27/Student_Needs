import { referralsApiClient as api } from '@/services/apiClient.js';

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

/**
 * API service for handling AI Interview functionalities
 */
export const interviewApi = {
  /**
   * Get signed URL for ElevenLabs conversation
   * @returns {Promise<{success: boolean, signedUrl: string, message: string}>}
   */
  getSignedUrl: async () => {
    const response = await api.get('/interview/signed-url');
    return response.data;
  },
};
