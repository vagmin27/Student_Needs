import axios from 'axios';

// Use backend proxy instead of calling external API directly
// This avoids CORS issues
const ANALYZE_API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1'}/analyze`;

export const analyzeApi = {
  /**
   * Analyze candidate profile against target role
   * Calls backend proxy endpoint which forwards to external API
   * @param resume - Resume PDF file
   * @param linkedin - LinkedIn PDF file
   * @param github_url - GitHub profile URL
   * @param target_role - Target job role
   */
  analyzeProfile: async (
    resume,
    linkedin,
    github_url,
    target_role
  ) => {
    // Initialize FormData to handle file uploads
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('linkedin', linkedin);
    formData.append('github_url', github_url);
    formData.append('target_role', target_role);

    try {
      // Debugging logs for the request
      console.log('Sending analyze request to backend:', ANALYZE_API_URL);
      console.log('FormData contents:', {
        resume: resume.name,
        linkedin: linkedin.name,
        github_url,
        target_role
      });

      // Execute POST request using Axios
      const response = await axios.post(ANALYZE_API_URL, formData, {
        headers: {
          // Retrieve auth token from local storage
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });

      console.log('Analyze API response:', response.data);
      
      // Return the raw data object
      return response.data;
    } catch (error) {
      console.error('Analyze API error:', error);
      
      // Specialized error handling for Axios issues
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          throw new Error(`API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response from server');
          throw new Error('Network Error: No response from analyzer. Check if the API is accessible.');
        }
      }
      
      // Generic error fallback
      throw new Error(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};