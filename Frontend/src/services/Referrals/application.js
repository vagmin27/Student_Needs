import { referralsApiClient as api } from '@/services/apiClient.js';

export const applicationsApi = {
  /**
   * Get all applications for a specific opportunity (Alumni only - owner)
   * @param opportunityId - ID of the opportunity
   */
  getApplicationsForOpportunity: async (opportunityId) => {
    const response = await api.get(`/applications/${opportunityId}`);
    return response.data;
  },

  /**
   * View a student's profile (Alumni - same college)
   * @param studentId - ID of the student
   */
  getStudentProfile: async (studentId) => {
    const response = await api.get(`/applications/student/${studentId}`);
    return response.data;
  },

  /**
   * Download a student's resume (Alumni - same college)
   * @param studentId - ID of the student
   */
  downloadStudentResume: async (studentId) => {
    const response = await api.get(`/applications/student/${studentId}/resume`, {
      responseType: 'blob',
    });
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'resume.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    // Create blob URL and trigger download
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  /**
   * Shortlist a student application (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  shortlistApplication: async (applicationId) => {
    const response = await api.post(`/applications/${applicationId}/shortlist`);
    return response.data;
  },

  /**
   * Mark an application as referred (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  referApplication: async (applicationId) => {
    const response = await api.post(`/applications/${applicationId}/refer`);
    return response.data;
  },

  /**
   * Reject a student application (Alumni only - owner)
   * @param applicationId - ID of the application
   */
  rejectApplication: async (applicationId) => {
    const response = await api.post(`/applications/${applicationId}/reject`);
    return response.data;
  },

  /**
   * Get all applications for the logged-in student
   * @param status - Optional filter by status (Applied, Shortlisted, Referred, Rejected)
   * @param page - Page number for pagination
   * @param limit - Number of items per page
   */
  getMyApplications: async (status, page = 1, limit = 20) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/my-applications?${params.toString()}`);
    return response.data;
  },

  /**
   * Get all verified candidates for the logged-in alumni
   */
  getVerifiedCandidates: async () => {
    const response = await api.get(`/verified-candidates`);
    return response.data;
  },

  /**
   * Get all applications grouped by role (Alumni only)
   */
  getApplications: async () => {
    const response = await api.get(`/applications`);
    return response.data;
  },

  /**
   * Approve an application by ID (Alumni only)
   */
  approveApplication: async (id) => {
    const response = await api.post(`/applications/${id}/approve`);
    return response.data;
  },
};
