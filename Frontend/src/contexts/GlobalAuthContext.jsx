import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { attendanceApiClient, referralsApiClient, tutorsApiClient } from '@/services/apiClient.js';
import { AUTH_ENDPOINTS } from '@/services/Referrals/Auth/config.js';

const GlobalAuthContext = createContext();

const TUTORIALS_SESSION_ROLES = new Set(['tutor', 'teacher']);

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

const isUnsignedDummyToken = (token) =>
  typeof token === "string" && token.endsWith(".dummy_signature");

let authInitPromise = null;

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

  const handleAuthSuccess = useCallback((newToken, newUser) => {
    const resolvedRole = (newUser.role || newUser.accountType || "student").toLowerCase();
    const normalizedUser = {
      ...newUser,
      role: resolvedRole,
      accountType: resolvedRole
    };
    setToken(newToken);
    setUser(normalizedUser);
    persistAuth(newToken, normalizedUser);
  }, []);

  const logout = useCallback(async () => {
    try { await tutorsApiClient.post("/logout"); } catch (_) {}
    setToken(null);
    setUser(null);
    
    // Save theme preference before clearing storage
    const savedTheme = localStorage.getItem("student-needs-theme");

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

    // Restore theme preference
    if (savedTheme) {
      localStorage.setItem("student-needs-theme", savedTheme);
    }

    authInitPromise = null;
    window.location.href = '/role-selection';
  }, []);

  const fetchUser = useCallback(async () => {
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

        let storedToken =
          data.token ||
          localStorage.getItem("token") ||
          localStorage.getItem("auth_token");

        if (storedToken) {
          setToken(storedToken);
          persistAuth(storedToken, normalizedUser);
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("fetchUser failed:", err?.message || err);
      }
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
        if (isUnsignedDummyToken(storedToken)) {
          localStorage.removeItem("token");
          localStorage.removeItem("auth_token");
          storedToken = null;
        }
        let storedUser = localStorage.getItem('user') || localStorage.getItem('User') || localStorage.getItem('auth_user');

        if (storedToken && !storedUser) {
          const referralAuth = localStorage.getItem('auth_data');
          if (referralAuth) {
            try {
              const parsed = JSON.parse(referralAuth);
              if (parsed.user) storedUser = JSON.stringify(parsed.user);
              else storedUser = JSON.stringify(parsed);
            } catch (_) {}
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
            if (import.meta.env.DEV) {
              console.error("Invalid token on restoration", err);
            }
            await logout();
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

        if (resolvedRole && TUTORIALS_SESSION_ROLES.has(resolvedRole)) {
          await fetchUser();
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error("Failed to parse user data", err);
        }
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!authInitPromise) {
      authInitPromise = initializeAuth();
    }

    authInitPromise.catch(() => {
      authInitPromise = null;
    });
  }, [fetchUser, logout]);

  const studentSignup = async (payload) => {
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.student.signup, payload);
      // Under the upgraded flow, signup does not immediately log in.
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const studentLogin = useCallback(async (payload) => {
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.student.login, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      const resData = err.response?.data;
      if (resData && resData.isVerified === false) {
        return { success: false, isVerified: false, message: resData.message };
      }
      return { success: false, message: resData?.message || 'Login failed' };
    }
  }, [handleAuthSuccess]);

  const alumniSignup = async (payload) => {
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.signup, payload);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const alumniLogin = async (payload) => {
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.alumni.login, payload);
      if (data.success) handleAuthSuccess(data.token, data.user);
      return data;
    } catch (err) {
      const resData = err.response?.data;
      if (resData && resData.isVerified === false) {
        return { success: false, isVerified: false, message: resData.message };
      }
      return { success: false, message: resData?.message || 'Login failed' };
    }
  };

  const verifyStudentOtp = async (email, otp) => {
    try {
      const { data } = await referralsApiClient.post("/student/verify-otp", { email, otp });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' };
    }
  };

  const resendStudentOtp = async (email) => {
    try {
      const { data } = await referralsApiClient.post("/student/resend-otp", { email });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Resend failed' };
    }
  };

  const verifyAlumniOtp = async (email, otp) => {
    try {
      const { data } = await referralsApiClient.post("/alumni/verify-otp", { email, otp });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' };
    }
  };

  const resendAlumniOtp = async (email) => {
    try {
      const { data } = await referralsApiClient.post("/alumni/resend-otp", { email });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Resend failed' };
    }
  };

  const studentForgotPassword = async (email) => {
    try {
      const { data } = await referralsApiClient.post("/student/forgot-password", { email });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Request failed' };
    }
  };

  const studentVerifyResetOtp = async (email, otp) => {
    try {
      const { data } = await referralsApiClient.post("/student/verify-reset-otp", { email, otp });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'OTP verification failed' };
    }
  };

  const studentResetPassword = async (payload) => {
    try {
      const { data } = await referralsApiClient.post("/student/reset-password", payload);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Reset password failed' };
    }
  };

  const alumniForgotPassword = async (email) => {
    try {
      const { data } = await referralsApiClient.post("/alumni/forgot-password", { email });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Request failed' };
    }
  };

  const alumniVerifyResetOtp = async (email, otp) => {
    try {
      const { data } = await referralsApiClient.post("/alumni/verify-reset-otp", { email, otp });
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'OTP verification failed' };
    }
  };

  const alumniResetPassword = async (payload) => {
    try {
      const { data } = await referralsApiClient.post("/alumni/reset-password", payload);
      return data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Reset password failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await attendanceApiClient.post('/auth/login', { email, password });
      if (data.token) {
        handleAuthSuccess(data.token, data.user);
        return { success: true };
      }
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const clearError = () => setError(null);

  const userRole = (user?.role || user?.accountType || "").toLowerCase();

  const stableSetUser = useCallback((u) => {
    if (u) {
      const resolvedRole = (u.role || u.accountType || "student").toLowerCase();
      const normalized = {
        ...u,
        role: resolvedRole,
        accountType: resolvedRole
      };
      setUser(normalized);
      const currentToken =
        u.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token");
      if (currentToken) {
        setToken(currentToken);
        persistAuth(currentToken, normalized);
      } else {
        persistAuth(null, normalized);
      }
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
  }, []);

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

    login,
    logout,
    studentSignup,
    studentLogin,
    alumniSignup,
    alumniLogin,
    verifyStudentOtp,
    resendStudentOtp,
    verifyAlumniOtp,
    resendAlumniOtp,
    studentForgotPassword,
    studentVerifyResetOtp,
    studentResetPassword,
    alumniForgotPassword,
    alumniVerifyResetOtp,
    alumniResetPassword,
    fetchUser,
    clearError,
    setUser: stableSetUser
  };

  return (
    <GlobalAuthContext.Provider value={value}>
      {children}
    </GlobalAuthContext.Provider>
  );
};
