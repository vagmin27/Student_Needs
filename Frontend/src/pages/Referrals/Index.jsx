import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Referrals/Home.jsx';
import About from '@/pages/Referrals/About.jsx';
import { StudentDashboard } from '@/pages/Referrals/StudentDashboard.jsx';

import InterviewPage from '@/pages/Referrals/InterviewPage.jsx';
import NotFound from '@/pages/Referrals/NotFound.jsx';
import { RoleSelector } from '@/pages/Referrals/RoleSelector.jsx';
import { StudentLoginPage } from '@/components/Referrals/Student/Auth/StudentLogin.jsx';
import { StudentSignupPage } from '@/components/Referrals/Student/Auth/StudentSignup.jsx';
import { AlumniLoginPage } from '@/components/Referrals/Alumni/Auth/AlumniLogin.jsx';
import { AlumniSignupPage } from '@/components/Referrals/Alumni/Auth/AlumniSignup.jsx';

import LandingPage from "@/pages/Referrals/LandingPage";
import GlobalProtectedRoute from "@/components/GlobalProtectedRoute.jsx";
import ReferralsLayout from '@/layouts/ReferralsLayout.jsx';
import ChatPage from '@/pages/Referrals/ChatPage.jsx';

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
      <Route path="/landing" element={<LandingPage />} />

      {/* Student Referral Module Layout */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <ReferralsLayout />
          </GlobalProtectedRoute>
        }
      >
        <Route index element={<Navigate to="browse-referrals" replace />} />
        <Route path="applied-jobs" element={<StudentDashboard />} />
        <Route path="browse-jobs" element={<StudentDashboard />} />
        <Route path="browse-referrals" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentDashboard />} />
        <Route path="qrcode" element={<StudentDashboard />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>

      {/* Standalone Interview Page (Full Screen Focused Flow) */}
      <Route
        path="interview"
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <InterviewPage />
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
