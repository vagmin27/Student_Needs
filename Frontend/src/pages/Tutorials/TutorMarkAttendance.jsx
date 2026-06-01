import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarCheck, Check, X } from "lucide-react";
import API, {
  TUTOR_ATTENDANCE_PATHS,
} from "@/services/Attendance/tutorAttendanceApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const todayISO = () => new Date().toISOString().split("T")[0];

const normalizeDate = (value) => {
  if (!value) return value;
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [dd, mm, yyyy] = value.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
};

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

export default function TutorMarkAttendance() {
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState(todayISO());
  const [sessionTime, setSessionTime] = useState("");
  const [marks, setMarks] = useState({});

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

  const loadStudents = useCallback(async () => {
    if (!subject) {
      setStudents([]);
      return;
    }
    setLoadingStudents(true);
    try {
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorEnrolled, {
        params: { subject },
      });
      setStudents(res.data?.students || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }, [subject]);

  const loadExistingMarks = useCallback(async () => {
    if (!subject || !date) return;
    try {
      const params = { date: normalizeDate(date), subject };
      const trimmedSessionTime = sessionTime.trim();
      if (trimmedSessionTime) {
        params.sessionTime = trimmedSessionTime;
      }
      const res = await API.get(TUTOR_ATTENDANCE_PATHS.tutorSession, {
        params,
      });
      const next = {};
      for (const row of res.data || []) {
        next[String(row.studentId)] = row.status;
      }
      setMarks(next);
    } catch {
      setMarks({});
    }
  }, [date, subject, sessionTime]);

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    loadExistingMarks();
  }, [loadExistingMarks]);

  const filteredStudents = useMemo(() => students, [students]);

  const setStatus = (studentId, status) => {
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    if (!subject) {
      toast.error("Select a subject");
      return;
    }
    const records = filteredStudents
      .map((s) => {
        const rawStatus = marks[s.studentId];
        return {
          studentId: s.studentId,
          status: rawStatus || null,
        };
      })
      .filter((r) => r.status);

    if (records.length === 0) {
      toast.error("Mark at least one student as present or absent");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        date: normalizeDate(date),
        subject,
        records,
      };
      const trimmedSessionTime = sessionTime.trim();
      if (trimmedSessionTime) {
        payload.sessionTime = trimmedSessionTime;
      }

      await API.post(TUTOR_ATTENDANCE_PATHS.tutorSession, payload);
      toast.success("Online class attendance saved");
      await loadExistingMarks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const markedCount = filteredStudents.filter((s) => marks[s.studentId]).length;
  const loading = loadingSubjects || loadingStudents;

  return (
    <div className="space-y-6 pb-8">
      <Link
        to="/tutorials/attendance"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Attendance Hub
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Mark Online Class Attendance
        </h1>
        <p className="text-muted-foreground mt-1">
          Select a subject you teach, then mark students who booked that course.
        </p>
        {subjects.length === 0 && !loadingSubjects && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            <Link
              to="/tutorials/attendance/subjects"
              className="underline font-medium"
            >
              Add subjects
            </Link>{" "}
            before marking attendance.
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session details</CardTitle>
          <CardDescription>
            Subject list comes from your tutor subjects
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Course / Subject
            </label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={subjects.length === 0}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s.subjectName}>
                  {s.subjectName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Session time (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 10:00 AM"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sessionTime}
              onChange={(e) => setSessionTime(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Enrolled students</CardTitle>
            <CardDescription>
              {markedCount} of {filteredStudents.length} marked · students with
              bookings for this subject
            </CardDescription>
          </div>
          <Button
            onClick={submitAttendance}
            disabled={saving || loading || !subject || subjects.length === 0}
          >
            <CalendarCheck className="w-4 h-4 mr-2" />
            {saving ? "Saving…" : "Save attendance"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <span className="spinner spinner-lg" />
            </div>
          ) : !subject ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Select a subject to load enrolled students.
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No students have booked this subject yet. They will appear after
              booking a class with you for the same course name.
            </p>
          ) : (
            <div className="divide-y rounded-lg border">
              {filteredStudents.map((student) => {
                const status = marks[student.studentId];
                return (
                  <div
                    key={student.studentId}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {student.bookingCount} booking(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={status === "present" ? "default" : "outline"}
                        onClick={() => setStatus(student.studentId, "present")}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          status === "absent" ? "destructive" : "outline"
                        }
                        onClick={() => setStatus(student.studentId, "absent")}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
