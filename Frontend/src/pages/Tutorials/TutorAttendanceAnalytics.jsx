import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, User } from "lucide-react";
import API, {
  TUTOR_ATTENDANCE_PATHS,
} from "@/services/Attendance/tutorAttendanceApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";

const todayISO = () => new Date().toISOString().split("T")[0];
const getDateMonthsBack = (months) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split("T")[0];
};

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const formatDateLabel = (value) => {
  if (!value) return "Unknown date";
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TutorAttendanceAnalytics() {
  const { user } = useAuth();
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [sessionRecords, setSessionRecords] = useState([]);

  const [subject, setSubject] = useState("");
  const [dateFrom, setDateFrom] = useState(getDateMonthsBack(3));
  const [dateTo, setDateTo] = useState(todayISO());
  const [searchStudent, setSearchStudent] = useState("");

  const loadSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSubjects);
      const list = res.data || [];
      setSubjects(list);
      setSubject((prev) => {
        if (prev && list.some((s) => s.subjectName === prev)) return prev;
        return list[0]?.subjectName || "";
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setSubjects([]);
      setSubject("");
    } finally {
      setLoadingSubjects(false);
    }
  }, []);

  const loadAnalyticsData = useCallback(async () => {
    if (!subject) {
      setEnrolledStudents([]);
      setSessionRecords([]);
      return;
    }
    setLoadingData(true);
    try {
      const [studentsRes, sessionsRes] = await Promise.all([
        API.get(TUTOR_ATTENDANCE_PATHS.tutorEnrolled, {
          params: { subject },
        }),
        API.get(TUTOR_ATTENDANCE_PATHS.tutorSession, {
          params: { subject },
        }),
      ]);

      setEnrolledStudents(studentsRes.data?.students || []);
      setSessionRecords(sessionsRes.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setEnrolledStudents([]);
      setSessionRecords([]);
    } finally {
      setLoadingData(false);
    }
  }, [subject]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]);

  const filteredRecords = useMemo(() => {
    const fromTime = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const toTime = dateTo ? new Date(`${dateTo}T23:59:59.999`).getTime() : null;

    return (sessionRecords || []).filter((record) => {
      const recordTime = record.date
        ? new Date(`${record.date}T00:00:00`).getTime()
        : null;
      const isInDateRange =
        recordTime !== null &&
        (fromTime === null || recordTime >= fromTime) &&
        (toTime === null || recordTime <= toTime);
      const studentName = record.studentName || "Student";
      const matchesSearch =
        !searchStudent ||
        studentName.toLowerCase().includes(searchStudent.toLowerCase());
      return isInDateRange && matchesSearch;
    });
  }, [sessionRecords, dateFrom, dateTo, searchStudent]);

  const filteredSummary = useMemo(() => {
    const summaryByStudent = new Map();

    for (const student of enrolledStudents) {
      const name = student.name || "Student";
      if (
        searchStudent &&
        !name.toLowerCase().includes(searchStudent.toLowerCase())
      ) {
        continue;
      }
      summaryByStudent.set(student.studentId, {
        studentId: student.studentId,
        studentName: name,
        totalSessions: 0,
        presentCount: 0,
        absentCount: 0,
      });
    }

    for (const record of filteredRecords) {
      const studentId = String(record.studentId);
      const existing =
        summaryByStudent.get(studentId) || {
          studentId,
          studentName: record.studentName || "Student",
          totalSessions: 0,
          presentCount: 0,
          absentCount: 0,
        };
      existing.totalSessions += 1;
      if (record.status === "present") existing.presentCount += 1;
      if (record.status === "absent") existing.absentCount += 1;
      summaryByStudent.set(studentId, existing);
    }

    return [...summaryByStudent.values()].sort((a, b) =>
      a.studentName.localeCompare(b.studentName),
    );
  }, [enrolledStudents, filteredRecords, searchStudent]);

  const groupedHistory = useMemo(() => {
    const groups = new Map();

    for (const record of filteredRecords) {
      const dateKey = record.date || "unknown-date";
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(record);
    }

    return [...groups.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, records]) => ({
        date,
        records: records.sort((a, b) => {
          const timeA = a.sessionTime || "";
          const timeB = b.sessionTime || "";
          if (timeA !== timeB) return timeA.localeCompare(timeB);
          return (a.studentName || "").localeCompare(b.studentName || "");
        }),
      }));
  }, [filteredRecords]);

  const getStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    if (normalizedStatus === "present")
      return "badge-success";
    if (normalizedStatus === "absent")
      return "badge-danger";
    return "badge-neutral";
  };

  const getAttendancePercentage = (student) => {
    if (student.totalSessions === 0) return 0;
    return Math.round((student.presentCount / student.totalSessions) * 100);
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const isTeacher = ["teacher", "tutor"].includes(
    (user?.role || "").toLowerCase(),
  );

  return (
    <div className="space-y-6 pb-8">
      <Link
        to="/tutorials/attendance"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Attendance Hub
      </Link>

      {!isTeacher ? (
        <Card className="border-[var(--danger)] bg-[var(--danger-bg)] text-[var(--danger)]">
          <CardContent className="pt-6">
            <p className="font-medium">
              Attendance Analytics is for teachers only.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              View detailed attendance reports for your sessions and students
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Subject Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    disabled={loadingSubjects}
                    className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a subject...</option>
                    {subjects.map((s) => (
                      <option key={s.subjectName} value={s.subjectName}>
                        {s.subjectName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Date To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Search Student */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Search Student
                  </label>
                  <input
                    type="text"
                    placeholder="Student name..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full px-3 py-2 rounded-[var(--radius-sm)] border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Summary */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Student Summary
            </h2>
            {filteredSummary.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {loadingData
                      ? "Loading attendance data..."
                      : "No students found for the selected filters"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Total Sessions
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Present
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Absent
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-foreground">
                          Attendance %
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSummary.map((student) => {
                        const attendancePercentage =
                          getAttendancePercentage(student);
                        return (
                          <tr
                            key={student.studentId}
                            className="border-b transition-colors hover:bg-muted/50"
                          >
                            <td className="px-4 py-3 text-foreground">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <User className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {student.studentName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {student.studentId}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-foreground">
                              {student.totalSessions}
                            </td>
                            <td className="px-4 py-3 text-green-600 dark:text-green-400">
                              {student.presentCount}
                            </td>
                            <td className="px-4 py-3 text-red-600 dark:text-red-400">
                              {student.absentCount}
                            </td>
                            <td className="px-4 py-3 text-foreground min-w-44">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-sm font-medium">
                                    {attendancePercentage}%
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                                  <div
                                    className={`h-full transition-all ${getProgressBarColor(
                                      attendancePercentage,
                                    )}`}
                                    style={{ width: `${attendancePercentage}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>

          {/* Session History */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Session History
            </h2>
            {groupedHistory.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {loadingData
                      ? "Loading session data..."
                      : "No session records found for the selected filters"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {groupedHistory.map((group) => (
                  <Card key={group.date} className="overflow-hidden">
                    <CardHeader className="border-b bg-muted/20">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            {formatDateLabel(group.date)}
                          </CardTitle>
                          <CardDescription>
                            {group.records.length} attendance record
                            {group.records.length === 1 ? "" : "s"}
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {group.date}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="px-4 py-3 text-left font-medium text-foreground">
                                Session Time
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-foreground">
                                Student Name
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-foreground">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.records.map((record) => (
                              <tr
                                key={record._id}
                                className="border-b transition-colors hover:bg-muted/50"
                              >
                                <td className="px-4 py-3 text-foreground">
                                  {record.sessionTime || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-foreground">
                                  {record.studentName || "Student"}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    className={`${getStatusColor(
                                      record.status,
                                    )} border-0 font-medium`}
                                  >
                                    {record.status}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
