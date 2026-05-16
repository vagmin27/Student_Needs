import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorProfile } from "../../utils/Tutorials/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { DashboardSection } from "../../components/dashboard/shared/DashboardSection";
import { DashboardCard } from "../../components/dashboard/shared/DashboardCard";
import { BookingActivityTimeline } from "../../components/dashboard/tutor/BookingActivityTimeline";
import { RecentRequestsFeed } from "../../components/dashboard/tutor/RecentRequestsFeed";
import { MOCK_ACTIVITY_TIMELINE, MOCK_RECENT_REQUESTS } from "../../data/dashboard/tutorMockData";
import { Button } from "@/components/ui/button";
import { Calendar, User, BookOpen, Inbox } from "lucide-react";

function TutorDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await getTutorProfile();

        if (!res.data?.profile) {
          navigate("/login/teacher");
        }
      } catch {
        navigate("/login/teacher");
      }
    };

    check();
  }, [navigate]);

  const handleAcceptRequest = useCallback((id) => {
    console.log("Accepted request", id);
    // TODO: implement accept logic
  }, []);

  const handleDeclineRequest = useCallback((id) => {
    console.log("Declined request", id);
    // TODO: implement decline logic
  }, []);

  return (
    <DashboardLayout pageTitle="Tutor Dashboard" role="tutor">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">👨‍🏫 Tutor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your teaching schedule and students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardSection title="Quick Actions">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DashboardCard className="border-l-4 border-l-primary" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Availability</h3>
                <p className="text-sm text-muted-foreground mb-4">Set your working hours and days</p>
                <Button className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/availability")}>
                  Set Availability
                </Button>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-blue-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">View and update your public tutor profile</p>
                <Button variant="outline" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/editProfile")}>
                  View Profile
                </Button>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-emerald-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Schedule</h3>
                <p className="text-sm text-muted-foreground mb-4">Check your upcoming classes and bookings</p>
                <Button variant="outline" className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/schedule")}>
                  View Schedule
                </Button>
              </DashboardCard>

              <DashboardCard className="border-l-4 border-l-amber-500" contentClassName="flex flex-col items-start p-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
                  <Inbox className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-1">Manage Requests</h3>
                <p className="text-sm text-muted-foreground mb-4">Accept or decline new student requests</p>
                <Button className="w-full mt-auto" onClick={() => navigate("/tutorials/tutor/accept")}>
                  View All Requests
                </Button>
              </DashboardCard>
            </div>
          </DashboardSection>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Pending Requests" description="Students waiting for your approval">
            <RecentRequestsFeed 
              requests={MOCK_RECENT_REQUESTS} 
              onAccept={handleAcceptRequest} 
              onDecline={handleDeclineRequest} 
            />
          </DashboardCard>

          <DashboardCard title="Activity Timeline" description="Your recent booking activity">
            <BookingActivityTimeline activities={MOCK_ACTIVITY_TIMELINE} />
          </DashboardCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TutorDashboard;
