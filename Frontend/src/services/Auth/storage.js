// Token and Storage Utilities
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './config';

// ============================================
// Token Management
// ============================================

/**
 * Save token to localStorage
 */
export function saveToken(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
  }
}

/**
 * Get token from localStorage
 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

/**
 * Remove token from localStorage
 */
export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
}

/**
 * Check if token exists
 */
export function hasToken() {
  return !!getToken();
}

// ============================================
// User Storage
// ============================================

/**
 * Save user to localStorage
 */
export function saveUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}

/**
 * Get user from localStorage
 */
export function getUser() {
  try {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

/**
 * Remove user from localStorage
 */
export function removeUser() {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
}

// ============================================
// Combined Auth Storage
// ============================================

/**
 * Clear all auth data from storage
 */
export function clearAuthStorage() {
  removeToken();
  removeUser();
}

/**
 * Save auth data (token and user) to storage
 */
export function saveAuthData(token, user) {
  saveToken(token);
  saveUser(user);
}

/**
 * Get auth data from storage
 */
export function getAuthData() {
  return {
    token: getToken(),
    user: getUser(),
  };
}

// ============================================
// Token Validation
// ============================================

/**
 * Parse JWT token payload (without verification)
 */
export function parseToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token) {
  const payload = parseToken(token);
  if (!payload) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  return payload.exp * 1000 < Date.now();
}

/**
 * Check if stored token is valid (exists and not expired)
 */
export function isValidToken() {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}