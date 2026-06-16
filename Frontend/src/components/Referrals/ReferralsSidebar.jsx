import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import { useSidebar } from "@/contexts/SidebarContext";
import { useWebSocket } from "@/hooks/useWebSocket.js";
import { chatApi } from "@/services/Referrals/chat.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import {
  CheckSquare,
  Briefcase,
  Users,
  FileText,
  MessageSquare,
  Settings,
  ChevronRight,
  ArrowLeft,
  Briefcase as ReferralIcon,
} from "lucide-react";

const ReferralsSidebar = ({ className }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isCollapsed, toggleSidebar, closeMobileMenu } = useSidebar();
  const { isConnected, on, off } = useWebSocket();

  const [unreadChatsCount, setUnreadChatsCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);

  const currentRole = (
    user?.role ||
    user?.accountType ||
    "student"
  ).toLowerCase();

  // Fetch unread chats count and listen to WebSocket message events
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await chatApi.getChats();
        if (response.success && Array.isArray(response.data)) {
          const count = response.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
          setUnreadChatsCount(count);
        }
      } catch (error) {
        console.error('Error fetching unread chats count:', error);
      }
    };

    fetchUnreadCount();

    const handleNewMessage = () => {
      fetchUnreadCount();
    };

    on('message', handleNewMessage);

    const interval = setInterval(fetchUnreadCount, 10000);

    // Custom event listener for real-time updates from ChatPage
    const handleUnreadCountChange = (e) => {
      if (e.detail && typeof e.detail.count === 'number') {
        setUnreadChatsCount(e.detail.count);
      }
    };
    window.addEventListener("chat_unread_count_changed", handleUnreadCountChange);

    return () => {
      off('message', handleNewMessage);
      clearInterval(interval);
      window.removeEventListener("chat_unread_count_changed", handleUnreadCountChange);
    };
  }, [isConnected, on, off]);

  // Fetch applied jobs count and listen to new applications
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const fetchAppliedCount = async () => {
      try {
        const response = await opportunitiesApi.getMyApplications();
        if (response.success && response.data) {
          setAppliedCount(response.data.applications?.length || 0);
        }
      } catch (error) {
        console.error('Error fetching applied count:', error);
      }
    };

    fetchAppliedCount();
    const interval = setInterval(fetchAppliedCount, 10000);

    const handleApplied = () => {
      fetchAppliedCount();
    };
    window.addEventListener("opportunity_applied", handleApplied);

    return () => {
      clearInterval(interval);
      window.removeEventListener("opportunity_applied", handleApplied);
    };
  }, []);

  const links = [
    {
      name: "Applied Jobs",
      href: "/referrals/applied-jobs",
      icon: CheckSquare,
      badge: appliedCount > 0 ? appliedCount : null,
    },
    {
      name: "Browse Jobs",
      href: "/referrals/browse-jobs",
      icon: Briefcase,
    },
    {
      name: "Browse Referrals",
      href: "/referrals/browse-referrals",
      icon: Users,
    },
    {
      name: "My Profile",
      href: "/referrals/profile",
      icon: FileText,
    },
    {
      name: "Chat",
      href: "/referrals/chat",
      icon: MessageSquare,
      badge: unreadChatsCount > 0 ? unreadChatsCount : null,
      badgeColor: "bg-red-500 text-white animate-pulse",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-card overflow-y-auto overflow-x-hidden select-none sidebar-transition gemini-sidebar",
        isCollapsed ? "px-2 py-6" : "p-4",
        className
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 mb-8 px-2 shrink-0", isCollapsed ? "justify-center" : "")}>
        <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary flex items-center justify-center shrink-0">
          <ReferralIcon className="w-5 h-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
            Referrals Hub
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex flex-col flex-1",
        isCollapsed ? "items-center gap-3" : "space-y-1.5"
      )}>
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              to={link.href}
              onClick={closeMobileMenu}
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
              
              {/* Count Badge */}
              {!isCollapsed && link.badge !== null && link.badge !== undefined && (
                <span className={cn(
                  "ml-auto px-1.5 py-0.5 rounded-full text-xs font-bold shrink-0",
                  link.badgeColor || "bg-primary/20 text-primary"
                )}>
                  {link.badge}
                </span>
              )}

              {/* Collapsed Badge indicator */}
              {isCollapsed && link.badge !== null && link.badge !== undefined && (
                <span className={cn(
                  "absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-card",
                  link.badgeColor ? "bg-red-500" : "bg-primary"
                )} />
              )}
              
              {/* Tooltip */}
              {isCollapsed && (
                <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                  {link.name}
                </div>
              )}
            </Link>
          );
        })}

        {/* Back to Dashboard, Settings & Logout inside nav */}
        <div className={cn(
          "pt-4 border-t border-border/50 flex flex-col",
          isCollapsed ? "items-center gap-3" : "space-y-1.5"
        )}>
          {/* Back to Dashboard */}
          <Link
            to="/student/dashboard"
            onClick={closeMobileMenu}
            className={cn(
              "group relative flex items-center transition-colors sidebar-link-btn text-muted-foreground hover:text-foreground",
              isCollapsed 
                ? "w-12 h-12 justify-center p-0 rounded-[var(--radius-lg)]" 
                : "gap-3 px-3 py-2.5 rounded-[var(--radius-md)]"
            )}
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Back to Dashboard</span>}
            {isCollapsed && (
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Back to Dashboard
              </div>
            )}
          </Link>

          {/* Settings */}
          <Link
            to="/student/settings"
            onClick={closeMobileMenu}
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
              <div className="absolute left-16 scale-0 rounded-[var(--radius-sm)] px-2 py-1 bg-popover text-popover-foreground border border-border text-xs font-semibold shadow-[var(--shadow-md)] transition-all group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none">
                Settings
              </div>
            )}
          </Link>
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

export default ReferralsSidebar;
