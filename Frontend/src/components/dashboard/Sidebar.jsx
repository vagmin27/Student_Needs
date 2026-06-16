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
  ChevronsLeft,
  HelpCircle,
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

  const displayName = user?.name || user?.fullName || user?.username || "User";

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
  } else if (currentRole === "admin") {
    links = [
      {
        name: "Dashboard",
        href: "/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Contact Messages",
        href: "/admin/contact-messages",
        icon: Inbox,
      },
    ];
  } else {
    // Default Student Links (Calendar, Alumni Hub, Messages are removed completely)
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
        "flex flex-col h-full bg-card overflow-y-auto overflow-x-hidden select-none sidebar-transition border-r border-border gemini-sidebar",
        isCollapsed ? "px-2.5 py-6" : "p-6",
        className
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 mb-8 px-2 shrink-0", isCollapsed ? "justify-center" : "")}>
        <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#4f46e5] to-[#3b82f6] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(79,70,229,0.3)]">
          <span className="text-white font-bold text-lg leading-none">
            U
          </span>
        </div>
        {!isCollapsed && (
          <span className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap">
            UniConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex flex-col flex-1",
        isCollapsed ? "items-center gap-3" : "space-y-4"
      )}>
        {links?.map((link) => {
          const isActive = location.pathname === link.href || (link.href !== "/student/dashboard" && location.pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "group relative flex items-center transition-all duration-200",
                isCollapsed 
                  ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                  : "gap-4 px-[18px] py-[14px] rounded-[14px]",
                isActive 
                  ? "text-[#4f46e5] dark:text-[#818cf8] font-semibold" 
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1"
              )}
              style={isActive ? {
                background: "linear-gradient(90deg, rgba(99, 102, 241, 0.28), rgba(59, 130, 246, 0.18))"
              } : undefined}
            >
              <Icon className={cn("w-6 h-6 shrink-0", isActive ? "text-[#4f46e5] dark:text-[#818cf8]" : "text-muted-foreground group-hover:text-foreground")} />
              {!isCollapsed && (
                <span className={cn(
                  "whitespace-nowrap font-medium text-base lg:text-lg tracking-wide",
                  isActive ? "text-[#4f46e5] dark:text-[#818cf8]" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {link.name}
                </span>
              )}
              
              {/* Premium CSS Tooltip */}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}

        {/* Settings & Logout inside nav as part of middle navigation */}
        <div className={cn(
          "pt-4 border-t border-border flex flex-col",
          isCollapsed ? "items-center gap-3" : "space-y-4 pt-4"
        )}>
          <Link
            to={
              currentRole === "student"
                ? "/student/settings"
                : currentRole === "alumni"
                ? "/alumni/settings"
                : currentRole === "tutor"
                ? "/tutorials/tutor/settings"
                : currentRole === "admin"
                ? "/admin/settings"
                : "/tutorials/profile/accountSettings"
            }
            className={cn(
              "group relative flex items-center transition-all duration-200",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-4 px-[18px] py-[14px] rounded-[14px]",
              location.pathname.includes("settings")
                ? "text-[#4f46e5] dark:text-[#818cf8] font-semibold" 
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1"
            )}
            style={location.pathname.includes("settings") ? {
              background: "linear-gradient(90deg, rgba(99, 102, 241, 0.28), rgba(59, 130, 246, 0.18))"
            } : undefined}
          >
            <Settings className={cn("w-6 h-6 shrink-0", location.pathname.includes("settings") ? "text-[#4f46e5] dark:text-[#818cf8]" : "text-muted-foreground group-hover:text-foreground")} />
            {!isCollapsed && (
              <span className={cn(
                "whitespace-nowrap font-medium text-base lg:text-lg tracking-wide",
                location.pathname.includes("settings") ? "text-[#4f46e5] dark:text-[#818cf8]" : "text-muted-foreground group-hover:text-foreground"
              )}>
                Settings
              </span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Settings
              </div>
            )}
          </Link>

          <Link
            to="/student/settings"
            className={cn(
              "group relative flex items-center transition-all duration-200",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-4 px-[18px] py-[14px] rounded-[14px]",
              "text-muted-foreground hover:bg-secondary/60 hover:text-foreground hover:translate-x-1"
            )}
          >
            <HelpCircle className="w-6 h-6 shrink-0 text-muted-foreground group-hover:text-foreground" />
            {!isCollapsed && (
              <span className="whitespace-nowrap font-medium text-base lg:text-lg tracking-wide text-muted-foreground group-hover:text-foreground">
                Help & Support
              </span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Help & Support
              </div>
            )}
          </Link>

          <button
            onClick={logout}
            className={cn(
              "group relative flex items-center transition-all duration-200 cursor-pointer text-[#ef4444] hover:bg-[#ef4444]/10",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-4 px-[18px] py-[14px] rounded-[14px]"
            )}
          >
            <LogOut className="w-6 h-6 shrink-0 text-[#ef4444]" />
            {!isCollapsed && (
              <span className="whitespace-nowrap font-semibold text-base lg:text-lg tracking-wide text-[#ef4444]">
                Log out
              </span>
            )}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Log out
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto shrink-0 flex flex-col pt-4 border-t border-border mt-4",
        isCollapsed ? "items-center gap-3" : "space-y-4"
      )}>
        {/* User Card */}
        <div className={cn(
          "flex items-center transition-all duration-200 overflow-hidden",
          isCollapsed ? "w-12 h-12 justify-center p-0 bg-muted border border-border rounded-[var(--radius-lg)]" : "gap-3 py-3 px-2 w-full"
        )}>
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] border border-indigo-500/20 overflow-hidden flex items-center justify-center shrink-0 font-bold text-white shadow-md">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm uppercase font-extrabold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Name & Role */}
          {!isCollapsed && (
            <div className="flex-1 flex flex-col min-w-0">
              <span className="text-sm font-bold text-foreground truncate">{displayName}</span>
              <span className="text-xs text-muted-foreground capitalize mt-0.5 truncate">
                {user?.role || user?.accountType || "Student"}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer mt-1",
            isCollapsed 
              ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)] bg-muted border border-border" 
              : "w-full gap-4 px-[18px] py-[14px] rounded-[14px] text-sm font-semibold"
          )}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronsLeft
            className={cn("w-6 h-6 shrink-0 transform transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
          />
          {!isCollapsed && <span className="sidebar-label text-sm text-muted-foreground font-bold group-hover:text-foreground">Collapse</span>}
          {isCollapsed && (
            <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
