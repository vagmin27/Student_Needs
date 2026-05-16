import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTutorProfile } from "../../utils/Tutorials/api";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  return (
    <DashboardLayout pageTitle="Tutor Dashboard" role="tutor">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">👨‍🏫 Tutor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your teaching schedule and students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <CardTitle>Availability</CardTitle>
            <CardDescription>Set your working hours and days</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/tutorials/tutor/availability")}
            >
              Set Availability
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <User className="w-5 h-5" />
            </div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>View and update your public tutor profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate("/tutorials/tutor/editProfile")}
            >
              View Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <BookOpen className="w-5 h-5" />
            </div>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Check your upcoming classes and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              className="w-full" 
              onClick={() => navigate("/tutorials/tutor/schedule")}
            >
              View Schedule
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>Accept or decline new student requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              onClick={() => navigate("/tutorials/tutor/accept")}
            >
              Manage Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default TutorDashboard;
