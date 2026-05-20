import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
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
<<<<<<< HEAD
=======
<<<<<<< HEAD:src/components/dashboard/Sidebar.jsx
>>>>>>> c76ab2ceee41537cccbf90f6b2bf341c324d893d
  const { logout, user } = useAuth();

  const currentRole = (user?.role || user?.accountType || role || "student").toLowerCase();

  let links = [];
  if (currentRole === "tutor") {
    links = [
      { name: "Dashboard", href: "/tutorials/tutor/dashboard", icon: LayoutDashboard },
      { name: "Schedule",  href: "/tutorials/tutor/schedule",  icon: CalendarDays },
      { name: "Requests",  href: "/tutorials/tutor/accept",    icon: BookOpen },
      { name: "Profile",   href: "/tutorials/tutor/editProfile", icon: Users },
    ];
  } else if (currentRole === "teacher") {
    links = [
      { name: "Dashboard",      href: "/attendance/dashboard",      icon: LayoutDashboard },
      { name: "Attendance",     href: "/attendance/attendance",     icon: CalendarDays },
      { name: "Add Student",    href: "/attendance/add-student",    icon: Users },
      { name: "Remove Student", href: "/attendance/remove-student", icon: Users },
      { name: "Add Subject",    href: "/attendance/add-subject",    icon: BookOpen },
      { name: "Reports",        href: "/attendance/reports",        icon: CreditCard },
    ];
  } else if (currentRole === "alumni") {
    links = [
      { name: "Dashboard", href: "/alumni/dashboard", icon: LayoutDashboard },
    ];
  } else if (currentRole === "verifier") {
    links = [
      { name: "Dashboard", href: "/verifier/dashboard", icon: LayoutDashboard },
    ];
  } else {
    // Default student links
    links = [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Expenses", href: "/expenses-tracker", icon: CreditCard },
      { name: "Tutorials", href: "/tutorials/searchTutor", icon: BookOpen },
      { name: "Referrals", href: "/student/referrals", icon: Briefcase },
    ];
  }
<<<<<<< HEAD
=======
=======
  const { logout } = useAuth();

  const links = role === "tutor"
    ? [
        { name: "Dashboard", href: "/tutorials/tutor/dashboard", icon: LayoutDashboard },
        { name: "Schedule",  href: "/tutorials/tutor/schedule",  icon: CalendarDays },
        { name: "Requests",  href: "/tutorials/tutor/accept",    icon: BookOpen },
        { name: "Profile",   href: "/tutorials/tutor/editProfile", icon: Users },
      ]
    : [
        { name: "Dashboard", href: `/${role}/dashboard`, icon: LayoutDashboard },
        { name: "Attendance", href: `/${role}/dashboard`, icon: CalendarDays }, // Merged into Dashboard
        { name: "Expenses", href: `/expenses-tracker`, icon: CreditCard },
        { name: "Tutorials", href: `/tutorials/searchTutor`, icon: BookOpen },
        { name: "Referrals", href: `/student/referrals`, icon: Briefcase }, // Referrals specific route
      ];
>>>>>>> 94d51442ed970eef37ac0ae78cd897ae8839d68c:Frontend/src/components/dashboard/Sidebar.jsx
>>>>>>> c76ab2ceee41537cccbf90f6b2bf341c324d893d

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 h-screen border-r border-border bg-card sticky top-0 px-4 py-6",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg leading-none">U</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          UniConnect
        </span>
      </div>

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
                  : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 pt-4 border-t border-border">
        <Link
          to={`/tutorials/profile/accountSettings`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <button
<<<<<<< HEAD
          onClick={logout}
=======
<<<<<<< HEAD:src/components/dashboard/Sidebar.jsx
          onClick={logout}
=======
          onClick={async () => {
            try {
              const { tutorsApiClient } = await import("@/services/apiClient.js");
              await tutorsApiClient.post("/logout");
            } catch (_) {}
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/role-selection';
          }}
>>>>>>> 94d51442ed970eef37ac0ae78cd897ae8839d68c:Frontend/src/components/dashboard/Sidebar.jsx
>>>>>>> c76ab2ceee41537cccbf90f6b2bf341c324d893d
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
