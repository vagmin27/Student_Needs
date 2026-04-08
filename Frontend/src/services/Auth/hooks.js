// Custom Authentication Hooks
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

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
  collegeName: '',
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
      const response = await studentSignup(form.data);
      if (response.success) {
        form.resetForm();
        navigate('/student/referrals');
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
  const { studentLogin } = useAuth();
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
      const response = await studentLogin(form.data);
      if (response.success) {
        form.resetForm();
        navigate('/student/referrals');
      } else {
        form.setSubmitError(response.message);
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, studentLogin, navigate, validate]);

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
        navigate('/alumni');
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
  const { alumniLogin } = useAuth();
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
        form.resetForm();
        navigate('/alumni');
      } else {
        form.setSubmitError(response.message);
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, alumniLogin, navigate, validate]);

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
  collegeName: '',
};

export function useVerifierSignup() {
  const { studentSignup, setUser } = useAuth();
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
      const response = await studentSignup(form.data);
      if (response.success && response.user) {
        // Override accountType to Verifier for verifier signup
        const verifierUser = { ...response.user, accountType: 'Verifier' };
        // Update context with verifier user
        setUser(verifierUser);
        form.resetForm();
        navigate('/verifier');
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
  }, [form, studentSignup, setUser, navigate, validate]);

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
      const response = await studentLogin(form.data);
      if (response.success && response.user) {
        // Override accountType to Verifier for verifier login
        const verifierUser = { ...response.user, accountType: 'Verifier' };
        // Update context with verifier user
        setUser(verifierUser);
        form.resetForm();
        navigate('/verifier');
      } else {
        form.setSubmitError(response.message);
      }
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      form.setSubmitError(message);
      return { success: false, message };
    } finally {
      form.setSubmitting(false);
    }
  }, [form, studentLogin, setUser, navigate, validate]);

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