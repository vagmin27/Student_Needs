import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarClock,
  User,
  History,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";

const MODULE_ACTIONS = [
  {
    title: "Find a Tutor",
    description: "Search tutors by subject and book a session",
    to: TUTORIAL_PATHS.studentSearch,
    icon: Search,
  },
  {
    title: "My Bookings",
    description: "View and manage upcoming tutorial bookings",
    to: "/tutorials/profile/manageBooking",
    icon: CalendarClock,
  },
  {
    title: "Class History",
    description: "Review past tutorial sessions",
    to: "/tutorials/profile/classHistory",
    icon: History,
  },
  {
    title: "View Online Attendance",
    description: "See attendance marked by your tutors for online classes",
    to: TUTORIAL_PATHS.studentOnlineAttendance,
    icon: ClipboardList,
  },
  {
    title: "My Profile",
    description: "Update your student profile and preferences",
    to: TUTORIAL_PATHS.studentProfile,
    icon: User,
  },
];

/**
 * Tutorial module home — entry hub (not the search/book page).
 */
function TutorialsHome() {
  return (
    <div className="space-y-6">
      <BackToStudentDashboard />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tutorials</h1>
        <p className="text-muted-foreground mt-1">
          Tutor Match — find tutors, manage bookings, and view online class attendance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {MODULE_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} to={action.to} className="block h-full">
              <Card className="h-full hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        New to Tutor Match?{" "}
        <Link to={TUTORIAL_PATHS.landing} className="text-primary hover:underline">
          View module info
        </Link>
        {" · "}
        <Link to={TUTORIAL_PATHS.studentLogin} className="text-primary hover:underline">
          Tutorials login
        </Link>
      </p>
    </div>
  );
}

export default TutorialsHome;
