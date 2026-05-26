import React from "react";
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
        <Link className="uc-primary-button" to="/role-selection">
          Get Started
        </Link>
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

      {/* Floating Theme Selector Card */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900/85 dark:bg-slate-950/85 backdrop-blur-xl border border-white/10 dark:border-cyan-500/20 shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02] transition-all duration-300">
          <button
            onClick={() => setTheme("light")}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              theme === "light"
                ? "bg-white text-slate-900 shadow-md scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Light Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light Mode ☀️</span>
          </button>
          
          <button
            onClick={() => setTheme("dark")}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              theme === "dark"
                ? "bg-indigo-600 text-white shadow-md scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark Mode 🌙</span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`p-2 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
              theme === "system"
                ? "bg-slate-700 text-white shadow-md scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
            title="System Default"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>System 💻</span>
          </button>
        </div>
      </div>
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
                  <input
                    type={field.type}
                    value={form.data[field.name] || ""}
                    placeholder={field.placeholder}
                    disabled={form.isSubmitting}
                    onChange={(event) => form.setField(field.name, event.target.value)}
                  />
                  {form.errors[field.name] && (
                    <small>{form.errors[field.name]}</small>
                  )}
                </label>
              ))}
            </div>

            <button type="submit" className="uc-login-submit" disabled={form.isSubmitting}>
              {form.isSubmitting && <Loader2 className="uc-spin" />}
              {form.isSubmitting ? submittingText : submitText}
            </button>
          </form>

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

