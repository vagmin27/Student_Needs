// Auth Module - Main Export File
// This file exports all authentication-related modules

// Context and Provider
export { AuthProvider, useAuth } from './AuthContext';

// API functions
export {
  studentSignup,
  studentLogin,
  alumniSignup,
  alumniLogin,
  authenticatedRequest,
} from './api';

// Storage utilities
export {
  saveToken,
  getToken,
  removeToken,
  hasToken,
  saveUser,
  getUser,
  removeUser,
  clearAuthStorage,
  saveAuthData,
  getAuthData,
  parseToken,
  isTokenExpired,
  isValidToken,
} from './storage';

// Hooks
export {
  useAuthForm,
  useStudentSignup,
  useStudentLogin,
  useAlumniSignup,
  useAlumniLogin,
  useRoleBasedAuth,
} from './hooks';

// Route Guards
export {
  ProtectedRoute,
  PublicRoute,
  useRoleRedirect,
} from './ProtectedRoute';

// Role Integration (for RoleSelector.tsx)
export {
  useRoleAuth,
  accountTypeToRole,
  roleToAccountType,
} from './roleIntegration';

// Config
export {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
} from './config';

// Note: Auth page components are located in:
// - @/components/Student/Auth/ (StudentLoginPage, StudentSignupPage)
// - @/components/Alumni/Auth/ (AlumniLoginPage, AlumniSignupPage)
// - @/components/Verifier/Auth/ (VerifierLoginPage, VerifierSignupPage)