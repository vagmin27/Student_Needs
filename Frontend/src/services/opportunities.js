import axios from 'axios';
import { API_BASE_URL } from '@/services/Auth/config';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      const currentPath = window.location.pathname;
      if (currentPath.includes('/student')) {
        window.location.href = '/auth/student/login';
      } else if (currentPath.includes('/alumni')) {
        window.location.href = '/auth/alumni/login';
      } else {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * @namespace opportunitiesApi
 */
export const opportunitiesApi = {
  /**
   * Create a new opportunity (Alumni only)
   * @param {Object} payload - The job details (title, description, skills, etc.)
   * @returns {Promise<Object>}
   */
  createOpportunity: async (payload) => {
    const response = await api.post('/opportunities/create', payload);
    return response.data;
  },

  /**
   * Update an opportunity (Alumni only - owner)
   * @param {string} opportunityId 
   * @param {Object} payload 
   * @returns {Promise<Object>}
   */
  updateOpportunity: async (opportunityId, payload) => {
    const response = await api.put(`/opportunities/${opportunityId}`, payload);
    return response.data;
  },

  /**
   * Delete/Close an opportunity (Alumni only - owner)
   * @param {string} opportunityId 
   * @returns {Promise<{success: boolean, message: string}>}
   */
  deleteOpportunity: async (opportunityId) => {
    const response = await api.delete(`/opportunities/${opportunityId}`);
    return response.data;
  },

  /**
   * Get all opportunities from same college
   * @returns {Promise<Object>}
   */
  getOpportunities: async () => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  /**
   * Get my posted opportunities (Alumni only)
   * @returns {Promise<Object>}
   */
  getMyOpportunities: async () => {
    const response = await api.get('/my-opportunities');
    return response.data;
  },

  /**
   * Apply for referral with interview scores
   * @param {string} opportunityId 
   * @returns {Promise<Object>}
   */
  applyForReferral: async (opportunityId) => {
    const scoresData = localStorage.getItem('interviewScores');
    const scores = scoresData ? JSON.parse(scoresData) : {};

    const response = await api.post('/apply', {
      opportunityId,
      profileScore: scores.profileScore || null,
      interviewScore: scores.interviewScore || null,
    });

    localStorage.removeItem('interviewScores');
    return response.data;
  },

  /**
   * Get my applications
   * @returns {Promise<Object>}
   */
  getMyApplications: async () => {
    const response = await api.get('/my-applications');
    return response.data;
  },

  /**
   * Get application details
   * @param {string} applicationId 
   * @returns {Promise<Object>}
   */
  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/my-applications/${applicationId}`);
    return response.data;
  },
};