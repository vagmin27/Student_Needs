import { referralsApiClient as api } from '@/services/apiClient.js';


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
   * Add LinkedIn URL (first time)
   * @param {string} linkedinUrl - LinkedIn profile URL
   * @returns {Promise<Object>} LinkedInUrlResponse
   */
  addLinkedInUrl: async (linkedinUrl) => {
    const response = await api.post('/student/linkedin', { linkedinUrl });
    return response.data;
  },

  /**
   * Update LinkedIn URL
   * @param {string} linkedinUrl - New LinkedIn profile URL
   * @returns {Promise<Object>} LinkedInUrlResponse
   */
  updateLinkedInUrl: async (linkedinUrl) => {
    const response = await api.put('/student/linkedin', { linkedinUrl });
    return response.data;
  },

  /**
   * Get LinkedIn URL
   * @returns {Promise<Object>} LinkedInUrlResponse
   */
  getLinkedInUrl: async () => {
    const response = await api.get('/student/linkedin');
    return response.data;
  },

  /**
   * Delete LinkedIn URL
   * @returns {Promise<Object>} DeleteResponse
   */
  deleteLinkedInUrl: async () => {
    const response = await api.delete('/student/linkedin');
    return response.data;
  },
};

// ============================================
// Portfolio URL API Functions
// ============================================

export const portfolioApi = {
  /**
   * Add Portfolio URL (first time)
   * @param {string} portfolioUrl - Portfolio URL
   * @returns {Promise<Object>} PortfolioUrlResponse
   */
  addPortfolioUrl: async (portfolioUrl) => {
    const response = await api.post('/student/portfolio', { portfolioUrl });
    return response.data;
  },

  /**
   * Update Portfolio URL
   * @param {string} portfolioUrl - New Portfolio URL
   * @returns {Promise<Object>} PortfolioUrlResponse
   */
  updatePortfolioUrl: async (portfolioUrl) => {
    const response = await api.put('/student/portfolio', { portfolioUrl });
    return response.data;
  },

  /**
   * Get Portfolio URL
   * @returns {Promise<Object>} PortfolioUrlResponse
   */
  getPortfolioUrl: async () => {
    const response = await api.get('/student/portfolio');
    return response.data;
  },

  /**
   * Delete Portfolio URL
   * @returns {Promise<Object>} DeleteResponse
   */
  deletePortfolioUrl: async () => {
    const response = await api.delete('/student/portfolio');
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
