import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Referrals/Home.jsx';
import About from '@/pages/Referrals/About.jsx';
import { StudentDashboard } from '@/pages/Referrals/StudentDashboard.jsx';
import { AlumniDashboard } from '@/pages/Referrals/AlumniDashboard.jsx';
import { VerifierDashboard } from '@/pages/Referrals/VerifierDashboard.jsx';
import InterviewPage from '@/pages/Referrals/InterviewPage.jsx';
import NotFound from '@/pages/Referrals/NotFound.jsx';
import { RoleSelector } from '@/pages/Referrals/RoleSelector.jsx';
import Navbar from '@/components/Referrals/Navbar.jsx';
import { useAuth } from '@/services/Referrals/Auth/AuthContext.jsx';
import { StudentLoginPage } from '@/components/Referrals/Student/Auth/StudentLogin.jsx';
import { StudentSignupPage } from '@/components/Referrals/Student/Auth/StudentSignup.jsx';
import { AlumniLoginPage } from '@/components/Referrals/Alumni/Auth/AlumniLogin.jsx';
import { AlumniSignupPage } from '@/components/Referrals/Alumni/Auth/AlumniSignup.jsx';
import { VerifierLoginPage } from '@/components/Referrals/Verifier/Auth/VerifierLogin.jsx';
import { VerifierSignupPage } from '@/components/Referrals/Verifier/Auth/VerifierSignup.jsx';
import LandingPage from "@/pages/Referrals/LandingPage";

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
 
  const { isAuthenticated, user, isLoading, isInitialized } = useAuth();

  // Wait for auth to load
  if (!isInitialized || isLoading) {
    return null;
  }
  console.log("REFERRAL AUTH STATE", {
  isAuthenticated,
  user,
  isLoading,
  isInitialized
});
console.log("AUTH USER:", user);
  // Check backend auth
  const hasBackendAuth =
    isAuthenticated &&
    user &&
    (
      (requiredRole === "student" && user.accountType === "Student") ||
      (requiredRole === "alumni" && user.accountType === "Alumni") ||
      (requiredRole === "verifier" && user.accountType === "Verifier")
    );

  // Allow access if auth is valid
  if (hasBackendAuth) {
    return <>{children}</>;
  }

  // Redirect authenticated users to correct dashboards
  if (isAuthenticated && user) {
    const userRole = user.accountType?.toLowerCase();

    if (userRole === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }

    if (userRole === "alumni") {
      return <Navigate to="/alumni" replace />;
    }

    if (userRole === "verifier") {
      return <Navigate to="/verifier" replace />;
    }
  }

  // No auth
  return (
  <div style={{ color: "white", padding: "40px" }}>
    Redirect blocked for debugging
  </div>
);
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
      <Route path="/landing" element={<LandingPage />} />

      {/* Student Dashboard */}
      <Route
        index
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="referrals"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="jobs"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="qrcode"
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout>
              <StudentDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="applied"
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
        path="interview"
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
