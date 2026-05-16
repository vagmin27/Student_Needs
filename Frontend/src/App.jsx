import React, { useEffect, Suspense } from "react";
import "./App.css";
import {
  // BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// ======================================================
//                    QUERY + UI
// ======================================================

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster as HotToaster } from "react-hot-toast";
import { Toaster } from "@/components/Referrals/ui/toaster.jsx";
import { Toaster as Sonner } from "@/components/Referrals/ui/sonner.jsx";
import { TooltipProvider } from "@/components/Referrals/ui/tooltip.jsx";

// ======================================================
//                    CONTEXTS
// ======================================================

import { ThemeProvider } from "@/contexts/Referrals/ThemeContext.jsx";
import { AuthProvider as ReferralAuthProvider } from "@/services/Referrals/Auth/AuthContext.jsx";

import { AuthProvider } from "./utils/Tutorials/auth";
import { useAuth } from "./contexts/Attendance/AuthContext";

// ======================================================
//                    LENIS
// ======================================================

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ======================================================
//                    ATTENDANCE
// ======================================================

import ProtectedRoute from "./components/Attendance/ProtectedRoute";

import DashboardLayout from "./components/layouts/DashboardLayout";

import Login from "./auth/Attendance/Login";
import Register from "./auth/Attendance/Register";

const Dashboard = React.lazy(() => import("./pages/Attendance/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance/Attendance"));
const AddStudent = React.lazy(() => import("./pages/Attendance/AddStudent"));
const Reports = React.lazy(() => import("./pages/Attendance/Reports"));
const RemoveStudent = React.lazy(() => import("./pages/Attendance/RemoveStudent"));
const AddSubject = React.lazy(() => import("./pages/Attendance/AddSubject"));
const StudentDashboard = React.lazy(() => import("./pages/Attendance/StudentDashboard"));

// ======================================================
//                    REFERRALS
// ======================================================

const Index = React.lazy(() => import("@/pages/Referrals/Index.jsx"));
import {
  ModuleOverviewPage,
  RoleAuthPage,
  RoleSelectionPage,
  StudentOverviewDashboard,
  UnifiedLanding,
} from "@/pages/UnifiedFlow.jsx";

// ======================================================
//                    TUTORIALS
// ======================================================

import LoginPage from "./pages/Tutorials/LoginPage";
import RegisterPage from "./pages/Tutorials/RegisterPage";
import Landing from "./pages/Tutorials/Landing";
import Profile from "./pages/Tutorials/ProfilePage";
import EditProfilePage from "./pages/Tutorials/EditProfile";
import AccountSettingPage from "./pages/Tutorials/AccountSettingPage";
import NotFound from "./pages/Tutorials/NotFound";
import BookClass from "./pages/Tutorials/BookClass";
import ManageBookingPage from "./pages/Tutorials/ManageBookingPage";
import ClassHistoryPage from "./pages/Tutorials/ClassHistoryPage";
import RequireAuth from "./components/Tutorials/RequireAuth";
import TutorLoginPage from "./pages/Tutorials/TutorLoginPage";
import SelectRole from "./pages/Tutorials/SelectRole";
import TutorRegisterPage from "./pages/Tutorials/TutorRegisterPage";
// import TutorAvailability from "./pages/Tutorials/TutorAvailability";
import TutorAvailability from "./pages/Tutorials/TutorAvailabilty";
const TutorDashboard = React.lazy(() => import("./pages/Tutorials/TutorDashboard"));
// import TutorSchedulePage from "./pages/Tutorials/TutorsSchedulePage";
import TutorSchedulePage from "./pages/Tutorials/TutorSchedulePage";
import TutorAcceptPage from "./pages/Tutorials/TutorAcceptPage";
import TutorEditProfilePage from "./pages/Tutorials/TutorEditProfilePage";

// ======================================================
//                    EXPENSES
// ======================================================

const Home = React.lazy(() => import("./pages/Expenses/Home"));
import ExpenseLogin from "./pages/Expenses/Login";
import Signup from "./pages/Expenses/Signup";
const RecurringTransactions = React.lazy(() => import("./pages/Expenses/RecurringTransactions"));
const Analytics = React.lazy(() => import("./pages/Expenses/Analytics"));
const Settings = React.lazy(() => import("./pages/Expenses/Settings"));
import AppLayout from "./components/Expenses/layout/AppLayout";

// ======================================================
//                    LAZY LOAD
// ======================================================

const LazySearch = React.lazy(() =>
  import("./components/Tutorials/SearchTutor")
);

import DashboardSkeleton from "@/components/ui/DashboardSkeleton";

// ======================================================
//                    QUERY CLIENT
// ======================================================

const queryClient = new QueryClient();

// ======================================================
//                    LAYOUT WRAPPER
// ======================================================

const WithLayout = ({ title, children }) => (
  <DashboardLayout pageTitle={title}>
    {children}
  </DashboardLayout>
);

// ======================================================
//                    ATTENDANCE ROUTES
// ======================================================

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
      {/* ======================================================
                      UNIFIED OPENING FLOW
      ====================================================== */}

      <Route path="/" element={<UnifiedLanding />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/role-selector" element={<Navigate to="/role-selection" replace />} />
      <Route path="/login" element={<Navigate to="/login/student" replace />} />
      <Route path="/login/:role" element={<RoleAuthPage mode="login" />} />
      <Route path="/signup" element={<Navigate to="/signup/student" replace />} />
      <Route path="/signup/:role" element={<RoleAuthPage mode="signup" />} />
      <Route path="/register/:role" element={<RoleAuthPage mode="signup" />} />
      <Route path="/auth/student/login" element={<Navigate to="/login/student" replace />} />
      <Route path="/auth/student/signup" element={<Navigate to="/signup/student" replace />} />
      <Route path="/auth/alumni/login" element={<Navigate to="/login/alumni" replace />} />
      <Route path="/auth/alumni/signup" element={<Navigate to="/signup/alumni" replace />} />
      <Route path="/auth/verifier/login" element={<Navigate to="/login/verifier" replace />} />
      <Route path="/auth/verifier/signup" element={<Navigate to="/signup/verifier" replace />} />
      <Route path="/student/dashboard" element={<StudentOverviewDashboard />} />
      <Route path="/student/attendance" element={<Navigate to="/student-dashboard" replace />} />
      <Route path="/student/expenses" element={<Navigate to="/expenses-tracker" replace />} />
      <Route path="/modules" element={<ModuleOverviewPage />} />
      <Route path="/teacher/dashboard" element={<TutorDashboard />} />
      <Route path="/alumni/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />

      {/* ======================================================
                        REFERRALS ROUTES
      ====================================================== */}

      <Route path="/referrals/*" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />
      <Route path="/student/*" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />
      <Route path="/alumni/*" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />
      <Route path="/verifier/*" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />
      <Route path="/auth/*" element={<Suspense fallback={<DashboardSkeleton />}><Index /></Suspense>} />

      {/* ======================================================
                        ATTENDANCE AUTH
      ====================================================== */}

      <Route
        path="/attendance/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={isTeacher ? "/attendance/dashboard" : "/student-dashboard"}
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/attendance/register"
        element={
          isAuthenticated ? (
            <Navigate
              to={isTeacher ? "/attendance/dashboard" : "/student-dashboard"}
            />
          ) : (
            <Register />
          )
        }
      />

      {/* ======================================================
                        ATTENDANCE ROUTES
      ====================================================== */}

      <Route
        path="/attendance/dashboard"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Dashboard">
              <Suspense fallback={<DashboardSkeleton />}>
                <Dashboard />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/attendance"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Attendance">
              <Suspense fallback={<DashboardSkeleton />}>
                <Attendance />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/add-student"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Add Student">
              <Suspense fallback={<DashboardSkeleton />}>
                <AddStudent />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/remove-student"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Remove Student">
              <Suspense fallback={<DashboardSkeleton />}>
                <RemoveStudent />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/add-subject"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Add Subject">
              <Suspense fallback={<DashboardSkeleton />}>
                <AddSubject />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance/reports"
        element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <WithLayout title="Reports">
              <Suspense fallback={<DashboardSkeleton />}>
                <Reports />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <WithLayout title="My Dashboard">
              <Suspense fallback={<DashboardSkeleton />}>
                <StudentDashboard />
              </Suspense>
            </WithLayout>
          </ProtectedRoute>
        }
      />

      {/* ======================================================
                        TUTORIAL AUTH
      ====================================================== */}

      <Route path="/tutorials/login" element={<SelectRole />} />

      <Route
        path="/tutorials/login/student"
        element={<LoginPage />}
      />

      <Route
        path="/tutorials/login/tutor"
        element={<TutorLoginPage />}
      />

      <Route
        path="/tutorials/register"
        element={<RegisterPage />}
      />

      <Route
        path="/tutorials/register/tutor"
        element={<TutorRegisterPage />}
      />

      {/* ======================================================
                        TUTOR ROUTES
      ====================================================== */}

      <Route
        path="/tutorials/tutor/dashboard"
        element={<Suspense fallback={<DashboardSkeleton />}><TutorDashboard /></Suspense>}
      />

      <Route
        path="/tutorials/tutor/availability"
        element={<TutorAvailability />}
      />

      <Route
        path="/tutorials/tutor/schedule"
        element={<TutorSchedulePage />}
      />

      <Route
        path="/tutorials/tutor/accept"
        element={<TutorAcceptPage />}
      />

      <Route
        path="/tutorials/tutor/editProfile"
        element={<TutorEditProfilePage />}
      />

      {/* ======================================================
                        BOOKING
      ====================================================== */}

      <Route
        path="/tutorials/book"
        element={<BookClass />}
      />

      {/* ======================================================
                        STUDENT PROFILE
      ====================================================== */}

      <Route
        path="/tutorials/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      <Route
        path="/tutorials/profile/editProfile"
        element={
          <RequireAuth>
            <EditProfilePage />
          </RequireAuth>
        }
      />

      <Route
        path="/tutorials/profile/manageBooking"
        element={
          <RequireAuth>
            <ManageBookingPage />
          </RequireAuth>
        }
      />

      <Route
        path="/tutorials/profile/classHistory"
        element={
          <RequireAuth>
            <ClassHistoryPage />
          </RequireAuth>
        }
      />

      <Route
        path="/tutorials/profile/accountSettings"
        element={
          <RequireAuth>
            <AccountSettingPage />
          </RequireAuth>
        }
      />

      {/* ======================================================
                        SEARCH
      ====================================================== */}

      <Route
        path="/tutorials/searchTutor"
        element={
          <Suspense fallback="Searching...">
            <LazySearch />
          </Suspense>
        }
      />

      {/* ======================================================
                        TUTORIAL LANDING
      ====================================================== */}

      <Route
        path="/tutorials"
        element={<Landing />}
      />

      {/* ======================================================
                        FALLBACK
      ====================================================== */}

            {/* ======================================================
                        EXPENSE TRACKER
      ====================================================== */}

      <Route element={<DashboardLayout pageTitle="Expenses" role="student"><Outlet /></DashboardLayout>}>
        <Route path="/expenses-tracker" element={<Suspense fallback={<DashboardSkeleton />}><Home /></Suspense>} />

        <Route
          path="/expenses-tracker/recurring"
          element={<Suspense fallback={<DashboardSkeleton />}><RecurringTransactions /></Suspense>}
        />

        <Route
          path="/expenses-tracker/analytics"
          element={<Suspense fallback={<DashboardSkeleton />}><Analytics /></Suspense>}
        />

        <Route
          path="/expenses-tracker/settings"
          element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>}
        />
      </Route>

      <Route
        path="/expenses-tracker/login"
        element={<ExpenseLogin />}
      />

      <Route
        path="/expenses-tracker/signup"
        element={<Signup />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// ======================================================
//                    MAIN APP
// ======================================================

function App() {
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
          <AuthProvider>
            <TooltipProvider>
              {/* <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              > */}
                {/* ======================================================
                                TOASTERS
                ====================================================== */}

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
                  }}
                />

                <Toaster />
                <Sonner />

                {/* ======================================================
                                ROUTES
                ====================================================== */}

                <AttendanceRoutes />
              {/* </BrowserRouter> */}
            </TooltipProvider>
          </AuthProvider>
        </ReferralAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
