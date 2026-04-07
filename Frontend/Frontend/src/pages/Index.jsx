import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
import { StudentDashboard } from '@/pages/StudentDashboard';
import { AlumniDashboard } from '@/pages/AlumniDashboard';
import { VerifierDashboard } from '@/pages/VerifierDashboard';
import InterviewPage from '@/pages/InterviewPage';
import NotFound from '@/pages/NotFound';
import { RoleSelector } from '@/pages/RoleSelector';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/services/Auth/AuthContext';
import { StudentLoginPage } from '@/components/Student/Auth/StudentLogin';
import { StudentSignupPage } from '@/components/Student/Auth/StudentSignup';
import { AlumniLoginPage } from '@/components/Alumni/Auth/AlumniLogin';
import { AlumniSignupPage } from '@/components/Alumni/Auth/AlumniSignup';
import { VerifierLoginPage } from '@/components/Verifier/Auth/VerifierLogin';
import { VerifierSignupPage } from '@/components/Verifier/Auth/VerifierSignup';

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

// Backend auth protected route
function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Wait for auth to load
  if (isLoading) {
    return null;
  }

  // Check backend auth
  const hasBackendAuth = isAuthenticated && user && 
    ((requiredRole === 'student' && user.accountType === 'Student') ||
     (requiredRole === 'alumni' && user.accountType === 'Alumni') ||
     (requiredRole === 'verifier' && user.accountType === 'Verifier'));

  // Allow access if auth is valid
  if (hasBackendAuth) {
    return <>{children}</>;
  }

  if (isAuthenticated && user) {
    const userRole = user.accountType.toLowerCase();
    return <Navigate to={`/${userRole}`} replace />;
  }

  // No auth - redirect to home
  return <Navigate to="/" replace />;
}

function AppContent() {
  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={<Home />} />

      {/* About Page */}
      <Route path="/about" element={<About />} />

      {/* Role Selection */}
      <Route path="/role-selector" element={<RoleSelector />} />

      {/* Authentication Routes */}
      <Route path="/auth/student/login" element={<StudentLoginPage />} />
      <Route path="/auth/student/signup" element={<StudentSignupPage />} />
      <Route path="/auth/alumni/login" element={<AlumniLoginPage />} />
      <Route path="/auth/alumni/signup" element={<AlumniSignupPage />} />
      <Route path="/auth/verifier/login" element={<VerifierLoginPage />} />
      <Route path="/auth/verifier/signup" element={<VerifierSignupPage />} />

      {/* Student Dashboard */}
      <Route
        path="/student"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/referrals"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/qrcode"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applied"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Interview Page */}
      <Route
        path="/student/interview"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <InterviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Alumni Dashboard */}
      <Route
        path="/alumni"
        element={
          <ProtectedRoute requiredRole="alumni">
            <DashboardLayout>
              <AlumniDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Verifier Dashboard */}
      <Route
        path="/verifier"
        element={
          <ProtectedRoute requiredRole="verifier">
            <DashboardLayout>
              <VerifierDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const Index = () => {
  return <AppContent />;
};

export default Index;