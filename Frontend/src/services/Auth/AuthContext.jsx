// Authentication Context Provider
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import * as api from './api';
import * as storage from './storage';

// ============================================
// Initial State
// ============================================

/** @type {Object} */
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check stored auth
  error: null,
};

// ============================================
// Reducer
// ============================================

/**
 * @param {Object} state 
 * @param {Object} action 
 */
function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'INIT_COMPLETE':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}

// ============================================
// Context Creation
// ============================================

const AuthContext = createContext(undefined);

// ============================================
// Provider Component
// ============================================

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (storage.isValidToken()) {
          const { token, user } = storage.getAuthData();
          if (token && user) {
            dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } });
            return;
          }
        }
        // Clear any stale data
        storage.clearAuthStorage();
        dispatch({ type: 'INIT_COMPLETE' });
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        storage.clearAuthStorage();
        dispatch({ type: 'INIT_COMPLETE' });
      }
    };

    initializeAuth();
  }, []);

  // Helper to handle successful authentication
  const handleAuthSuccess = useCallback((response) => {
    if (response.success && response.token && response.user) {
      storage.saveAuthData(response.token, response.user);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: response.user, token: response.token },
      });
    }
  }, []);

  // ============================================
  // Student Authentication
  // ============================================

  const studentSignup = useCallback(async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.studentSignup(data);
      if (response.success) {
        handleAuthSuccess(response);
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, message };
    }
  }, [handleAuthSuccess]);

  const studentLogin = useCallback(async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.studentLogin(data);
      if (response.success) {
        handleAuthSuccess(response);
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, message };
    }
  }, [handleAuthSuccess]);

  // ============================================
  // Alumni Authentication
  // ============================================

  const alumniSignup = useCallback(async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.alumniSignup(data);
      if (response.success) {
        handleAuthSuccess(response);
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, message };
    }
  }, [handleAuthSuccess]);

  const alumniLogin = useCallback(async (data) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.alumniLogin(data);
      if (response.success) {
        handleAuthSuccess(response);
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: response.message });
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, message };
    }
  }, [handleAuthSuccess]);

  // ============================================
  // Common Methods
  // ============================================

  const logout = useCallback(() => {
    storage.clearAuthStorage();
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const setUser = useCallback((user) => {
    storage.saveUser(user);
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  // ============================================
  // Context Value
  // ============================================

  const contextValue = {
    ...state,
    studentSignup,
    studentLogin,
    alumniSignup,
    alumniLogin,
    logout,
    clearError,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}