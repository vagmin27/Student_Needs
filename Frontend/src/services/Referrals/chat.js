import { referralsApiClient as api } from "@/services/apiClient.js";

export const chatApi = {
  /**
   * Get all conversations for the current user
   * @returns {Promise<Object>} List of chats
   */
  getChats: async () => {
    const response = await api.get("/chats");
    return response.data;
  },

  /**
   * Fetch paginated message history for a conversation
   * @param {string} chatId
   * @param {Object} params - { page, limit }
   * @returns {Promise<Object>} Messages page
   */
  getMessages: async (chatId, params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    
    const response = await api.get(`/chats/${chatId}/messages?${query.toString()}`);
    return response.data;
  },

  /**
   * Send a text message
   * @param {string} chatId
   * @param {Object} data - { text, replyTo }
   * @returns {Promise<Object>} Sent message
   */
  sendMessage: async (chatId, data) => {
    const response = await api.post(`/chats/${chatId}/messages`, data);
    return response.data;
  },

  /**
   * Upload an attachment file
   * @param {string} chatId
   * @param {File} file
   * @param {string} [replyTo]
   * @returns {Promise<Object>} Sent message containing file metadata
   */
  uploadAttachment: async (chatId, file, replyTo) => {
    const formData = new FormData();
    formData.append("file", file);
    if (replyTo) {
      formData.append("replyTo", replyTo);
    }

    const response = await api.post(`/chats/${chatId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Mark all messages in conversation as read
   * @param {string} chatId
   * @returns {Promise<Object>} Result
   */
  markRead: async (chatId) => {
    const response = await api.post(`/chats/${chatId}/read`);
    return response.data;
  },

  /**
   * Edit a text message
   * @param {string} messageId
   * @param {string} text
   * @returns {Promise<Object>} Edited message
   */
  editMessage: async (messageId, text) => {
    const response = await api.put(`/chats/messages/${messageId}`, { text });
    return response.data;
  },

  /**
   * Delete a message (soft delete)
   * @param {string} messageId
   * @returns {Promise<Object>} Result
   */
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/chats/messages/${messageId}`);
    return response.data;
  },
};
