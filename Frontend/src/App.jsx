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

// ThemeProvider is imported in main.jsx

// import { AuthProvider } from "./utils/Tutorials/auth";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import ErrorBoundary from "@/components/ErrorBoundary.jsx";
import NetworkFallback from "@/components/ui/NetworkFallback.jsx";

// ======================================================
//                    LENIS
// ======================================================

import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ======================================================
//                    ATTENDANCE
// ======================================================

import GlobalProtectedRoute from "@/components/GlobalProtectedRoute.jsx";

import DashboardLayout from "./components/layouts/DashboardLayout";

import Login from "./auth/Attendance/Login";
import Register from "./auth/Attendance/Register";

const Dashboard = React.lazy(() => import("./pages/Attendance/Dashboard"));
const Attendance = React.lazy(() => import("./pages/Attendance/Attendance"));
const AddStudent = React.lazy(() => import("./pages/Attendance/AddStudent"));
const Reports = React.lazy(() => import("./pages/Attendance/Reports"));
const RemoveStudent = React.lazy(
  () => import("./pages/Attendance/RemoveStudent"),
);
const AddSubject = React.lazy(() => import("./pages/Attendance/AddSubject"));
const StudentDashboard = React.lazy(
  () => import("./pages/Attendance/StudentDashboard"),
);
const UnifiedDashboard = React.lazy(
  () => import("./pages/UnifiedDashboard"),
);

const AttendanceManagementHub = React.lazy(() => import("./pages/Tutorials/AttendanceManagementHub"));
const AttendanceDashboard = React.lazy(() => import("./pages/Attendance/Dashboard"));
const AttendanceMark = React.lazy(() => import("./pages/Attendance/Attendance"));
const AttendanceAddStudent = React.lazy(() => import("./pages/Attendance/AddStudent"));
const AttendanceRemoveStudent = React.lazy(() => import("./pages/Attendance/RemoveStudent"));
const AttendanceAddSubject = React.lazy(() => import("./pages/Attendance/AddSubject"));
const AttendanceReports = React.lazy(() => import("./pages/Attendance/Reports"));

// ======================================================
//                    REFERRALS
// ======================================================

const Index = React.lazy(() => import("@/pages/Referrals/Index.jsx"));
const AlumniDashboard = React.lazy(() =>
  import("@/pages/Referrals/AlumniDashboard.jsx").then((m) => ({
    default: m.AlumniDashboard,
  })),
);
const VerifierDashboard = React.lazy(() =>
  import("@/pages/Referrals/VerifierDashboard.jsx").then((m) => ({
    default: m.VerifierDashboard,
  })),
);
const ReferralsStudentDashboard = React.lazy(() =>
  import("@/pages/Referrals/StudentDashboard.jsx").then((m) => ({
    default: m.StudentDashboard,
  })),
);
const ReferralsInterviewPage = React.lazy(
  () => import("@/pages/Referrals/InterviewPage.jsx"),
);
const ChatPage = React.lazy(() => import("@/pages/Referrals/ChatPage.jsx"));
import {
  RoleAuthPage,
  RoleSelectionPage,
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
const TutorialsHome = React.lazy(() => import("./pages/Tutorials/TutorialsHome"));
import ManageBookingPage from "./pages/Tutorials/ManageBookingPage";
import ClassHistoryPage from "./pages/Tutorials/ClassHistoryPage";
// Replaced by GlobalProtectedRoute
import TutorLoginPage from "./pages/Tutorials/TutorLoginPage";
import SelectRole from "./pages/Tutorials/SelectRole";
import TutorRegisterPage from "./pages/Tutorials/TutorRegisterPage";
// import TutorAvailability from "./pages/Tutorials/TutorAvailability";
import TutorAvailability from "./pages/Tutorials/TutorAvailabilty";
const TutorDashboard = React.lazy(
  () => import("./pages/Tutorials/TutorDashboard"),
);
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
const RecurringTransactions = React.lazy(
  () => import("./pages/Expenses/RecurringTransactions"),
);
const Analytics = React.lazy(() => import("./pages/Expenses/Analytics"));
const Settings = React.lazy(() => import("./pages/Expenses/Settings"));
import AppLayout from "./components/Expenses/layout/AppLayout";

// ======================================================
//                    LAZY LOAD
// ======================================================

const LazySearch = React.lazy(
  () => import("./components/Tutorials/SearchTutor"),
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
  <DashboardLayout pageTitle={title}>{children}</DashboardLayout>
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
      <Route
        path="/role-selector"
        element={<Navigate to="/role-selection" replace />}
      />
      <Route path="/login" element={<Navigate to="/login/student" replace />} />
      <Route path="/login/:role" element={<RoleAuthPage mode="login" />} />
      <Route
        path="/signup"
        element={<Navigate to="/signup/student" replace />}
      />
      <Route path="/signup/:role" element={<RoleAuthPage mode="signup" />} />
      <Route path="/register/:role" element={<RoleAuthPage mode="signup" />} />
      <Route
        path="/auth/student/login"
        element={<Navigate to="/login/student" replace />}
      />
      <Route
        path="/auth/student/signup"
        element={<Navigate to="/signup/student" replace />}
      />
      <Route
        path="/auth/alumni/login"
        element={<Navigate to="/login/alumni" replace />}
      />
      <Route
        path="/auth/alumni/signup"
        element={<Navigate to="/signup/alumni" replace />}
      />
      <Route
        path="/auth/verifier/login"
        element={<Navigate to="/login/verifier" replace />}
      />
      <Route
        path="/auth/verifier/signup"
        element={<Navigate to="/signup/verifier" replace />}
      />
     

      <Route
        path="/student/expenses"
        element={<Navigate to="/expenses-tracker" replace />}
      />
      {/* <Route path="/modules" element={<ModuleOverviewPage />} /> */}
      <Route path="/teacher/dashboard" element={<TutorDashboard />} />
      {/* ======================================================
                      UNIFIED STUDENT FLOW (SINGLE PERSISTENT LAYOUT)
      ====================================================== */}
      {/* Personal attendance — students and legacy teacher accounts */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["student", "teacher"]}>
            <DashboardLayout role="student" />
          </GlobalProtectedRoute>
        }
      >
        <Route
          path="/student/attendance"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <StudentDashboard />
            </Suspense>
          }
        />
      </Route>

      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["student", "teacher", "tutor"]}>
            <DashboardLayout role="student" />
          </GlobalProtectedRoute>
        }
      >
        {/* Unified student dashboard — single route */}
        <Route
          path="/student/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <UnifiedDashboard />
            </Suspense>
          }
        />


        {/* Attendance Management Hub */}
        <Route
          path="/tutorials/attendance"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceManagementHub />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceDashboard />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/mark"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceMark />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/add-student"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceAddStudent />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/remove-student"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceRemoveStudent />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/add-subject"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceAddSubject />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/attendance/reports"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AttendanceReports />
            </Suspense>
          }
        />

        {/* Referrals Routes */}
        <Route path="/student/referrals" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsStudentDashboard /></Suspense>} />
        <Route path="/student/jobs" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsStudentDashboard /></Suspense>} />
        <Route path="/student/profile" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsStudentDashboard /></Suspense>} />
        <Route path="/student/qrcode" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsStudentDashboard /></Suspense>} />
        <Route path="/student/applied" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsStudentDashboard /></Suspense>} />
        <Route path="/student/interview" element={<Suspense fallback={<DashboardSkeleton />}><ReferralsInterviewPage /></Suspense>} />
        <Route path="/student/chat" element={<Suspense fallback={<DashboardSkeleton />}><ChatPage /></Suspense>} />
        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route
          path="/referrals/*"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Index />
            </Suspense>
          }
        />


        {/* Referrals */}
        <Route
          path="/student/referrals"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsStudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/student/jobs"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsStudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/student/profile"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsStudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/student/qrcode"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsStudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/student/applied"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsStudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="/student/interview"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ReferralsInterviewPage />
            </Suspense>
          }
        />
        <Route
          path="/student/chat"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ChatPage />
            </Suspense>
          }
        />
        <Route
          path="/student"
          element={<Navigate to="/student/dashboard" replace />}
        />

        {/* Tutorials module home (entry hub — not search/book) */}
        <Route
          path="/tutorials/home"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorialsHome />
            </Suspense>
          }
        />
        <Route path="/student/tutorials" element={<Navigate to="/tutorials/home" />} />

        {/* Tutorials feature routes */}
        <Route
          path="/tutorials/searchTutor"
          element={<Navigate to="/tutorials/home" replace />}
        />
        <Route
          path="/tutorials/book"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <BookClass />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/profile"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Profile />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/profile/editProfile"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <EditProfilePage />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/profile/manageBooking"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ManageBookingPage />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/profile/classHistory"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <ClassHistoryPage />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/profile/accountSettings"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <AccountSettingPage />
            </Suspense>
          }
        />
        <Route
          path="/student/settings"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Settings />
            </Suspense>
          }
        />

      </Route>

      {/* Expense Tracker Routes */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["student"]}>
            <AppLayout />
          </GlobalProtectedRoute>
        }
      >
        <Route
          path="/expenses-tracker"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/expenses-tracker/recurring"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <RecurringTransactions />
            </Suspense>
          }
        />
        <Route
          path="/expenses-tracker/analytics"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Analytics />
            </Suspense>
          }
        />
        <Route
          path="/expenses-tracker/settings"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <Settings />
            </Suspense>
          }
        />
      </Route>

      {/* ======================================================
                        NON-STUDENT SECURE DASHBOARDS
      ====================================================== */}
      {/* Alumni Protected Group */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["alumni"]}>
            <Outlet />
          </GlobalProtectedRoute>
        }
      >
        <Route
          path="/alumni/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardLayout role="alumni" pageTitle="Alumni Dashboard">
                <AlumniDashboard />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/alumni/chat"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardLayout role="alumni" pageTitle="Referrals Chat">
                <ChatPage />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route
          path="/alumni/settings"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardLayout role="alumni" pageTitle="Alumni Settings">
                <Settings />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route path="/alumni/*" element={<Navigate to="/alumni/dashboard" replace />} />
      </Route>

      {/* Verifier Protected Group */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["verifier"]}>
            <Outlet />
          </GlobalProtectedRoute>
        }
      >
        <Route
          path="/verifier/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardLayout role="verifier" pageTitle="Verifier Dashboard">
                <VerifierDashboard />
              </DashboardLayout>
            </Suspense>
          }
        />
        <Route path="/verifier/*" element={<Navigate to="/verifier/dashboard" replace />} />
      </Route>
      <Route
        path="/auth/*"
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Index />
          </Suspense>
        }
      />
      <Route
        path="/landing"
        element={
          <Suspense fallback={<DashboardSkeleton />}>
            <Index />
          </Suspense>
        }
      />

      {/* ======================================================
                        ATTENDANCE AUTH
      ====================================================== */}

      <Route
        path="/attendance/login"
        element={
          isAuthenticated ? (
            <Navigate to="/student/dashboard" />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/attendance/register"
        element={
          isAuthenticated ? (
            <Navigate to="/student/dashboard" />
          ) : (
            <Register />
          )
        }
      />

      {/* Legacy teacher attendance routes → personal tracker */}
      <Route path="/attendance/dashboard" element={<Navigate to="/student/attendance" replace />} />
      <Route path="/attendance/attendance" element={<Navigate to="/student/attendance" replace />} />
      <Route path="/attendance/add-student" element={<Navigate to="/student/attendance" replace />} />
      <Route path="/attendance/remove-student" element={<Navigate to="/student/attendance" replace />} />
      <Route path="/attendance/add-subject" element={<Navigate to="/student/attendance" replace />} />
      <Route path="/attendance/reports" element={<Navigate to="/student/attendance" replace />} />

      {/* ======================================================
                        TUTORIAL AUTH
      ====================================================== */}

      <Route path="/tutorials/login" element={<SelectRole />} />

      <Route path="/tutorials/login/student" element={<LoginPage />} />

      <Route path="/tutorials/login/tutor" element={<TutorLoginPage />} />

      <Route path="/tutorials/register" element={<RegisterPage />} />

      <Route path="/tutorials/register/tutor" element={<TutorRegisterPage />} />

      {/* ======================================================
                        TUTOR ROUTES
      ====================================================== */}

      {/* ======================================================
                        TUTOR SECURE ROUTES (SINGLE PERSISTENT LAYOUT)
      ====================================================== */}
      <Route
        element={
          <GlobalProtectedRoute allowedRoles={["tutor"]}>
            <DashboardLayout role="tutor" />
          </GlobalProtectedRoute>
        }
      >
        <Route
          path="/tutorials/tutor/dashboard"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorDashboard />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/tutor/availability"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorAvailability />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/tutor/schedule"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorSchedulePage />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/tutor/accept"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorAcceptPage />
            </Suspense>
          }
        />
        <Route
          path="/tutorials/tutor/editProfile"
          element={
            <Suspense fallback={<DashboardSkeleton />}>
              <TutorEditProfilePage />
            </Suspense>
          }
        />
      </Route>

      {/* ======================================================
                        TUTORIAL LANDING
      ====================================================== */}

      <Route path="/tutorials" element={<Landing />} />

      {/* ======================================================
                        EXPENSE AUTH
      ====================================================== */}

      <Route path="/expenses-tracker/login" element={<ExpenseLogin />} />

      <Route path="/expenses-tracker/signup" element={<Signup />} />

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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* Unified AuthProvider is now in main.jsx */}
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
          <NetworkFallback />
          <Toaster />
          <Sonner />

          {/* ======================================================
                                ROUTES
                ====================================================== */}

          <AttendanceRoutes />
          {/* </BrowserRouter> */}
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
