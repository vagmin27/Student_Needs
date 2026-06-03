import React, { useState } from "react";
import { Link, NavLink, Navigate, useParams } from "react-router-dom";
import {
  BarChart3,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  CheckSquare,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
  Loader2,
  ArrowRight,
  Clock,
  TrendingUp,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme.js";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TutorLoginPage from "./Tutorials/TutorLoginPage";
import TutorRegisterPage from "./Tutorials/TutorRegisterPage";
import { VerifierLoginPage } from "@/components/Referrals/Verifier/Auth/VerifierLogin.jsx";
import { VerifierSignupPage } from "@/components/Referrals/Verifier/Auth/VerifierSignup.jsx";
import {
  useAlumniLogin,
  useAlumniSignup,
  useStudentLogin,
  useStudentSignup,
} from "@/services/Referrals/Auth/hooks.js";

// const roles = [
//   {
//     id: "student",
//     title: "Student",
//     description: "Access all student features and tools",
//     icon: GraduationCap,
//     loginTo: "/login/student",
//   },
//   {
//     id: "teacher",
//     title: "Teacher / Tutor",
//     description: "Teach, manage students and track performance",
//     icon: BookOpen,
//     loginTo: "/login/teacher",
//   },
//   {
//     id: "alumni",
//     title: "Alumni / Verifier",
//     description: "Provide referrals, verify students and opportunities",
//     icon: ShieldCheck,
//     loginTo: "/login/alumni",
//   },
// ];

const roles = [
  {
    id: "student",
    title: "Student",
    description: "Access all student features and tools",
    icon: GraduationCap,
    loginTo: "/login/student",
  },
  {
    id: "tutor",
    title: "Tutor",
    description: "Teach, manage students and track performance",
    icon: BookOpen,
    loginTo: "/login/tutor",
  },
  {
    id: "alumni",
    title: "Alumni",
    description: "Provide referrals and opportunities",
    icon: Briefcase,
    loginTo: "/login/alumni",
  },
  {
    id: "verifier",
    title: "Verifier",
    description: "Verify students and opportunities",
    icon: ShieldCheck,
    loginTo: "/login/verifier",
  },
];

const studentModules = [
  { title: "Find Tutor", text: "Search tutors, view profiles and book classes.", icon: UserRound, to: "/tutorials/home" },
  { title: "Attendance", text: "View attendance status and class records.", icon: CheckSquare, to: "/student/attendance" },
  { title: "Expense Tracker", text: "Add, categorize and track monthly spending.", icon: ReceiptText, to: "/student/expenses" },
  { title: "Internships & Referrals", text: "Apply to alumni-posted opportunities.", icon: UsersRound, to: "/student/referrals" },
  { title: "Grade Management", text: "Review academic progress and reports.", icon: ClipboardList, to: "/attendance/reports" },
];

const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/student/dashboard" },
  { label: "Find Tutor", icon: Search, to: "/tutorials/home" },
  { label: "Attendance", icon: CheckSquare, to: "/student/attendance" },
  { label: "Expenses", icon: ReceiptText, to: "/student/expenses" },
  { label: "Internships & Referrals", icon: Briefcase, to: "/student/referrals" },
  { label: "Grades", icon: ClipboardList, to: "/attendance/reports" },
  { label: "Calendar", icon: CalendarDays, to: "/tutorials/profile/classHistory" },
  { label: "Messages", icon: MessageSquare, to: "/referrals" },
  { label: "Settings", icon: Settings, to: "/tutorials/profile/accountSettings" },
];

function Brand() {
  return (
    <Link to="/" className="uc-brand" aria-label="UniConnect home">
      <span className="uc-brand-mark">U</span>
      <span>UniConnect</span>
    </Link>
  );
}

export function UnifiedLanding() {
  const { theme, setTheme } = useTheme();

  return (
    <main className="uc-page">
      <nav className="uc-topbar">
        <Brand />
        <div className="uc-navlinks">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#about">About Us</a>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link className="uc-primary-button" to="/role-selection">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="uc-hero">
        <div className="uc-hero-copy">
          <h1>
            All-in-One <span>Student</span> Platform
          </h1>
          <p>Everything you need as a student, in one place.</p>
          <ul className="uc-check-list">
            <li>Find Tutors</li>
            <li>Manage Attendance</li>
            <li>Track Expenses</li>
            <li>Discover Internships & Referrals</li>
            <li>Manage Grades</li>
          </ul>
          <div className="uc-actions">
            <Link className="uc-primary-button" to="/role-selection">
              Get Started
            </Link>
            <a className="uc-secondary-button" href="#features">
              Learn More
            </a>
          </div>
        </div>

        <div className="uc-hero-visual" aria-hidden="true">
          <div className="uc-student-group">
            <div className="uc-student-card tall" />
            <div className="uc-student-card" />
            <div className="uc-student-card tall" />
            <div className="uc-student-card" />
          </div>
          <div className="uc-floating-icon top"><CheckSquare /></div>
          <div className="uc-floating-icon left"><GraduationCap /></div>
          <div className="uc-floating-icon right"><Briefcase /></div>
          <div className="uc-floating-icon lower"><ReceiptText /></div>
        </div>
      </section>

      <section id="features" className="uc-logo-strip">
        <p>Trusted by students & institutions</p>
        <div>
          <span /><span /><span /><span /><span /><span />
        </div>
      </section>


    </main>
  );
}

export function RoleSelectionPage() {
  return (
    <main className="uc-auth-shell">
      <Brand />
      <section className="uc-role-panel">
        <h1>Choose how you want to continue</h1>
        <div className="uc-role-list">
          {roles?.map((role) => {
            const Icon = role.icon;
            return (
              <Link className="uc-role-card" to={role.loginTo} key={role.id}>
                <span className="uc-role-avatar"><Icon /></span>
                <span>
                  <strong>{role.title}</strong>
                  <small>{role.description}</small>
                </span>
                <span className="uc-arrow">{"->"}</span>
              </Link>
            );
          })}
        </div>
        <p className="uc-auth-switch">
          Already have an account? <Link to="/login/student">Login</Link>
        </p>
      </section>
    </main>
  );
}

export function RoleAuthPage({ mode = "login" }) {
  const { role } = useParams();
  const normalizedRole = role;

  if (normalizedRole === "student") {
    return mode === "signup" ? <StudentSignupFlow /> : <StudentLoginFlow />;
  }

  if (normalizedRole === "teacher" || normalizedRole === "tutor") {
    return mode === "signup" ? <TutorRegisterPage /> : <TutorLoginPage />;
  }

  if (normalizedRole === "alumni") {
    return mode === "signup" ? <AlumniSignupFlow /> : <AlumniLoginFlow />;
  }

  if (normalizedRole === "verifier") {
    return mode === "signup" ? <VerifierSignupPage /> : <VerifierLoginPage />;
  }

  if (normalizedRole === "tutor") {
    return mode === "signup" ? <TutorRegisterPage /> : <TutorLoginPage />;
  }

  return <Navigate to="/role-selection" replace />;
}

function RoleAuthShell({
  role,
  mode,
  title,
  subtitle,
  icon: Icon,
  form,
  fields,
  submitText,
  submittingText,
  switchText,
  switchTo,
  switchLabel,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    await form.handleSubmit();
  };

  return (
    <main className="uc-login-page">
      <div className="uc-login-card">
        <Link to="/role-selection" className="uc-back-link">
          <span>{"<-"}</span>
          Back to role selection
        </Link>

        <section className="uc-login-panel" aria-labelledby={`${role}-${mode}-title`}>
          <div className="uc-login-icon">
            <Icon />
          </div>
          <h1 id={`${role}-${mode}-title`}>{title}</h1>
          <p>{subtitle}</p>

          {form.submitError && (
            <div className="uc-form-error" role="alert">
              {form.submitError}
            </div>
          )}

          <form onSubmit={onSubmit} className="uc-login-form">
            <div className={fields.length > 4 ? "uc-field-grid" : ""}>
              {fields?.map((field) => (
                <label key={field.name} className="uc-field">
                  <span>{field.label}</span>
                  <div className="relative w-full">
                    <input
                      type={field.type === "password" ? (showPassword ? "text" : "password") : field.type}
                      value={form.data[field.name] || ""}
                      placeholder={field.placeholder}
                      disabled={form.isSubmitting}
                      onChange={(event) => form.setField(field.name, event.target.value)}
                      className={field.type === "password" ? "pr-12 w-full" : "w-full"}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none text-xs font-semibold select-none cursor-pointer"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    )}
                  </div>
                  {field.name === "password" && mode === "login" && (
                    <div className="flex justify-end mt-1">
                      <Link
                        to={`/forgot-password?role=${role}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                  {form.errors[field.name] && (
                    <small>{form.errors[field.name]}</small>
                  )}
                </label>
              ))}
            </div>

            {mode === "login" && (
              <label className="flex items-center gap-2 mt-2 mb-4 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-indigo-950/60 bg-indigo-950/20 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            )}

            <button type="submit" className="uc-login-submit" disabled={form.isSubmitting}>
              {form.isSubmitting && <Loader2 className="uc-spin" />}
              {form.isSubmitting ? submittingText : submitText}
            </button>
          </form>

          {(role === "student" || role === "alumni") && (
            <>
              <div className="uc-social-separator my-5 flex items-center justify-center gap-3 w-full">
                <span className="h-[1px] bg-slate-800 flex-grow"></span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or continue with</span>
                <span className="h-[1px] bg-slate-800 flex-grow"></span>
              </div>
              <div className="uc-social-buttons flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => window.location.href = `http://localhost:8000/api/v1/student/auth/google`}
                  className="uc-social-btn flex-grow py-2.5 px-4 rounded-xl border border-indigo-950/60 bg-indigo-950/20 text-sm font-semibold text-slate-300 hover:bg-indigo-950/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = `http://localhost:8000/api/v1/student/auth/github`}
                  className="uc-social-btn flex-grow py-2.5 px-4 rounded-xl border border-indigo-950/60 bg-indigo-950/20 text-sm font-semibold text-slate-300 hover:bg-indigo-950/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </>
          )}

          <p className="uc-login-switch">
            {switchText} <Link to={switchTo}>{switchLabel}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

function StudentLoginFlow() {
  const form = useStudentLogin();
  return (
    <RoleAuthShell
      role="student"
      mode="login"
      title="Welcome Back, Student"
      subtitle="Login to continue to your dashboard."
      icon={GraduationCap}
      form={form}
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "name@email.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
      ]}
      submitText="Login"
      submittingText="Logging in..."
      switchText="New here?"
      switchTo="/signup/student"
      switchLabel="Sign up as Student"
    />
  );
}

function StudentSignupFlow() {
  const form = useStudentSignup();
  return (
    <RoleAuthShell
      role="student"
      mode="signup"
      title="Create Student Account"
      subtitle="Sign up to access tutors, attendance, expenses and referrals."
      icon={GraduationCap}
      form={form}
      fields={[
        { name: "firstName", label: "First Name", type: "text", placeholder: "Anaya" },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "Sharma" },
        { name: "email", label: "Email", type: "email", placeholder: "name@email.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
        { name: "collegeName", label: "College Name", type: "text", placeholder: "e.g. Stanford University" },
      ]}
      submitText="Sign up"
      submittingText="Creating account..."
      switchText="Already have an account?"
      switchTo="/login/student"
      switchLabel="Login"
    />
  );
}

function AlumniLoginFlow() {
  const form = useAlumniLogin();
  return (
    <RoleAuthShell
      role="alumni"
      mode="login"
      title="Welcome Back, Alumni"
      subtitle="Login to post opportunities and manage referrals."
      icon={Briefcase}
      form={form}
      fields={[
        { name: "email", label: "Email", type: "email", placeholder: "name@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
      ]}
      submitText="Login"
      submittingText="Logging in..."
      switchText="New here?"
      switchTo="/signup/alumni"
      switchLabel="Sign up as Alumni"
    />
  );
}

function AlumniSignupFlow() {
  const form = useAlumniSignup();
  return (
    <RoleAuthShell
      role="alumni"
      mode="signup"
      title="Create Alumni Account"
      subtitle="Sign up to create referrals and verify student opportunities."
      icon={Briefcase}
      form={form}
      fields={[
        { name: "firstName", label: "First Name", type: "text", placeholder: "Rohan" },
        { name: "lastName", label: "Last Name", type: "text", placeholder: "Mehta" },
        { name: "email", label: "Email", type: "email", placeholder: "name@company.com" },
        { name: "password", label: "Password", type: "password", placeholder: "Password" },
        { name: "collegeName", label: "College Name", type: "text", placeholder: "e.g. Stanford University" },
        { name: "company", label: "Company", type: "text", placeholder: "Company" },
        { name: "jobTitle", label: "Job Title", type: "text", placeholder: "Job title" },
      ]}
      submitText="Sign up"
      submittingText="Creating account..."
      switchText="Already have an account?"
      switchTo="/login/alumni"
      switchLabel="Login"
    />
  );
}

// StudentOverviewDashboard has been permanently removed and replaced by StudentDashboard.jsx

