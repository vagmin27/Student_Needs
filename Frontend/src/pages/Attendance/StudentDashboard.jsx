import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdCalendarToday,
  MdAdd,
  MdEdit,
  MdDelete,
  MdBook,
} from "react-icons/md";
import { Plus, Pencil, Trash2 } from "lucide-react";
import BackToStudentDashboard from "@/components/dashboard/BackToStudentDashboard";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { ATTENDANCE_PATHS } from "@/services/Attendance/api";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { MetricCard } from "@/components/dashboard/shared/MetricCard";
import AttendanceCharts from "@/components/Attendance/AttendanceCharts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const MIN_ATTENDANCE = 75;
const todayISO = () => new Date().toISOString().split("T")[0];

const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || "Something went wrong";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [records, setRecords] = useState([]);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [subjectModal, setSubjectModal] = useState({ open: false, mode: "add", id: null, name: "" });
  const [markModal, setMarkModal] = useState({
    open: false,
    subjectId: "",
    date: todayISO(),
    status: "present",
  });
  const [editRecordModal, setEditRecordModal] = useState({
    open: false,
    id: null,
    subjectId: "",
    date: "",
    status: "present",
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterSubject) params.subjectId = filterSubject;
      if (filterFrom) params.from = filterFrom;
      if (filterTo) params.to = filterTo;

      const statsParams = {};
      if (filterSubject) statsParams.subjectId = filterSubject;

      const [statsRes, subjectsRes, recordsRes] = await Promise.all([
        API.get(ATTENDANCE_PATHS.stats, { params: statsParams }),
        API.get(ATTENDANCE_PATHS.subjects),
        API.get(ATTENDANCE_PATHS.records, { params }),
      ]);
      setStats(statsRes.data);
      setSubjects(subjectsRes.data || []);
      setRecords(recordsRes.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setStats(null);
      setSubjects([]);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [filterSubject, filterFrom, filterTo]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const overall = stats?.overall || { total: 0, present: 0, absent: 0, percentage: 0 };
  const lowAttendance = stats?.lowAttendanceSubjects || [];
  const timeline = stats?.timeline || [];

  /** Per-subject stats: merge API stats with subject list so each subject has isolated counts */
  const subjectProgress = useMemo(() => {
    const statsById = new Map(
      (stats?.bySubject || []).map((s) => [String(s.subjectId), s]),
    );
    return subjects.map((sub) => {
      const sid = String(sub._id);
      const row = statsById.get(sid);
      return {
        subjectId: sid,
        subjectName: sub.subjectName,
        total: row?.total ?? 0,
        present: row?.present ?? 0,
        absent: row?.absent ?? 0,
        percentage: row?.percentage ?? 0,
        presentDays: row?.present ?? 0,
      };
    });
  }, [subjects, stats?.bySubject]);

  const initials = useMemo(() => {
    if (!user?.name) return "S";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const openAddSubject = () =>
    setSubjectModal({ open: true, mode: "add", id: null, name: "" });
  const openEditSubject = (s) =>
    setSubjectModal({ open: true, mode: "edit", id: s._id, name: s.subjectName });

  const saveSubject = async () => {
    const name = subjectModal.name.trim();
    if (!name) {
      toast.error("Subject name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (subjectModal.mode === "add") {
        await API.post(ATTENDANCE_PATHS.subjects, { subjectName: name });
        toast.success("Subject added");
      } else {
        await API.put(ATTENDANCE_PATHS.subject(subjectModal.id), { subjectName: name });
        toast.success("Subject updated");
      }
      setSubjectModal({ open: false, mode: "add", id: null, name: "" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject and all its attendance records?")) return;
    try {
      await API.delete(ATTENDANCE_PATHS.subject(id));
      toast.success("Subject deleted");
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const markAttendance = async () => {
    if (!markModal.subjectId) {
      toast.error("Select a subject");
      return;
    }
    setSubmitting(true);
    try {
      await API.post(ATTENDANCE_PATHS.records, {
        subjectId: markModal.subjectId,
        date: markModal.date,
        status: markModal.status,
      });
      toast.success("Attendance marked");
      setMarkModal({ open: false, subjectId: "", date: todayISO(), status: "present" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openEditRecord = (r) =>
    setEditRecordModal({
      open: true,
      id: r._id || r.id,
      subjectId: r.subjectId?._id || r.subjectId || "",
      date: r.date,
      status: r.status || r.attendance || "present",
    });

  const saveRecord = async () => {
    setSubmitting(true);
    try {
      await API.put(ATTENDANCE_PATHS.record(editRecordModal.id), {
        subjectId: editRecordModal.subjectId,
        date: editRecordModal.date,
        status: editRecordModal.status,
      });
      toast.success("Record updated");
      setEditRecordModal({ open: false, id: null, subjectId: "", date: "", status: "present" });
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRecord = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;
    try {
      await API.delete(ATTENDANCE_PATHS.record(id));
      toast.success("Record deleted");
      await loadData();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center pt-20">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <BackToStudentDashboard />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Attendance</h1>
            <p className="text-muted-foreground">
              Track subjects, mark classes, and monitor your progress
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={openAddSubject}>
            <Plus className="h-4 w-4 mr-1" /> Add subject
          </Button>
          <Button
            size="sm"
            onClick={() =>
              setMarkModal({ open: true, subjectId: "", date: todayISO(), status: "present" })
            }
            disabled={subjects.length === 0}
          >
            <MdAdd className="mr-1" /> Mark attendance
          </Button>
        </div>
      </div>

      {lowAttendance.length > 0 && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center gap-3">
          <MdWarning size={20} className="shrink-0" />
          <span className="text-sm font-medium">
            Low attendance (&lt; {MIN_ATTENDANCE}%):{" "}
            {lowAttendance.map((s) => `${s.subjectName} (${s.percentage}%)`).join(", ")}
          </span>
        </div>
      )}

      <DashboardSection title="Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Overall Attendance"
            value={`${overall.percentage}%`}
            subtext="Across all subjects"
            icon={MdBook}
            iconClassName={
              overall.percentage >= MIN_ATTENDANCE
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }
          />
          <MetricCard
            title="Classes Attended"
            value={overall.present}
            subtext="Present"
            icon={MdCheckCircle}
            iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
          <MetricCard
            title="Classes Missed"
            value={overall.absent}
            subtext="Absent"
            icon={MdCancel}
            iconClassName="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          />
          <MetricCard
            title="Total Classes"
            value={overall.total}
            subtext="All subjects"
            icon={MdCalendarToday}
          />
        </div>
      </DashboardSection>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <DashboardCard title="Analytics" description="Charts from your attendance data">
            <AttendanceCharts
              bySubject={subjectProgress}
              timeline={timeline}
              filterSubjectId={filterSubject}
            />
          </DashboardCard>

          {subjectProgress.length > 0 && (
            <DashboardCard title="Subject-wise progress" description="Per-subject breakdown">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {subjectProgress.map((s) => {
                  const pct = s.percentage;
                  return (
                    <div
                      key={s.subjectId}
                      className="p-4 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">{s.subjectName}</span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            pct >= MIN_ATTENDANCE
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : pct >= 60
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {s.present} present · {s.absent} absent · {s.total} total
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            pct >= MIN_ATTENDANCE
                              ? "bg-emerald-500"
                              : pct >= 60
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </DashboardCard>
          )}
        </div>

        <DashboardCard title="My subjects" description="Add, edit, or remove subjects">
          {subjects.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              No subjects yet. Add your first subject to start tracking.
            </p>
          ) : (
            <ul className="space-y-2">
              {subjects.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg border border-border"
                >
                  <span className="font-medium text-sm">{s.subjectName}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditSubject(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteSubject(s._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Attendance history" description="Filter, edit, or delete records">
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectName}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filterFrom}
            onChange={(e) => setFilterFrom(e.target.value)}
            placeholder="From"
          />
          <input
            type="date"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={filterTo}
            onChange={(e) => setFilterTo(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={loadData}>
            Apply filters
          </Button>
        </div>

        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Subject</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id || r.id} className="border-b border-border/60">
                    <td className="py-3 pr-4">{r.date}</td>
                    <td className="py-3 pr-4">{r.subjectName || r.subject}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          (r.status || r.attendance) === "present"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {(r.status || r.attendance) === "present" ? (
                          <MdCheckCircle />
                        ) : (
                          <MdCancel />
                        )}
                        {r.status || r.attendance}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditRecord(r)}>
                        <MdEdit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => deleteRecord(r._id || r.id)}
                      >
                        <MdDelete />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>

      <Dialog
        open={subjectModal.open}
        onOpenChange={(open) => !open && setSubjectModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {subjectModal.mode === "add" ? "Add subject" : "Edit subject"}
            </DialogTitle>
          </DialogHeader>
          <input
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            placeholder="Subject name"
            value={subjectModal.name}
            onChange={(e) => setSubjectModal((m) => ({ ...m, name: e.target.value }))}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubjectModal((m) => ({ ...m, open: false }))}>
              Cancel
            </Button>
            <Button onClick={saveSubject} disabled={submitting}>
              {submitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={markModal.open}
        onOpenChange={(open) => !open && setMarkModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={markModal.subjectId}
                onChange={(e) => setMarkModal((m) => ({ ...m, subjectId: e.target.value }))}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <input
                type="date"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={markModal.date}
                onChange={(e) => setMarkModal((m) => ({ ...m, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={markModal.status === "present" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setMarkModal((m) => ({ ...m, status: "present" }))}
                >
                  Present
                </Button>
                <Button
                  type="button"
                  variant={markModal.status === "absent" ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setMarkModal((m) => ({ ...m, status: "absent" }))}
                >
                  Absent
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMarkModal((m) => ({ ...m, open: false }))}>
              Cancel
            </Button>
            <Button onClick={markAttendance} disabled={submitting}>
              {submitting ? "Saving…" : "Mark"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={editRecordModal.open}
        onOpenChange={(open) => !open && setEditRecordModal((m) => ({ ...m, open: false }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit attendance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={editRecordModal.subjectId}
                onChange={(e) =>
                  setEditRecordModal((m) => ({ ...m, subjectId: e.target.value }))
                }
              >
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <input
                type="date"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={editRecordModal.date}
                onChange={(e) => setEditRecordModal((m) => ({ ...m, date: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={editRecordModal.status === "present" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setEditRecordModal((m) => ({ ...m, status: "present" }))}
              >
                Present
              </Button>
              <Button
                type="button"
                variant={editRecordModal.status === "absent" ? "destructive" : "outline"}
                className="flex-1"
                onClick={() => setEditRecordModal((m) => ({ ...m, status: "absent" }))}
              >
                Absent
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditRecordModal((m) => ({ ...m, open: false }))}
            >
              Cancel
            </Button>
            <Button onClick={saveRecord} disabled={submitting}>
              {submitting ? "Saving…" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
