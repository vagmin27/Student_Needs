import { useState, useEffect } from "react";
import { getBookings } from "@/services/api/tutorialsApi";
import { tutorsApiClient } from "@/services/apiClient";
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
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    let isMounted = true;

    async function fetchDashboardData() {
      try {
        setLoading(true);

        const [bookingsRes, chatsRes] = await Promise.allSettled([
          getBookings(),
          tutorsApiClient.get("/tutorial-chat/conversations"),
        ]);

        if (!isMounted) return;

        const bookings = bookingsRes.status === "fulfilled" ? bookingsRes.value : [];
        const chats = chatsRes.status === "fulfilled" ? chatsRes.value?.data : [];

        // Normalize string statuses
        const getStatus = (b) => (b.status || "").toLowerCase();

        // Parse metrics
        const pendingBookings = bookings.filter(b => getStatus(b) === "pending" || getStatus(b) === "requested");
        const upcomingBookings = bookings.filter(b => getStatus(b) === "upcoming" || getStatus(b) === "accepted" || getStatus(b) === "scheduled");
        const completedClasses = bookings.filter(b => getStatus(b) === "completed");

        // Parse upcoming sessions
        const upcomingSessions = bookings
          .filter(b => ["upcoming", "accepted", "pending", "scheduled"].includes(getStatus(b)))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Synthesize recent activity
        const bookingActivity = bookings.map(b => {
          const timestamp = new Date(b.updatedAt || b.createdAt || b.date).getTime();
          return {
            id: `booking-${b.id || Math.random()}`,
            type: "booking",
            title: `Booking ${b.status || "created"}`,
            desc: `${b.subject || "Session"} with ${b.tutorName || "Tutor"}`,
            time: timestamp,
            status: b.status,
            dateString: b.date
          };
        });

        const chatActivity = Array.isArray(chats) ? chats.map(c => {
          const timestamp = new Date(c.updatedAt || c.createdAt).getTime();
          return {
            id: `chat-${c._id || Math.random()}`,
            type: "chat",
            title: "Active Conversation",
            desc: "Chat activity recorded",
            time: timestamp,
          };
        }) : [];

        const recentActivity = [...bookingActivity, ...chatActivity]
          .filter(a => !isNaN(a.time))
          .sort((a, b) => b.time - a.time)
          .slice(0, 10);

        setData({
          metrics: {
            upcomingBookings: upcomingBookings.length + pendingBookings.length,
            completedClasses: completedClasses.length,
            activeConversations: Array.isArray(chats) ? chats.length : 0,
            pendingRequests: pendingBookings.length,
          },
          upcomingSessions,
          recentActivity,
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
