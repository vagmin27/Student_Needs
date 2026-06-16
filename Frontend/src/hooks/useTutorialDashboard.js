import { useState, useEffect } from "react";
import { getBookings } from "@/services/api/tutorialsApi";
import { tutorsApiClient, apiClient } from "@/services/apiClient";
import { useAuth } from "@/contexts/GlobalAuthContext";

export function useTutorialDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    metrics: {
      upcomingBookings: 0,
      completedClasses: 0,
      activeConversations: 0,
      pendingRequests: 0,
    },
    upcomingSessions: [],
    recentActivity: [],
    hasData: true,
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        setLoading(true);

        const [bookingsRes, chatsRes, analyticsRes] = await Promise.allSettled([
          getBookings(),
          tutorsApiClient.get("/tutorial-chat/conversations"),
          apiClient.get("/api/analytics/student-dashboard")
        ]);

        if (!isMounted) return;

        const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value : [];
        const chats = chatsRes.status === "fulfilled" ? chatsRes.value?.data : [];
        const analytics = analyticsRes.status === "fulfilled" && analyticsRes.value?.data?.success 
          ? analyticsRes.value.data.data 
          : null;

        // Normalize string statuses
        const getStatus = (b) => (b.status || "").toLowerCase();

        // Parse metrics exactly as original
        const pendingBookings = bookings.filter(b => getStatus(b) === "pending" || getStatus(b) === "requested");
        const upcomingBookings = bookings.filter(b => getStatus(b) === "upcoming" || getStatus(b) === "accepted" || getStatus(b) === "scheduled");
        const completedClasses = bookings.filter(b => getStatus(b) === "completed");

        // Parse upcoming sessions exactly as original
        const upcomingSessions = bookings
          .filter(b => ["upcoming", "accepted", "pending", "scheduled"].includes(getStatus(b)))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Format recent activity using the unified timeline
        let recentActivity = [];
        if (analytics && analytics.activityTimeline) {
           const timeline = analytics.activityTimeline;
           const chatActivity = Array.isArray(chats) ? chats.map(c => {
             const timestamp = new Date(c.updatedAt || c.createdAt).getTime();
             return {
               id: `chat-${c._id || Math.random()}`,
               type: "chat",
               title: "Active Conversation",
               subtitle: "Chat activity recorded",
               timestamp: timestamp,
             };
           }) : [];

           recentActivity = [...timeline, ...chatActivity]
             .sort((a, b) => new Date(b.timestamp || b.time) - new Date(a.timestamp || a.time))
             .slice(0, 10);
        } else {
           // Fallback to original raw booking mapping if analytics fails
           const bookingActivity = bookings.map(b => {
            const timestamp = new Date(b.updatedAt || b.createdAt || b.date).getTime();
            return {
              id: `booking-${b.id || Math.random()}`,
              type: "booking",
              title: `Booking ${b.status || "created"}`,
              subtitle: `${b.subject || "Session"} with ${b.tutorName || "Tutor"}`,
              timestamp: timestamp,
              color: 'text-[var(--primary)]'
            };
          });
          const chatActivity = Array.isArray(chats) ? chats.map(c => {
            const timestamp = new Date(c.updatedAt || c.createdAt).getTime();
            return {
              id: `chat-${c._id || Math.random()}`,
              type: "chat",
              title: "Active Conversation",
              subtitle: "Chat activity recorded",
              timestamp: timestamp,
            };
          }) : [];

          recentActivity = [...bookingActivity, ...chatActivity]
            .filter(a => !isNaN(a.timestamp))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10);
        }

        setData({
          metrics: {
            upcomingBookings: upcomingBookings.length + pendingBookings.length,
            completedClasses: completedClasses.length,
            activeConversations: Array.isArray(chats) ? chats.length : 0,
            pendingRequests: pendingBookings.length,
          },
          upcomingSessions,
          recentActivity,
          bookings,
          hasData: bookings.length > 0 || (Array.isArray(chats) && chats.length > 0),
        });

      } catch (err) {
        console.error("Dashboard fetch error", err);
        setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return { ...data, loading, error };
}
