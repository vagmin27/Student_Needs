// API Configuration

// Base API URL - can be configured via environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://next-ref-alumni-connect.onrender.com/api/v1";

// Auth API endpoints
export const AUTH_ENDPOINTS = {
  student: {
    signup: `${API_BASE_URL}/student/signup`,
    login: `${API_BASE_URL}/student/login`,
  },
  alumni: {
    signup: `${API_BASE_URL}/alumni/signup`,
    login: `${API_BASE_URL}/alumni/login`,
  },
};

// Token storage key
export const TOKEN_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'auth_user';