import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorProfile } from "@/services/api/tutorialsApi.js";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DashboardSection } from "../../components/dashboard/shared/DashboardSection";
import { DashboardCard } from "../../components/dashboard/shared/DashboardCard";
import { BookingActivityTimeline } from "../../components/dashboard/tutor/BookingActivityTimeline";
import { apiClient, tutorsApiClient } from "@/services/apiClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Button } from "@/components/ui/button";
import { PremiumButton } from "../../components/dashboard/shared/Primitives";
import { Calendar, User, BookOpen, Inbox, MessageSquare } from "lucide-react";
import { toast } from "sonner";

function TutorDashboard() {
  const navigate = useNavigate();

  const { on, off } = useWebSocket();
  const [analytics, setAnalytics] = useState({ recentRequests: [], activityTimeline: [] });
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await apiClient.get("/api/analytics/tutor-dashboard");
      if (res.data?.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch tutor analytics", err);
    }
  }, []);

  const fetchUnread = useCallback(async () => {
    try {
      const { data } = await tutorsApiClient.get("/tutorial-chat/conversations");
      if (data?.success && data?.data) {
        const totalUnread = data.data.reduce((acc, chat) => {
          return acc + (chat.unreadCount || 0);
        }, 0);
        setUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error("Failed to load chat unreads in tutor dashboard", err);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
    fetchUnread();
  }, [fetchAnalytics, fetchUnread]);

  useEffect(() => {
    const handler = () => {
      fetchAnalytics();
      fetchUnread();
    };
    on("dashboard_refresh", handler);
    return () => {
      if (off) off("dashboard_refresh", handler);
    };
  }, [on, off, fetchAnalytics, fetchUnread]);

  return (
    <DashboardLayout pageTitle="Tutor Dashboard" role="tutor">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">Tutor Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your teaching schedule and students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-md">
          <DashboardSection title="Quick Actions">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <DashboardCard className="border-l-4 border-l-primary" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Availability</h3>
                <p className="text-xs text-muted-foreground mb-4">Set your working hours and days</p>
                <PremiumButton size="sm" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/availability")}>
                  Set Availability
                </PremiumButton>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-blue-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Profile</h3>
                <p className="text-xs text-muted-foreground mb-4">View and update your public tutor profile</p>
                <PremiumButton variant="outline" size="sm" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/editProfile")}>
                  View Profile
                </PremiumButton>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-emerald-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Schedule</h3>
                <p className="text-xs text-muted-foreground mb-4">Check your upcoming classes and bookings</p>
                <PremiumButton variant="outline" size="sm" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/schedule")}>
                  View Schedule
                </PremiumButton>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-amber-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                  <Inbox className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Manage Requests</h3>
                <p className="text-xs text-muted-foreground mb-4">Accept or decline new student requests</p>
                <PremiumButton size="sm" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/accept")}>
                  View All Requests
                </PremiumButton>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-purple-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Attendance Management</h3>
                <p className="text-xs text-muted-foreground mb-4">Manage students, subjects, and attendance</p>
                <PremiumButton variant="outline" size="sm" className="w-full mt-auto" onClick={() => navigate("/tutorials/attendance")}>
                  Open Attendance Hub
                </PremiumButton>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-pink-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-pink-500/10 flex items-center justify-center text-pink-500 mb-4 relative">
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 flex items-center justify-center text-[9px] font-bold text-white bg-primary rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1 text-foreground">Chat / Messages</h3>
                <p className="text-xs text-muted-foreground mb-4">Chat with your students in real-time</p>
                <PremiumButton variant="outline" size="sm" className="w-full mt-auto font-medium" onClick={() => navigate("/tutorials/chat")}>
                  Open Chat Room
                </PremiumButton>
              </DashboardCard>
            </div>
          </DashboardSection>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Activity Timeline" description="Your recent booking activity">
            {analytics.activityTimeline.length > 0 ? (
              <BookingActivityTimeline activities={analytics.activityTimeline} />
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground border border-dashed border-border rounded-[var(--radius-sm)] bg-secondary/20 text-sm">
                No recent activity.
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TutorDashboard;
