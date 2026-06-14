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

  const navItems = [
    { name: "Dashboard", path: "/expenses-tracker", icon: <MdDashboard size={24} /> },
    {
      name: "Recurring",
      path: "/expenses-tracker/recurring",
      icon: <MdAccountBalanceWallet size={24} />,
    },
    { name: "Analytics", path: "/expenses-tracker/analytics", icon: <MdPieChart size={24} /> },
    { name: "Bill History", path: "/expenses-tracker/bills/history", icon: <MdHistory size={24} /> },
    { name: "Settings", path: "/student/settings?tab=expenses", icon: <MdSettings size={24} /> },
  ];


  return (
    <div className={cn(
      "flex flex-col h-full bg-card sidebar-transition select-none gemini-sidebar",
      isCollapsed ? "px-2 py-6" : ""
    )}>
      {/* Branding */}
      <div className="flex items-center justify-center h-20 border-b border-border shrink-0">
        <h1 className="text-2xl font-bold font-mont tracking-wider text-foreground">
          {isCollapsed ? (
            <span className="text-brand-primary">F<span className="text-foreground">T</span></span>
          ) : (
            <><span className="text-brand-primary">Fin</span>Track</>
          )}
        </h1>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex flex-col flex-1 overflow-y-auto overflow-x-hidden",
        isCollapsed ? "items-center gap-3 py-6" : "px-4 py-6 space-y-1.5"
      )}>
        <Link
          to="/student/dashboard"
          onClick={closeMobileMenu}
          className={cn(
            "group relative flex items-center transition-all duration-200 sidebar-link-btn",
            isCollapsed 
              ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)] mb-4" 
              : "gap-4 px-4 py-3 mb-4 rounded-[var(--radius-md)]"
          )}
        >
          <div className="flex-shrink-0 transition-transform group-hover:-translate-x-1 duration-200">
            <MdArrowBack size={24} />
          </div>
          {!isCollapsed && <span>Back to Dashboard</span>}
          {isCollapsed && (
            <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
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
                "group relative flex items-center transition-all duration-200 sidebar-link-btn",
                isCollapsed 
                  ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                  : "gap-4 px-4 py-3 rounded-[var(--radius-md)]",
                isActive ? "active-link" : ""
              )
            }
          >
            <div className="flex-shrink-0 transition-transform group-hover:scale-110 duration-200">
              {item.icon}
            </div>
            {!isCollapsed && <span>{item.name}</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-slate-900 text-white text-xs font-semibold shadow-md transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={cn(
        "mt-auto border-t border-border shrink-0 flex flex-col",
        isCollapsed ? "items-center gap-3 p-2" : "space-y-3 p-4"
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
              <span className="text-sm uppercase">{(user?.username || user?.name || 'U')[0].toUpperCase()}</span>
            )}
          </div>
          
          {/* Name & Role */}
          {!isCollapsed && (
            <div className="flex-1 flex items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{user?.username || user?.name || "User"}</span>
                <span className="text-xs text-muted-foreground capitalize truncate">Student</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            </div>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "group relative flex items-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 w-full cursor-pointer",
            isCollapsed ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
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
