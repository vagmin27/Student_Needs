// Authentication API Service Layer
import { AUTH_ENDPOINTS } from './config';

/**
 * Generic fetch wrapper for API calls
 */
async function apiRequest(url, options) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for token handling
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
}

// ============================================
// Student Authentication API
// ============================================

/**
 * Register a new student
 */
export async function studentSignup(payload) {
  return apiRequest(AUTH_ENDPOINTS.student.signup, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login an existing student
 */
export async function studentLogin(payload) {
  return apiRequest(AUTH_ENDPOINTS.student.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================
// Alumni Authentication API
// ============================================

/**
 * Register a new alumni
 */
export async function alumniSignup(payload) {
  return apiRequest(AUTH_ENDPOINTS.alumni.signup, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login an existing alumni
 */
export async function alumniLogin(payload) {
  return apiRequest(AUTH_ENDPOINTS.alumni.login, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ============================================
// Authenticated API Request Helper
// ============================================

/**
 * Make an authenticated API request with token
 */
export async function authenticatedRequest(url, token, options = {}) {
  return apiRequest(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}