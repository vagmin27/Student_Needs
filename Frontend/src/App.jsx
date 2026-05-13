import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/Referrals/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/Referrals/ui/sonner.jsx";
import { TooltipProvider } from "@/components/Referrals/ui/tooltip.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/Referrals/ThemeContext.jsx";
import { AuthProvider as ReferralAuthProvider } from "@/services/Referrals/Auth/AuthContext.jsx";

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ================= ATTENDANCE =================
import { useAuth } from "./contexts/Attendance/AuthContext";
import ProtectedRoute from "./components/Attendance/ProtectedRoute";

import DashboardLayout from "./layouts/Attendance/DashboardLayout";

import Login from "./auth/Attendance/Login";
import Register from "./auth/Attendance/Register";

import Dashboard from "./pages/Attendance/Dashboard";
import Attendance from "./pages/Attendance/Attendance";
import AddStudent from "./pages/Attendance/AddStudent";
import Reports from "./pages/Attendance/Reports";
import RemoveStudent from "./pages/Attendance/RemoveStudent";
import AddSubject from "./pages/Attendance/AddSubject";
import StudentDashboard from "./pages/Attendance/StudentDashboard";

// ================= REFERRALS =================
import Index from "@/pages/Referrals/Index.jsx";

// ================= QUERY CLIENT =================
const queryClient = new QueryClient();

// ================= LAYOUT WRAPPER =================
const WithLayout = ({ title, children }) => (
  <DashboardLayout pageTitle={title}>
    {children}
  </DashboardLayout>
);

// ================= ATTENDANCE ROUTES =================
const AttendanceRoutes = () => {
  const { isAuthenticated, isTeacher, loading } = useAuth();

  if (loading) {
    return (
      <div className="spinner-page">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={isTeacher ? "/dashboard" : "/student-dashboard"}
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={isTeacher ? "/dashboard" : "/student-dashboard"}
            />
          ) : (
            <Register />
          )
        }
      />

      {/* ================= ROOT REDIRECT ================= */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate
              to={isTeacher ? "/dashboard" : "/student-dashboard"}
            />
          </ProtectedRoute>
        }
      />

      {/* ================= TEACHER ROUTES ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Dashboard">
              <Dashboard />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Attendance">
              <Attendance />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-student"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Add Student">
              <AddStudent />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/remove-student"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Remove Student">
              <RemoveStudent />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-subject"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Add Subject">
              <AddSubject />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Reports">
              <Reports />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= STUDENT ROUTES ================= */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <WithLayout title="My Dashboard">
              <StudentDashboard />
            </WithLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= REFERRALS ROUTE ================= */}
      <Route path="/referrals/*" element={<Index />} />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// ================= MAIN APP =================
function App() {
  // ================= LENIS SMOOTH SCROLL =================
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ReferralAuthProvider>
          <TooltipProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              {/* ================= TOASTERS ================= */}
              <HotToaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: "#1e293b",
                    color: "#f1f5f9",
                    border: "1px solid #334155",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#22c55e",
                      secondary: "#1e293b",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#1e293b",
                    },
                  },
                }}
              />

              <Toaster />
              <Sonner />

              {/* ================= ALL ROUTES ================= */}
              <AttendanceRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </ReferralAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;