import { referralsApiClient as api } from '@/services/apiClient.js';

export const alumniProfileApi = {
  /**
   * Get alumni profile
   */
  getProfile: async () => {
    const response = await api.get('/alumni/profile');
    return response.data;
  },

  /**
   * Update alumni profile
   */
  updateProfile: async (data) => {
    const response = await api.put('/alumni/profile', data);
    return response.data;
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    const response = await api.post('/alumni/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Remove profile image
   */
  removeProfileImage: async () => {
    const response = await api.delete('/alumni/profile/image');
    return response.data;
  },
};
