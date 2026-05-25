import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, LayoutDashboard, CalendarCheck, UserPlus, UserMinus, BookPlus, FileDown } from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

const HUB_ACTIONS = [
  { title: "Dashboard", description: "Overview of attendance stats and student records", to: "/tutorials/attendance/dashboard", icon: LayoutDashboard },
  { title: "Mark Attendance", description: "Select subject, date, and mark students present or absent", to: "/tutorials/attendance/mark", icon: CalendarCheck },
  { title: "Add Student", description: "Register a new student into the attendance system", to: "/tutorials/attendance/add-student", icon: UserPlus },
  { title: "Remove Student", description: "Permanently delete a student and their attendance records", to: "/tutorials/attendance/remove-student", icon: UserMinus },
  { title: "Add Subject", description: "Add a new subject for attendance tracking", to: "/tutorials/attendance/add-subject", icon: BookPlus },
  { title: "Reports", description: "Download attendance data as CSV for any date range", to: "/tutorials/attendance/reports", icon: FileDown },
];

export default function AttendanceManagementHub() {
  const { user } = useAuth();
  const isTeacher = ["teacher", "tutor"].includes((user?.role || "").toLowerCase());

  return (
    <div className="space-y-6">
      <Link to="/tutorials/home" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tutorials
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Manage students, subjects, and attendance records
        </p>
      </div>

      {!isTeacher ? (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-red-600 dark:text-red-400 font-medium">
                Attendance Management is for teachers. Contact your administrator.
              </p>
              <Link to="/tutorials/home" className="text-primary hover:underline inline-flex items-center gap-1">
                Back to Tutorials <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HUB_ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link key={index} to={action.to} className="group outline-none">
                <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 group-focus-visible:ring-2 ring-primary">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription className="text-sm mt-2">{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                      Open Module <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
