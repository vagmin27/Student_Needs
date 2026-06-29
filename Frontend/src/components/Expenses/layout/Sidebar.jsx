import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdAccountBalanceWallet,
  MdSettings,
  MdPieChart,
  MdArrowBack,
  MdHistory,
} from "react-icons/md";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const Sidebar = () => {
  const { isCollapsed, toggleSidebar, closeMobileMenu } = useSidebar();
  const { user } = useAuth();

  const displayName = user?.username || user?.name || "User";

  const navItems = [
    { name: "Dashboard", path: "/expenses-tracker", icon: <MdDashboard size={20} /> },
    {
      name: "Recurring",
      path: "/expenses-tracker/recurring",
      icon: <MdAccountBalanceWallet size={20} />,
    },
    { name: "Analytics", path: "/expenses-tracker/analytics", icon: <MdPieChart size={20} /> },
    { name: "Bill History", path: "/expenses-tracker/bills/history", icon: <MdHistory size={20} /> },
    { name: "Settings", path: "/student/settings?tab=expenses", icon: <MdSettings size={20} /> },
  ];

  return (
    <div className={cn(
      "flex flex-col h-full bg-[var(--card-bg)] select-none sidebar-transition border-r border-[var(--border-color)]",
      isCollapsed ? "px-2.5" : ""
    )}>
      {/* Branding Logo & Header */}
      <div className={cn(
        "flex items-center gap-3 h-[72px] border-b border-[var(--border-color)] px-6 shrink-0 mb-4",
        isCollapsed ? "justify-center px-4" : ""
      )}>
        <h1 className="text-base font-bold font-sans tracking-wider text-[var(--text-primary)]">
          {isCollapsed ? (
            <span className="text-[var(--primary)] font-black">F<span className="text-[var(--text-primary)]">T</span></span>
          ) : (
            <><span className="text-[var(--primary)]">Fin</span>Track</>
          )}
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1.5",
        isCollapsed ? "items-center py-4 gap-3" : ""
      )}>
        <Link
          to="/student/dashboard"
          onClick={closeMobileMenu}
          className={cn(
            "group relative flex items-center transition-all duration-200 cursor-pointer w-full mb-4",
            isCollapsed 
              ? "w-10 h-10 justify-center rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]" 
              : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <div className="flex-shrink-0 transition-transform group-hover:-translate-x-0.5 duration-200">
            <MdArrowBack size={20} />
          </div>
          {!isCollapsed && <span>Back to Dashboard</span>}
          {isCollapsed && (
            <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Back to Dashboard
            </div>
          )}
        </Link>
        
        {navItems?.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/expenses-tracker"}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center transition-all duration-200 cursor-pointer w-full",
                isCollapsed 
                  ? "w-10 h-10 justify-center rounded-lg" 
                  : "gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold",
                isActive 
                  ? "bg-[var(--accent)]/[0.08] text-[var(--accent)]" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-[3px] bg-[var(--accent)] rounded-r" />
                )}
                <div className={cn("flex-shrink-0 transition-transform group-hover:scale-105 duration-200", isActive ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]")}>
                  {item.icon}
                </div>
                {!isCollapsed && <span>{item.name}</span>}
                {isCollapsed && (
                  <div className="absolute left-14 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-[var(--card-bg)] text-[var(--text-primary)] border border-[var(--border-color)] text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto border-t border-[var(--border-color)] shrink-0 flex flex-col p-3 bg-[var(--bg-primary)]/40",
        isCollapsed ? "items-center" : ""
      )}>
        {/* User Card */}
        <div className={cn(
          "flex items-center rounded-lg border border-[var(--border-color)] transition-all duration-200 overflow-hidden bg-[var(--card-bg)] shadow-sm",
          isCollapsed ? "w-10 h-10 justify-center p-0 border-none" : "gap-3 p-2.5 w-full"
        )}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] border border-[var(--border-color)] overflow-hidden flex items-center justify-center shrink-0 font-bold text-white shadow-sm">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs uppercase font-bold">{(displayName)[0].toUpperCase()}</span>
            )}
          </div>
          
          {/* Name & Role */}
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between min-w-0 text-left">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">{displayName}</span>
                <span className="text-[10px] text-[var(--text-muted)] capitalize truncate">Student</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 ml-2" />
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
          <svg
            className={cn("w-5 h-5 shrink-0 transform transition-transform duration-300", isCollapsed ? "rotate-180" : "")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
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
