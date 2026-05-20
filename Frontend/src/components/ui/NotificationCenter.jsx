import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useNavigate } from "react-router-dom";

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isConnected, on } = useWebSocket();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/api/notifications?limit=10");
      if (res.data?.success) {
        setNotifications(res.data.data.notifications);
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen to real-time incoming notifications
    on("notification", (newNotification) => {
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Polling fallback every 3 minutes if WebSocket is disconnected and tab is visible
    let interval;
    if (!isConnected) {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchNotifications();
        }
      }, 180000);
    }
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, link) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      
      await apiClient.put(`/api/notifications/${id}/read`);
      
      if (link) {
        setIsOpen(false);
        navigate(link);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      await apiClient.put("/api/notifications/read-all");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-muted-foreground hover:bg-secondary relative transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
            <h3 className="font-semibold text-foreground tracking-tight">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((notif) => (
                  <li
                    key={notif._id}
                    onClick={() => handleMarkAsRead(notif._id, notif.link)}
                    className={`p-4 hover:bg-secondary/50 cursor-pointer transition-colors ${
                      !notif.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                          <p className={`text-sm font-medium ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                            {notif.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-2 border-t border-border bg-secondary/30 text-center">
            <button 
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
