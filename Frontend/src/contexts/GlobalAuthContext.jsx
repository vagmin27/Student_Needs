import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { attendanceApiClient, referralsApiClient, tutorsApiClient } from '@/services/apiClient.js';
import { AUTH_ENDPOINTS } from '@/services/Referrals/Auth/config.js';

const GlobalAuthContext = createContext();

const persistAuth = (token, userData) => {
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("auth_token", token);
  }

  if (userData) {
    const serialized = JSON.stringify(userData);

    localStorage.setItem("user", serialized);
    localStorage.setItem("User", serialized);
    localStorage.setItem("auth_user", serialized);
    localStorage.setItem("auth_data", serialized);
  }
};

const jwtDecode = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) throw new Error("Invalid token format");
  const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
  return payload;
};

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
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        let storedUser = localStorage.getItem('user') || localStorage.getItem('User') || localStorage.getItem('auth_user');
        
        if (storedToken && !storedUser) {
          const referralAuth = localStorage.getItem('auth_data');
          if (referralAuth) {
             try {
                const parsed = JSON.parse(referralAuth);
                if (parsed.user) storedUser = JSON.stringify(parsed.user);
                else storedUser = JSON.stringify(parsed);
             } catch (e) {}
          }
        }

        if (storedToken && !storedUser) {
          try {
            const decoded = jwtDecode(storedToken);
            if (decoded) {
              const restoredUser = {
                id: decoded.id || decoded.userId || decoded._id,
                role: decoded.role || decoded.accountType || 'student',
                accountType: decoded.accountType || decoded.role || 'student'
              };
              storedUser = JSON.stringify(restoredUser);
            }
          } catch (err) {
            console.error("Invalid token on restoration", err);
            logout();
            return;
          }
        }

        let resolvedRole = null;
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          resolvedRole = (parsedUser.role || parsedUser.accountType || "student").toLowerCase();
          const normalizedUser = {
            ...parsedUser,
            role: resolvedRole,
            accountType: resolvedRole
          };
          setToken(storedToken);
          setUser(normalizedUser);
          persistAuth(storedToken, normalizedUser);
        }

        if (resolvedRole && ['student', 'tutor', 'teacher', 'alumni', 'verifier', 'admin'].includes(resolvedRole)) {
          await fetchUser();
        }
      } catch (err) {
        console.error("Failed to parse user data", err);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (initializedRef.current) return;
    initializedRef.current = true;
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
    persistAuth(newToken, normalizedUser);
  };

  const logout = useCallback(async () => {
    try { await tutorsApiClient.post("/logout"); } catch (_) {}
    setToken(null);
    setUser(null);
    [
      "token",
      "auth_token",
      "user",
      "User",
      "auth_user",
      "auth_data"
    ].forEach((key) => localStorage.removeItem(key));
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
        const normalizedUser = {
          ...data.user,
          role: String(
            data.user.role ||
            data.user.accountType ||
            ""
          ).toLowerCase(),
          accountType: String(
            data.user.accountType ||
            data.user.role ||
            ""
          ).toLowerCase(),
        };
        setUser(normalizedUser);
        
        let storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (!storedToken) {
          const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
          const payload = btoa(JSON.stringify({ id: normalizedUser._id || normalizedUser.id, role: normalizedUser.role }));
          storedToken = `${header}.${payload}.dummy_signature`;
        }
        setToken(storedToken);
        persistAuth(storedToken, normalizedUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearError = () => setError(null);

  const userRole = (user?.role || user?.accountType || "").toLowerCase();

  const value = {
    user,
    token,
    loading,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    isInitialized,
    isTeacher: userRole === 'teacher' || userRole === 'tutor',
    isStudent: userRole === 'student',
    isTutor: userRole === 'tutor',
    isAlumni: userRole === 'alumni',
    isVerifier: userRole === 'verifier',
    
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
        }
        persistAuth(currentToken, normalized);
      } else {
        setUser(null);
        setToken(null);
        [
          "token",
          "auth_token",
          "user",
          "User",
          "auth_user",
          "auth_data"
        ].forEach((key) => localStorage.removeItem(key));
      }
    }
  };

  return (
    <GlobalAuthContext.Provider value={value}>
      {children}
    </GlobalAuthContext.Provider>
  );
};
