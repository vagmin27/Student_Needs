import { referralsApiClient as api } from '@/services/apiClient.js';

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or missing
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Redirect to login page
      window.location.href = '/auth/student/login';
    }
    return Promise.reject(error);
  }
);

export const externalJobsApi = {
  // Get external jobs
  getExternalJobs: async (page = 1) => {
    const response = await api.get(`/student/jobs/external`, {
      params: { page }
    });
    return response.data;
  },

  // Search external jobs
  searchExternalJobs: async (search, page = 1) => {
    const response = await api.get(`/student/jobs/external/search`, {
      params: { search, page }
    });
    return response.data;
  },
};
