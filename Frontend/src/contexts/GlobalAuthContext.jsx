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
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Check Referrals fallback
          const referralAuth = localStorage.getItem('auth_data');
          if (referralAuth) {
             const parsed = JSON.parse(referralAuth);
             if (parsed.token && parsed.user) {
                setToken(parsed.token);
                setUser(parsed.user);
             }
          }
        }
      } catch (err) {
        console.error("Failed to parse user data", err);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('auth_data', JSON.stringify({ token: newToken, user: newUser }));
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login/student';
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
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
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
    isTeacher: user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'tutor' || user?.accountType?.toLowerCase() === 'tutor',
    isStudent: user?.role?.toLowerCase() === 'student' || user?.accountType?.toLowerCase() === 'student',
    
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
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    }
  };

  return (
    <GlobalAuthContext.Provider value={value}>
      {children}
    </GlobalAuthContext.Provider>
  );
};
