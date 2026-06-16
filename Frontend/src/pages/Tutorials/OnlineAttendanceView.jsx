import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, GraduationCap, Info } from "lucide-react";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import API, { TUTOR_ATTENDANCE_PATHS } from "@/services/Attendance/tutorAttendanceApi";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { MetricCard } from "@/components/dashboard/shared/MetricCard";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const statusBadge = (status) => {
  const isPresent = status === "present";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isPresent
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      }`}
    >
      {isPresent ? "Present" : "Absent"}
    </span>
  );
};

export default function OnlineAttendanceView() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.studentSummary);
      setSummary(res.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const overall = summary?.overall || {
    totalClasses: 0,
    classesAttended: 0,
    attendancePercentage: 0,
  };
  const courses = summary?.courses || [];

  return (
    <div className="space-y-6 pb-8">
      <Link
        to={TUTORIAL_PATHS.moduleHome}
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tutorials
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">View Online Attendance</h1>
        <p className="text-muted-foreground mt-1">
          Tutor-marked attendance for your online classes. You cannot create or edit these
          records.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-blue-200 bg-[var(--primary)]/10/80 dark:bg-blue-950/20 dark:border-blue-900/50 p-4 text-sm text-blue-900 dark:text-blue-200">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p>
          College attendance is tracked separately on{" "}
          <a href="/student/attendance" className="font-medium underline">
            My Attendance
          </a>
          . This page shows only online tutorial sessions marked by your tutor.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center pt-16">
          <span className="spinner spinner-lg" />
        </div>
      ) : (
        <>
          <DashboardSection title="Overall (online classes)">
            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                title="Total classes"
                value={overall.totalClasses}
                icon={CalendarDays}
              />
              <MetricCard
                title="Classes attended"
                value={overall.classesAttended}
                icon={GraduationCap}
              />
              <MetricCard
                title="Attendance %"
                value={`${overall.attendancePercentage}%`}
                icon={BookOpen}
              />
            </div>
          </DashboardSection>

          <DashboardSection title="By course">
            {courses.length === 0 ? (
              <DashboardCard>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No online class attendance recorded yet. Records appear after your tutor
                  marks attendance for a session.
                </p>
              </DashboardCard>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const key = `${course.tutorId}-${course.courseName}`;
                  const isOpen = expandedCourse === key;
                  return (
                    <Card key={key}>
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => setExpandedCourse(isOpen ? null : key)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <CardTitle className="text-lg">{course.courseName}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Tutor: {course.tutorName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Attended {course.classesAttended} of {course.totalClasses} classes
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">Attendance</p>
                            <p className="text-primary font-bold text-lg">
                              {course.attendancePercentage}%
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      {isOpen && (
                        <CardContent>
                          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                            Attendance history
                          </p>
                          <div className="divide-y rounded-[var(--radius-sm)] border">
                            {course.history.map((row) => (
                              <div
                                key={row.id}
                                className="flex items-center justify-between px-3 py-2 text-sm"
                              >
                                <span>
                                  {row.date}
                                  {row.sessionTime ? ` · ${row.sessionTime}` : ""}
                                </span>
                                {statusBadge(row.status)}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </DashboardSection>
        </>
      )}
    </div>
  );
}
