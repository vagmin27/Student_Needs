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
import { useAuth } from '@/contexts/GlobalAuthContext.jsx';
import { StudentLoginPage } from '@/components/Referrals/Student/Auth/StudentLogin.jsx';
import { StudentSignupPage } from '@/components/Referrals/Student/Auth/StudentSignup.jsx';
import { AlumniLoginPage } from '@/components/Referrals/Alumni/Auth/AlumniLogin.jsx';
import { AlumniSignupPage } from '@/components/Referrals/Alumni/Auth/AlumniSignup.jsx';
import { VerifierLoginPage } from '@/components/Referrals/Verifier/Auth/VerifierLogin.jsx';
import { VerifierSignupPage } from '@/components/Referrals/Verifier/Auth/VerifierSignup.jsx';
import LandingPage from "@/pages/Referrals/LandingPage";
import DashboardLayout from '@/components/layouts/DashboardLayout.jsx';
import GlobalProtectedRoute from "@/components/GlobalProtectedRoute.jsx";

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

      {/* Explicit Student Referral Routes */}
      <Route
        path="/student/referrals"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="Student Referrals">
              <StudentDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="Student Jobs">
              <StudentDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="Student Profile">
              <StudentDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />
      <Route
        path="/student/qrcode"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="QR Code">
              <StudentDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />
      <Route
        path="/student/applied"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="Applied Jobs">
              <StudentDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />
      <Route
        path="/student/interview"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <DashboardLayout role="student" pageTitle="Interviews">
              <InterviewPage />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />

      {/* Alumni Dashboard */}
      <Route
        path="/alumni/dashboard"
        element={
          <GlobalProtectedRoute allowedRoles={["alumni"]}>
            <DashboardLayout role="alumni" pageTitle="Alumni Dashboard">
              <AlumniDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
        }
      />

      {/* Verifier Dashboard */}
      <Route
        path="/verifier/dashboard"
        element={
          <GlobalProtectedRoute allowedRoles={["verifier"]}>
            <DashboardLayout role="verifier" pageTitle="Verifier Dashboard">
              <VerifierDashboard />
            </DashboardLayout>
          </GlobalProtectedRoute>
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
