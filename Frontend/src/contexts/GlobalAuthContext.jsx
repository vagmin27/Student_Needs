import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { attendanceApiClient, referralsApiClient, tutorsApiClient } from '@/services/apiClient.js';
import { AUTH_ENDPOINTS } from '@/services/Referrals/Auth/config.js';

const GlobalAuthContext = createContext();

export const useAuth = () => {
  const context = useContext(GlobalAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user') || localStorage.getItem('User') || localStorage.getItem('auth_user');
        
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const resolvedRole = (parsedUser.role || parsedUser.accountType || "student").toLowerCase();
          const normalizedUser = {
            ...parsedUser,
            role: resolvedRole,
            accountType: resolvedRole
          };
          setToken(storedToken);
          setUser(normalizedUser);
          // Sync keys to ensure all sub-modules (like Expenses) read correctly
          localStorage.setItem('token', storedToken);
          localStorage.setItem('auth_token', storedToken);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
          localStorage.setItem('User', JSON.stringify(normalizedUser));
          localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
          localStorage.setItem('auth_data', JSON.stringify({ token: storedToken, user: normalizedUser }));
        } else {
          // Check Referrals fallback
          const referralAuth = localStorage.getItem('auth_data');
          if (referralAuth) {
             const parsed = JSON.parse(referralAuth);
             if (parsed.token && parsed.user) {
                const resolvedRole = (parsed.user.role || parsed.user.accountType || "student").toLowerCase();
                const normalizedUser = {
                  ...parsed.user,
                  role: resolvedRole,
                  accountType: resolvedRole
                };
                setToken(parsed.token);
                setUser(normalizedUser);
                localStorage.setItem('token', parsed.token);
                localStorage.setItem('auth_token', parsed.token);
                localStorage.setItem('user', JSON.stringify(normalizedUser));
                localStorage.setItem('User', JSON.stringify(normalizedUser));
                localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
                localStorage.setItem('auth_data', JSON.stringify({ token: parsed.token, user: normalizedUser }));
             }
          }
        }
        await fetchUser();
      } catch (err) {
        console.error("Failed to parse user data", err);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const handleAuthSuccess = (newToken, newUser) => {
    const resolvedRole = (newUser.role || newUser.accountType || "student").toLowerCase();
    const normalizedUser = {
      ...newUser,
      role: resolvedRole,
      accountType: resolvedRole
    };
    setToken(newToken);
    setUser(normalizedUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('User', JSON.stringify(normalizedUser));
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
    localStorage.setItem('auth_data', JSON.stringify({ token: newToken, user: normalizedUser }));
  };

  const logout = useCallback(async () => {
    try { await tutorsApiClient.post("/logout"); } catch (_) {}
    setToken(null);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/role-selection';
  }, []);

  // -----------------------------------------------------
  // REFERRALS AUTH (Student / Alumni / Verifier)
  // -----------------------------------------------------
  
  const studentSignup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.student.signup, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    } finally { setLoading(false); }
  };

  const studentLogin = async (payload) => {
    setLoading(true);
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.student.login, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally { setLoading(false); }
  };

  const alumniSignup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.signup, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    } finally { setLoading(false); }
  };

  const alumniLogin = async (payload) => {
    setLoading(true);
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.login, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    } finally { setLoading(false); }
  };

  // -----------------------------------------------------
  // ATTENDANCE & TUTORIALS AUTH (Legacy)
  // -----------------------------------------------------

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Trying Attendance login fallback if the generic login is called
      const { data } = await attendanceApiClient.post('/auth/login', { email, password });
      if (data.token) {
        handleAuthSuccess(data.token, data.user);
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await tutorsApiClient.get("/user");
      if (data?.user) {
        const resolvedRole = (data.user.role || data.user.accountType || "student").toLowerCase();
        const normalizedUser = {
          ...data.user,
          role: resolvedRole,
          accountType: resolvedRole
        };
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('User', JSON.stringify(normalizedUser));
        
        let storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (!storedToken) {
          const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
          const payload = btoa(JSON.stringify({ id: normalizedUser._id || normalizedUser.id, role: resolvedRole }));
          storedToken = `${header}.${payload}.dummy_signature`;
          localStorage.setItem('token', storedToken);
          localStorage.setItem('auth_token', storedToken);
        }
        setToken(storedToken);
        localStorage.setItem('auth_data', JSON.stringify({ token: storedToken, user: normalizedUser }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    isInitialized: true,
    isTeacher: user?.role === 'teacher' || user?.role === 'tutor' || user?.accountType === 'tutor' || user?.accountType === 'teacher',
    isStudent: user?.role === 'student' || user?.accountType === 'student',
    isTutor: user?.role === 'tutor' || user?.accountType === 'tutor',
    isAlumni: user?.role === 'alumni' || user?.accountType === 'alumni',
    isVerifier: user?.role === 'verifier' || user?.accountType === 'verifier',
    
    // Actions
    login,
    logout,
    studentSignup,
    studentLogin,
    alumniSignup,
    alumniLogin,
    fetchUser,
    clearError,
    setUser: (u) => {
      if (u) {
        const resolvedRole = (u.role || u.accountType || "student").toLowerCase();
        const normalized = {
          ...u,
          role: resolvedRole,
          accountType: resolvedRole
        };
        setUser(normalized);
        const currentToken = localStorage.getItem('token') || localStorage.getItem('auth_token') || u.token;
        if (currentToken) {
          setToken(currentToken);
          localStorage.setItem('token', currentToken);
          localStorage.setItem('auth_token', currentToken);
        }
        localStorage.setItem('user', JSON.stringify(normalized));
        localStorage.setItem('User', JSON.stringify(normalized));
        localStorage.setItem('auth_user', JSON.stringify(normalized));
        localStorage.setItem('auth_data', JSON.stringify({ token: currentToken, user: normalized }));
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('User');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_data');
      }
    }
  };

  return (
    <GlobalAuthContext.Provider value={value}>
      {children}
    </GlobalAuthContext.Provider>
  );
};
