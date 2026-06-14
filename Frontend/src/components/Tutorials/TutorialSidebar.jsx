import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Search, CalendarClock, History, ClipboardList, 
  MessageSquare, User, Settings, LogOut, ArrowLeft,
  ChevronLeft, ChevronRight, Home, GraduationCap
} from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", path: "/tutorials/home", icon: Home },
  { label: "Find Tutor", path: "/tutorials/find", icon: Search },
  { label: "My Bookings", path: "/tutorials/bookings", icon: CalendarClock },
  { label: "Class History", path: "/tutorials/history", icon: History },
  { label: "Online Attendance", path: "/tutorials/online-attendance", icon: ClipboardList },
  { label: "Tutor Chats", path: "/tutorials/chat", icon: MessageSquare },
  { label: "My Profile", path: "/tutorials/profile", icon: User },
  { label: "Settings", path: "/tutorials/settings", icon: Settings },
];

const TutorialSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isCollapsed, setIsCollapsed, closeMobileMenu } = useSidebar();

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card overflow-y-auto overflow-x-hidden select-none sidebar-transition gemini-sidebar",
        isCollapsed ? "px-2 py-6" : "p-4"
      )}
    >
      {/* Brand / Logo */}
      <div className={cn("flex items-center gap-3 mb-8 px-2 shrink-0", isCollapsed ? "justify-center" : "")}>
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-[var(--shadow-sm)]">
          <GraduationCap className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
            UniConnect <span className="text-primary font-black">Tutorials</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex flex-col flex-1",
        isCollapsed ? "items-center gap-3" : "space-y-1.5"
      )}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) => cn(
              "group relative flex items-center transition-all duration-200 sidebar-link-btn",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)]",
              isActive ? "active-link" : ""
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}

        <div className={cn(
          "pt-4 border-t border-border/50 flex flex-col",
          isCollapsed ? "items-center gap-3" : "space-y-1.5"
        )}>
          <button
            onClick={() => {
              navigate("/student/dashboard");
              closeMobileMenu();
            }}
            className={cn(
              "group relative flex items-center transition-colors sidebar-link-btn text-muted-foreground hover:text-foreground cursor-pointer",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)] w-full"
            )}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Back to Dashboard</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Back to Dashboard
              </div>
            )}
          </button>
          
          <button
            onClick={() => {
              if (logout) {
                logout();
              } else {
                navigate("/login");
              }
            }}
            className={cn(
              "group relative flex items-center transition-colors text-destructive hover:bg-destructive/10 cursor-pointer",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)] w-full"
            )}
          >
            <LogOut className="w-5 h-5 shrink-0 text-destructive" />
            {!isCollapsed && <span className="whitespace-nowrap font-medium text-destructive">Logout</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Logout
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Collapse Toggle (Desktop only) */}
      <div className={cn("hidden md:flex shrink-0 border-t border-border/50 pt-4", isCollapsed ? "justify-center" : "")}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "group relative flex items-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 cursor-pointer",
            isCollapsed ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" : "w-full gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
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
            <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
              Expand
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default TutorialSidebar;
