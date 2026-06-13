import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";
import { NotificationCenter } from "../ui/NotificationCenter.jsx";
import { ThemeToggle } from "@/components/ThemeToggle.jsx";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useSidebar } from "@/contexts/SidebarContext";

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
  "/referrals",
];

const Navbar = ({ pageTitle = "Dashboard", showBackToDashboard }) => {
  const { user, isStudent } = useAuth();
  const { toggleSidebar, toggleMobileMenu } = useSidebar();
  const location = useLocation();

  const role = (user?.role || user?.accountType || "").toLowerCase();
  const isStudentUser = isStudent || role === "student";

  const shouldShowBack =
    showBackToDashboard ??
    (isStudentUser &&
      location.pathname !== "/student/dashboard" &&
      STUDENT_MODULE_PATHS.some((p) => location.pathname.startsWith(p)));

  const handleHamburgerClick = () => {
    if (window.innerWidth < 768) {
      toggleMobileMenu();
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="h-16 border-b border-border/40 bg-background/70 backdrop-blur-[20px] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 transition-all duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleHamburgerClick}
          className="p-2 -ml-2 rounded-[var(--radius-sm)] text-muted-foreground hover:bg-secondary shrink-0 cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        {shouldShowBack && (
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-[var(--primary)] transition-colors shrink-0"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}
        <h1 className="text-lg font-serif font-semibold text-foreground tracking-tight truncate">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64 md:w-[420px] transition-all duration-300">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-[var(--bg-secondary)] border border-border pl-10 h-10 rounded-full text-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/10 transition-all text-[var(--text-primary)]"
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
