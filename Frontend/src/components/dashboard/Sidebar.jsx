import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Briefcase,
  Settings,
  LogOut,
  CalendarDays,
} from "lucide-react";

const Sidebar = ({ className, role = "student" }) => {
  const location = useLocation();

  const { logout, user } = useAuth();

  if (!user) return null;

  const currentRole = (
    user?.role ||
    user?.accountType ||
    role ||
    "student"
  ).toLowerCase();

  let links = [];

  if (currentRole === "tutor") {
    links = [
      {
        name: "Dashboard",
        href: "/tutorials/tutor/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Schedule",
        href: "/tutorials/tutor/schedule",
        icon: CalendarDays,
      },
      { name: "Requests", href: "/tutorials/tutor/accept", icon: BookOpen },
      { name: "Profile", href: "/tutorials/tutor/editProfile", icon: Users },
      { name: "Attendance", href: "/tutorials/attendance", icon: BookOpen },
    ];
  } else if (currentRole === "teacher") {
    links = [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Attendance", href: "/student/attendance", icon: CalendarDays },
      { name: "Tutorials", href: "/tutorials/home", icon: BookOpen },
    ];
  } else if (currentRole === "alumni") {
    links = [
      {
        name: "Dashboard",
        href: "/alumni/dashboard",
        icon: LayoutDashboard,
      },
    ];
  } else if (currentRole === "verifier") {
    links = [
      {
        name: "Dashboard",
        href: "/verifier/dashboard",
        icon: LayoutDashboard,
      },
    ];
  } else {
    // Default Student Links
    links = [
      {
        name: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Attendance",
        href: "/student/attendance",
        icon: CalendarDays,
      },
      {
        name: "Expenses",
        href: "/expenses-tracker",
        icon: CreditCard,
      },
      {
        name: "Tutorials",
        href: TUTORIAL_PATHS.unifiedEntry,
        icon: BookOpen,
      },
      {
        name: "Referrals",
        href: "/student/referrals",
        icon: Briefcase,
      },
    ];
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 h-screen border-r border-border bg-card sticky top-0 px-4 py-6",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg leading-none">
            U
          </span>
        </div>

        <span className="text-xl font-bold tracking-tight text-foreground">
          UniConnect
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links?.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground",
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto space-y-1 pt-4 border-t border-border">
        <Link
          to="/tutorials/profile/accountSettings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
