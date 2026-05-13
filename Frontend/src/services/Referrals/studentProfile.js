import axios from 'axios';
import { API_BASE_URL } from '@/services/Auth/config.js';

// Create axios instance with base configuration
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
      // Token is invalid or missing
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Redirect to login page
      window.location.href = '/auth/student/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// Profile API Functions
// ============================================

export const studentProfileApi = {
  /**
   * Get student profile
   * @returns {Promise<Object>} ProfileResponse
   */
  getProfile: async () => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  /**
   * Update student profile (branch, graduationYear, skills, projects, etc.)
   * @param {Object} data - UpdateProfilePayload
   * @returns {Promise<Object>} ProfileResponse
   */
  updateProfile: async (data) => {
    const response = await api.put('/student/profile', data);
    return response.data;
  },

  /**
   * Get profile completion status
   * @returns {Promise<Object>} ProfileStatusResponse
   */
  getProfileStatus: async () => {
    const response = await api.get('/student/profile/status');
    return response.data;
  },
};

// ============================================
// Resume API Functions
// ============================================

export const resumeApi = {
  /**
   * Upload resume PDF (first time)
   * @param {File} file - PDF file to upload
   * @returns {Promise<Object>} ResumeUploadResponse
   */
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/student/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update/replace existing resume PDF
   * @param {File} file - New PDF file to upload
   * @returns {Promise<Object>} ResumeUploadResponse
   */
  updateResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.put('/student/resume/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download resume PDF
   * @returns {Promise<Blob>} PDF file as Blob
   */
  getResume: async () => {
    const response = await api.get('/student/resume', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete resume PDF
   * @returns {Promise<Object>} DeleteResponse
   */
  deleteResume: async () => {
    const response = await api.delete('/student/resume');
    return response.data;
  },
};

// ============================================
// LinkedIn API Functions
// ============================================

export const linkedInApi = {
  /**
   * Upload LinkedIn PDF with optional URL (first time)
   * @param {File} file - LinkedIn PDF file
   * @param {string} [linkedInUrl] - Optional LinkedIn profile URL
   * @returns {Promise<Object>} LinkedInUploadResponse
   */
  uploadLinkedIn: async (file, linkedInUrl) => {
    const formData = new FormData();
    formData.append('linkedIn', file);
    if (linkedInUrl) {
      formData.append('linkedInUrl', linkedInUrl);
    }
    
    const response = await api.post('/student/linkedin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update only LinkedIn URL (without changing PDF)
   * @param {string} linkedInUrl - New LinkedIn profile URL
   * @returns {Promise<Object>} LinkedInUrlResponse
   */
  updateLinkedInUrl: async (linkedInUrl) => {
    const response = await api.put('/student/linkedin/url', { linkedInUrl });
    return response.data;
  },

  /**
   * Update only LinkedIn PDF (without changing URL)
   * @param {File} file - New LinkedIn PDF file
   * @returns {Promise<Object>} LinkedInUploadResponse
   */
  updateLinkedInPdf: async (file) => {
    const formData = new FormData();
    formData.append('linkedIn', file);
    
    const response = await api.put('/student/linkedin/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download LinkedIn PDF
   * @returns {Promise<Blob>} PDF file as Blob
   */
  getLinkedIn: async () => {
    const response = await api.get('/student/linkedin', {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete LinkedIn PDF
   * @returns {Promise<Object>} DeleteResponse
   */
  deleteLinkedIn: async () => {
    const response = await api.delete('/student/linkedin');
    return response.data;
  },
};

// ============================================
// GitHub URL API Functions
// ============================================

export const githubApi = {
  /**
   * Add GitHub URL (first time)
   * @param {string} githubUrl - GitHub profile URL
   * @returns {Promise<Object>} GithubUrlResponse
   */
  addGithubUrl: async (githubUrl) => {
    const response = await api.post('/student/github', { githubUrl });
    return response.data;
  },

  /**
   * Update GitHub URL
   * @param {string} githubUrl - New GitHub profile URL
   * @returns {Promise<Object>} GithubUrlResponse
   */
  updateGithubUrl: async (githubUrl) => {
    const response = await api.put('/student/github', { githubUrl });
    return response.data;
  },

  /**
   * Get GitHub URL
   * @returns {Promise<Object>} GithubUrlResponse
   */
  getGithubUrl: async () => {
    const response = await api.get('/student/github');
    return response.data;
  },

  /**
   * Delete GitHub URL
   * @returns {Promise<Object>} DeleteResponse
   */
  deleteGithubUrl: async () => {
    const response = await api.delete('/student/github');
    return response.data;
  },
};