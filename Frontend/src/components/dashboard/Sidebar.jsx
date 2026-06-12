import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  Briefcase,
  Settings,
  LogOut,
  CalendarDays,
  MessageSquare,
  Inbox,
  CalendarCheck,
  ChevronRight,
  ChevronsLeft,
} from "lucide-react";

const Sidebar = ({ className, role = "student" }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

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
      { name: "Requests", href: "/tutorials/tutor/accept", icon: Inbox },
      { name: "Profile", href: "/tutorials/tutor/editProfile", icon: Users },
      { name: "Attendance", href: "/tutorials/attendance", icon: CalendarCheck },
      { name: "Chat", href: "/tutorials/chat", icon: MessageSquare },
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
      {
        name: "Chat",
        href: "/alumni/chat",
        icon: MessageSquare,
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
        href: "/referrals/browse-referrals",
        icon: Briefcase,
      },
    ];
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card overflow-y-auto overflow-x-hidden select-none sidebar-transition",
        isCollapsed ? "px-2 py-6" : "p-4",
        className
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 mb-8 px-2 shrink-0", isCollapsed ? "justify-center" : "")}>
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-lg leading-none">
            U
          </span>
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
            UniConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex flex-col flex-1",
        isCollapsed ? "items-center gap-3" : "space-y-1.5"
      )}>
        {links?.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "group relative flex items-center transition-all duration-200 sidebar-link-btn",
                isCollapsed 
                  ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                  : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
                isActive ? "active-link" : ""
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">{link.name}</span>}
              
              {/* Premium CSS Tooltip */}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}

        {/* Settings & Logout inside nav as part of middle navigation */}
        <div className={cn(
          "pt-4 border-t border-border/50 flex flex-col",
          isCollapsed ? "items-center gap-3" : "space-y-1.5"
        )}>
          <Link
            to={
              currentRole === "student"
                ? "/student/settings"
                : currentRole === "alumni"
                ? "/alumni/settings"
                : currentRole === "tutor"
                ? "/tutorials/tutor/settings"
                : "/tutorials/profile/accountSettings"
            }
            className={cn(
              "group relative flex items-center transition-colors sidebar-link-btn",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
            )}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Settings</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Settings
              </div>
            )}
          </Link>

          <button
            onClick={logout}
            className={cn(
              "group relative flex items-center transition-colors cursor-pointer text-destructive hover:bg-destructive/10",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "w-full gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 text-destructive" />
            {!isCollapsed && <span className="font-medium text-destructive">Log out</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Log out
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto border-t border-border shrink-0 flex flex-col",
        isCollapsed ? "items-center gap-3 pt-4" : "space-y-3 pt-4"
      )}>
        {/* User Card */}
        <div className={cn(
          "flex items-center rounded-[var(--radius-lg)] bg-secondary/35 border border-border/50 transition-all duration-200 overflow-hidden",
          isCollapsed ? "w-12 h-12 justify-center p-0" : "gap-3 p-3"
        )}>
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0 font-bold text-primary">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm uppercase">{(user?.name || user?.username || user?.fullName || "U")[0].toUpperCase()}</span>
            )}
          </div>
          
          {/* Name & Role */}
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{user?.name || user?.fullName || user?.username || "User"}</span>
                <span className="text-xs text-muted-foreground capitalize truncate">{currentRole}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 cursor-pointer",
            isCollapsed ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" : "w-full gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
          )}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronsLeft
            className={cn("w-5 h-5 shrink-0 transform transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
          />
          {!isCollapsed && <span className="sidebar-label">Collapse</span>}
          {isCollapsed && (
            <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
