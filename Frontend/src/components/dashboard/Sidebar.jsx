import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
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

  // We can dynamically render links based on role later.
  // For now, these are standard module links.
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
          onClick={async () => {
            try {
              const { tutorsApiClient } = await import("@/services/apiClient.js");
              await tutorsApiClient.post("/logout");
            } catch (_) {}
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/role-selection';
          }}
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
