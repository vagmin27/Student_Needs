// Custom Authentication Hooks
import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/GlobalAuthContext.jsx';
import { referralsApiClient } from '@/services/apiClient.js';
import { AUTH_ENDPOINTS } from './config.js';
import { showToast } from '@/components/Referrals/TransactionToast.jsx';

// ============================================
// Form State Hook
// ============================================

export function useAuthForm(initialData) {
  const [formState, setFormState] = useState({
    data: initialData,
    errors: {},
    isSubmitting: false,
    submitError: null,
  });

  const setField = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined },
      submitError: null,
    }));
  }, []);

  const setError = useCallback((field, error) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }));
  }, []);

  const setSubmitError = useCallback((error) => {
    setFormState((prev) => ({
      ...prev,
      submitError: error,
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting) => {
    setFormState((prev) => ({
      ...prev,
      isSubmitting,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      errors: {},
      isSubmitting: false,
      submitError: null,
    });
  }, [initialData]);

  return {
    ...formState,
    setField,
    setError,
    setSubmitError,
    setSubmitting,
    resetForm,
  };
}

// ============================================
// Student Signup Hook
// ============================================

const initialStudentSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export function useStudentSignup() {
  const { studentSignup } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialStudentSignup);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.firstName.trim()) {
      form.setError('firstName', 'First name is required');
      isValid = false;
    }

    if (!form.data.lastName.trim()) {
      form.setError('lastName', 'Last name is required');
      isValid = false;
    }

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    } else if (form.data.password.length < 6) {
      form.setError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }, [form]);

  // const handleSubmit = useCallback(async () => {
  //   if (!validate()) {
  //     return { success: false, message: 'Please fix form errors' };
  //   }

  //   form.setSubmitting(true);
  //   try {
  //     const response = await studentSignup(form.data);
  //     if (response.success) {
  //       form.resetForm();
  //       navigate('/student/dashboard');
  //     } else {
  //       form.setSubmitError(response.message);
  //     }
  //     return response;
  //   } catch (error) {
  //     const message = error instanceof Error ? error.message : 'Signup failed';
  //     form.setSubmitError(message);
  //     return { success: false, message };
  //   } finally {
  //     form.setSubmitting(false);
  //   }
  // }, [form, studentSignup, navigate, validate]);

  const handleSubmit = useCallback(async () => {

    if (!validate()) {
      return {
        success: false,
        message: 'Please fix form errors'
      };
    }

    form.setSubmitting(true);

    try {

      console.log("SIGNUP FORM DATA:", form.data);

      const response = await studentSignup(form.data);

      console.log("SIGNUP RESPONSE:", response);

      if (response.success) {

        form.resetForm();

        // Delay avoids auth timing issues
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 100);

      } else {

        form.setSubmitError(
          response.message || 'Signup failed'
        );
      }

      return response;

    } catch (error) {

      console.log("SIGNUP HOOK ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Signup failed';

      form.setSubmitError(message);

      return {
        success: false,
        message
      };

    } finally {
      form.setSubmitting(false);
    }

  }, [form, studentSignup, navigate, validate]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Student Login Hook
// ============================================

const initialLogin = {
  email: '',
  password: '',
};

export function useStudentLogin() {
  const { studentLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialLogin);
  const submitLockRef = useRef(false);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    }

    return isValid;
  }, [form.data.email, form.data.password, form.setError]);

  // const handleSubmit = useCallback(async () => {
  //   if (!validate()) {
  //     return { success: false, message: 'Please fix form errors' };
  //   }

  //   form.setSubmitting(true);

  //   try {
  //     const response = await studentLogin(form.data);


  //     if (response.success) {

  //       // ✅ Persist auth
  //       const token =
  //         response.token ||
  //         response.data?.token;

  //       const user =
  //         response.user ||
  //         response.data?.user;

  //       if (token) {
  //         localStorage.setItem("auth_token", token);
  //         localStorage.setItem("token", token);
  //       }

  //       if (user) {
  //         localStorage.setItem("auth_user", JSON.stringify(user));
  //         localStorage.setItem("user", JSON.stringify(user));
  //       }

  //       form.resetForm();

  //       navigate('/student/dashboard');

  //     } else {
  //       form.setSubmitError(response.message);
  //     }

  //     return response;

  //   } catch (error) {
  //     const message =
  //       error instanceof Error ? error.message : 'Login failed';

  //     form.setSubmitError(message);

  //     return { success: false, message };

  //   } finally {
  //     form.setSubmitting(false);
  //   }

  // }, [form, studentLogin, navigate, validate]);

  const handleSubmit = useCallback(async () => {
    if (submitLockRef.current) {
      return { success: false, message: 'Login already in progress' };
    }

    if (!validate()) {
      return {
        success: false,
        message: 'Please fix form errors'
      };
    }

    submitLockRef.current = true;
    form.setSubmitting(true);

    try {
      const response = await studentLogin(form.data);

      if (response.success) {

        const token =
          response.token ||
          response.data?.token;

        const user =
          response.user ||
          response.data?.user;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("auth_token", token);
        }

        if (user) {
          const normalizedUser = {
            ...user,
            role: "student",
            accountType: "student",
          };

          localStorage.setItem("user", JSON.stringify(normalizedUser));
          localStorage.setItem("User", JSON.stringify(normalizedUser));
          localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
          localStorage.setItem("auth_data", JSON.stringify({ token, user: normalizedUser }));

          setUser(normalizedUser);
        }

        form.resetForm();

        // Delay avoids protected route timing issue
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 100);

      } else {

        form.setSubmitError(
          response.message || 'Login failed'
        );
      }

      return response;

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed';

      form.setSubmitError(message);

      return {
        success: false,
        message
      };

    } finally {
      submitLockRef.current = false;
      form.setSubmitting(false);
    }

  }, [form.data, form.setSubmitting, form.setSubmitError, form.resetForm, studentLogin, navigate, validate, setUser]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Alumni Signup Hook
// ============================================

const initialAlumniSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  collegeName: '',
  company: '',
  jobTitle: '',
};

export function useAlumniSignup() {
  const { alumniSignup } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialAlumniSignup);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.firstName.trim()) {
      form.setError('firstName', 'First name is required');
      isValid = false;
    }

    if (!form.data.lastName.trim()) {
      form.setError('lastName', 'Last name is required');
      isValid = false;
    }

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    } else if (form.data.password.length < 6) {
      form.setError('password', 'Password must be at least 6 characters');
      isValid = false;
    }

    if (!form.data.collegeName.trim()) {
      form.setError('collegeName', 'College name is required');
      isValid = false;
    }

    return isValid;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return { success: false, message: 'Please fix form errors' };
    }

    form.setSubmitting(true);
    try {
      const response = await alumniSignup(form.data);
      if (response.success) {
        form.resetForm();
        navigate('/login/alumni');
      } else {
        form.setSubmitError(response.message);
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, alumniSignup, navigate, validate]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Alumni Login Hook
// ============================================

export function useAlumniLogin() {
  const { alumniLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialLogin);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    }

    return isValid;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return { success: false, message: 'Please fix form errors' };
    }

    form.setSubmitting(true);
    try {
      const response = await alumniLogin(form.data);
      if (response.success) {
        const token = response.token || response.data?.token || localStorage.getItem('token') || localStorage.getItem('auth_token');
        const user = response.user || response.data?.user;
        
        if (user) {
          const normalizedUser = {
            ...user,
            role: "alumni",
            accountType: "alumni",
          };

          if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("auth_token", token);
          }
          localStorage.setItem("user", JSON.stringify(normalizedUser));
          localStorage.setItem("User", JSON.stringify(normalizedUser));
          localStorage.setItem("auth_user", JSON.stringify(normalizedUser));
          localStorage.setItem("auth_data", JSON.stringify({ token, user: normalizedUser }));

          setUser(normalizedUser);
        }

        form.resetForm();
        setTimeout(() => {
          navigate('/alumni/dashboard');
        }, 100);
      } else {
        form.setSubmitError(response.message || 'Login failed');
      }
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, alumniLogin, setUser, navigate, validate]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Verifier Signup Hook
// ============================================

const initialVerifierSignup = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

export function useVerifierSignup() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialVerifierSignup);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.firstName.trim()) {
      form.setError('firstName', 'First name is required');
      isValid = false;
    }

    if (!form.data.lastName.trim()) {
      form.setError('lastName', 'Last name is required');
      isValid = false;
    }

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    } else if (form.data.password.length < 6) {
      form.setError('password', 'Password must be at least 6 characters');
      isValid = false;
    }


    return isValid;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) {
      return { success: false, message: 'Please fix form errors' };
    }

    form.setSubmitting(true);
    try {
      const { data } = await referralsApiClient.post(AUTH_ENDPOINTS.student.signup, {
        ...form.data,
        accountType: 'verifier',
      });

      if (data.success) {
        form.resetForm();
        showToast({
          type: 'success',
          message: 'Verifier signup successful!',
          description: 'Please log in with your verifier account.'
        });

        // Clear stale auth localStorage keys
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        localStorage.removeItem('User');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_data');

        setUser(null);

        setTimeout(() => {
          navigate('/login/verifier', { replace: true });
        }, 100);
      } else {
        form.setSubmitError(data.message || 'Signup failed');
      }
      return data;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Signup failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, setUser, navigate, validate]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Verifier Login Hook
// ============================================

export function useVerifierLogin() {
  const { studentLogin, setUser } = useAuth();
  const navigate = useNavigate();
  const form = useAuthForm(initialLogin);
  const submitLockRef = useRef(false);

  const validate = useCallback(() => {
    let isValid = true;

    if (!form.data.email.trim()) {
      form.setError('email', 'Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.data.email)) {
      form.setError('email', 'Invalid email format');
      isValid = false;
    }

    if (!form.data.password) {
      form.setError('password', 'Password is required');
      isValid = false;
    }

    return isValid;
  }, [form]);

  const handleSubmit = useCallback(async () => {
    if (submitLockRef.current) {
      return { success: false, message: 'Login already in progress' };
    }

    if (!validate()) {
      return { success: false, message: 'Please fix form errors' };
    }

    submitLockRef.current = true;
    form.setSubmitting(true);
    try {
      const response = await studentLogin(form.data);
      if (response.success && response.user) {
        const userRole = (response.user.role || response.user.accountType || "").toLowerCase();
        if (userRole !== 'verifier') {
          // Revert the global login state since this is not a verifier
          localStorage.removeItem('token');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('User');
          localStorage.removeItem('auth_user');
          localStorage.removeItem('auth_data');
          setUser(null);
          form.setSubmitError('Unauthorized. Only verifier accounts can access this portal.');
          return { success: false, message: 'Unauthorized access' };
        }

        // 1. Normalize verifier user
        const normalizedUser = {
          ...response.user,
          role: "verifier",
          accountType: "verifier",
        };

        const token = response.token || response.data?.token || localStorage.getItem('token') || localStorage.getItem('auth_token');

        // 2. Persist ALL auth keys
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('auth_token', token);
        }
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        localStorage.setItem('User', JSON.stringify(normalizedUser));
        localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
        localStorage.setItem('auth_data', JSON.stringify({ token, user: normalizedUser }));

        // 3. Update auth context with normalized verifier user
        setUser(normalizedUser);

        // 4. Show success toast
        showToast({
          type: 'success',
          message: 'Login successful!',
          description: 'Welcome to your verifier dashboard.'
        });

        form.resetForm();

        // 5. Use delayed navigation
        setTimeout(() => {
          navigate('/verifier/dashboard', { replace: true });
        }, 100);
      } else {
        form.setSubmitError(response.message || 'Login failed');
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      submitLockRef.current = false;
      form.setSubmitting(false);
    }
  }, [form.data, form.setSubmitting, form.setSubmitError, form.resetForm, studentLogin, setUser, navigate, validate]);

  return {
    ...form,
    handleSubmit,
    validate,
  };
}

// ============================================
// Role-Based Auth Hook
// ============================================

export function useRoleBasedAuth(role) {
  const studentSignup = useStudentSignup();
  const studentLogin = useStudentLogin();
  const alumniSignup = useAlumniSignup();
  const alumniLogin = useAlumniLogin();

  if (role === 'student') {
    return {
      signup: studentSignup,
      login: studentLogin,
    };
  }

  return {
    signup: alumniSignup,
    login: alumniLogin,
  };
}

