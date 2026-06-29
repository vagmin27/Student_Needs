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
      { name: "Dashboard", href: "/tutorials/tutor/dashboard", icon: LayoutDashboard },
      { name: "Schedule", href: "/tutorials/tutor/schedule", icon: CalendarDays },
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
      { name: "Dashboard", href: "/alumni/dashboard", icon: LayoutDashboard },
      { name: "Chat", href: "/alumni/chat", icon: MessageSquare },
    ];
  } else if (currentRole === "admin") {
    links = [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Contact Messages", href: "/admin/contact-messages", icon: Inbox },
    ];
  } else {
    links = [
      { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
      { name: "Attendance", href: "/student/attendance", icon: CalendarDays },
      { name: "Expenses", href: "/expenses-tracker", icon: CreditCard },
      { name: "Tutorials", href: TUTORIAL_PATHS.unifiedEntry, icon: BookOpen },
      { name: "Referrals", href: "/referrals/browse-referrals", icon: Briefcase },
    ];
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-[var(--card-bg)] select-none sidebar-transition border-r border-[var(--border-color)]",
        className
      )}
    >
      {/* Branding Logo & Header */}
      <div className={cn(
        "flex items-center gap-3 h-[72px] border-b border-[var(--border-color)] px-6 shrink-0 mb-4",
        isCollapsed ? "justify-center px-4" : ""
      )}>
        <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(59,130,246,0.25)]">
          <span className="text-white font-extrabold text-base leading-none">U</span>
        </div>
        {!isCollapsed && (
          <span className="text-base font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap">
            UniConnect
          </span>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1.5",
        isCollapsed ? "items-center" : ""
      )}>
        {links?.map((link) => {
          const isActive = location.pathname === link.href || (link.href !== "/student/dashboard" && location.pathname.startsWith(link.href));
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "group relative flex items-center transition-all duration-200 cursor-pointer w-full",
                isCollapsed 
                  ? "w-10 h-10 justify-center rounded-lg" 
                  : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold",
                isActive 
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent)]" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--accent)] rounded-r" />
              )}
              <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")} />
              {!isCollapsed && (
                <span className="truncate">
                  {link.name}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}

        {/* Separator and Secondary Settings Panel */}
        <div className={cn(
          "pt-4 border-t border-[var(--border-color)] flex flex-col space-y-1.5 w-full",
          isCollapsed ? "items-center" : ""
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
              "group relative flex items-center transition-all duration-200 cursor-pointer w-full",
              isCollapsed 
                ? "w-10 h-10 justify-center rounded-lg" 
                : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold",
              location.pathname.includes("settings")
                ? "bg-[var(--accent)]/[0.08] text-[var(--accent)]" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            {location.pathname.includes("settings") && (
              <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--accent)] rounded-r" />
            )}
            <Settings className={cn("w-5 h-5 shrink-0", location.pathname.includes("settings") ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")} />
            {!isCollapsed && <span className="truncate">Settings</span>}
            {isCollapsed && (
              <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Settings
              </div>
            )}
          </Link>

          <Link
            to="/student/settings"
            className={cn(
              "group relative flex items-center transition-all duration-200 cursor-pointer w-full",
              isCollapsed 
                ? "w-10 h-10 justify-center rounded-lg" 
                : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold",
              "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <HelpCircle className="w-5 h-5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
            {!isCollapsed && <span className="truncate">Help & Support</span>}
            {isCollapsed && (
              <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Help & Support
              </div>
            )}
          </Link>

          <button
            onClick={logout}
            className={cn(
              "group relative flex items-center transition-all duration-200 cursor-pointer w-full text-[var(--danger)] hover:bg-[var(--danger)]/10",
              isCollapsed 
                ? "w-10 h-10 justify-center rounded-lg" 
                : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 text-[var(--danger)]" />
            {!isCollapsed && <span className="truncate">Log out</span>}
            {isCollapsed && (
              <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--danger)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Log out
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Footer Profile Section */}
      <div className={cn(
        "mt-auto shrink-0 flex flex-col p-3 border-t border-[var(--border-color)] bg-[var(--bg-primary)]/40",
        isCollapsed ? "items-center" : ""
      )}>
        {/* User Badge Info Card */}
        <div className={cn(
          "flex items-center rounded-lg border border-[var(--border-color)] transition-all duration-200 overflow-hidden bg-[var(--card-bg)] shadow-sm",
          isCollapsed ? "w-10 h-10 justify-center p-0 border-none" : "gap-3 p-2.5 w-full"
        )}>
          {/* User Avatar Circle */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0 font-bold text-white shadow-sm">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs uppercase font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {/* Expanded Name & Role Details */}
          {!isCollapsed && (
            <div className="flex-1 flex flex-col min-w-0 text-left">
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">{displayName}</span>
              <span className="text-[10px] text-[var(--text-muted)] capitalize mt-0.5 truncate">
                {user?.role || user?.accountType || "Student"}
              </span>
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 w-full cursor-pointer mt-2",
            isCollapsed 
              ? "w-10 h-10 justify-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" 
              : "gap-3 px-3 py-2.5 rounded-lg text-xs font-bold"
          )}
          aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronsLeft
            className={cn("w-5 h-5 shrink-0 transform transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
          />
          {!isCollapsed && <span className="truncate">Collapse Sidebar</span>}
          {isCollapsed && (
            <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
