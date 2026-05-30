import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { NotificationCenter } from "../ui/NotificationCenter.jsx";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

const STUDENT_MODULE_PATHS = [
  "/student/attendance",
  "/expenses-tracker",
  "/tutorials/home",
  "/student/tutorials",
  "/tutorials/book",
  "/tutorials/profile",
  "/student/referrals",
  "/student/jobs",
  "/student/profile",
  "/student/qrcode",
  "/student/applied",
  "/student/interview",
  "/student/chat",
];

const Navbar = ({ onMenuClick, pageTitle = "Dashboard", showBackToDashboard }) => {
  const { user, isStudent } = useAuth();
  const location = useLocation();

  const role = (user?.role || user?.accountType || "").toLowerCase();
  const isStudentUser = isStudent || role === "student";

  const shouldShowBack =
    showBackToDashboard ??
    (isStudentUser &&
      location.pathname !== "/student/dashboard" &&
      STUDENT_MODULE_PATHS.some((p) => location.pathname.startsWith(p)));

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:bg-secondary shrink-0"
        >
          <Menu className="w-5 h-5" />
        </button>
        {shouldShowBack && (
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors shrink-0"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}
        <h1 className="text-lg font-semibold text-foreground tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-secondary/50 border-none pl-9 h-9 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <ThemeToggle />

        <NotificationCenter />

        <div className="w-8 h-8 rounded-full bg-secondary border border-border overflow-hidden flex items-center justify-center font-bold text-primary">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs uppercase">{(user?.name || user?.username || user?.fullName || "U")[0].toUpperCase()}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
