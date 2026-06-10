import { useEffect, useState } from "react";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import Charts from "../../components/Attendance/Charts";
import {
  MdPeople, MdCheckCircle, MdCancel, MdCalendarToday, MdTrendingUp, MdBarChart,
} from "react-icons/md";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [latestSubject, setLatestSubject] = useState("");
  const [latestDate, setLatestDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, attendanceRes] = await Promise.all([
          API.get("/students/read"),
          API.get(ATTENDANCE_PATHS.root),
        ]);
        if (cancelled) return;

        const studentsData = studentsRes.data;
        const attendanceData = attendanceRes.data || [];
        setStudents(studentsData);
        setAttendance(attendanceData);
        calculateSubjectStats(attendanceData);
        calculateLatestAttendance(attendanceData);
        calculateSelectedDateAttendance(attendanceData, studentsData, selectedDate);
      } catch {
        if (!cancelled) {
          setStudents([]);
          setAttendance([]);
          setAttendanceStats([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    calculateSelectedDateAttendance(attendance, students, selectedDate);
  }, [selectedDate, attendance, students]);

  const calculateSubjectStats = (data) => {
    const map = {};
    data.forEach((item) => {
      const s = item.subject;
      if (!s) return;
      if (!map[s]) map[s] = { total: 0, present: 0 };
      item.attendanceRecords.forEach((r) => {
        map[s].total++;
        if (r.attendance === "present") map[s].present++;
      });
    });
    setAttendanceStats(
      Object.keys(map)?.map((s) => ({
        subject: s,
        percentage: Number(((map[s].present / map[s].total) * 100).toFixed(1)),
        presentDays: map[s].present,
        totalClasses: map[s].total,
      }))
    );
  };

  const calculateLatestAttendance = (data) => {
    if (!data.length) return;
    const latest = [...data].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
    setLatestSubject(latest.subject);
    setLatestDate(latest.date);
  };

  const calculateSelectedDateAttendance = (data, studentsData, date) => {
    const selected = data?.filter((item) => item.date === date);
    if (!selected.length) { setPresentStudents([]); setAbsentStudents([]); return; }
    const presentSet = new Set();
    const absentSet = new Set();
    selected.forEach((att) => {
      att.attendanceRecords.forEach((r) => {
        const student = studentsData.find((s) => s._id === r.studentId?.toString());
        if (!student) return;
        if (r.attendance === "present") { presentSet.add(student.Name); absentSet.delete(student.Name); }
        if (r.attendance === "absent")  { absentSet.add(student.Name);  presentSet.delete(student.Name); }
      });
    });
    setPresentStudents([...presentSet]);
    setAbsentStudents([...absentSet]);
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  const totalToday = presentStudents.length + absentStudents.length;
  const presentPct = totalToday > 0 ? ((presentStudents.length / totalToday) * 100).toFixed(0) : 0;

  return (
    <div className="attendance-module">
      <div className="page-header">
        <h1>Teacher Dashboard</h1>
        <p>Overview of attendance and student performance</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{students.length}</div>
            <div className="stat-sub">Registered in system</div>
          </div>
          <div className="stat-icon indigo"><MdPeople /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Present Today</div>
            <div className="stat-value text-[var(--success)]">{presentStudents.length}</div>
            <div className="stat-sub">{presentPct}% attendance rate</div>
          </div>
          <div className="stat-icon green"><MdCheckCircle /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Absent Today</div>
            <div className="stat-value text-[var(--danger)]">{absentStudents.length}</div>
            <div className="stat-sub">For selected date</div>
          </div>
          <div className="stat-icon red"><MdCancel /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Latest Session</div>
            <div className="stat-value text-base pt-1.5">
              {latestSubject || "—"}
            </div>
            <div className="stat-sub">{latestDate || "No sessions yet"}</div>
          </div>
          <div className="stat-icon amber"><MdTrendingUp /></div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card">
        <div className="card-title"><MdCalendarToday /> View Attendance By Date</div>
        <input
          type="date"
          className="form-input max-w-[220px]"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Present / Absent Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        <div className="card border-l-4 border-l-[var(--success)] mb-0">
          <div className="card-title text-[var(--success)]">
            <MdCheckCircle /> Present ({presentStudents.length})
          </div>
          {presentStudents.length > 0 ? (
            presentStudents?.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-border text-sm text-muted-foreground">
                {s}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No records for this date</p>
          )}
        </div>
        <div className="card border-l-4 border-l-[var(--danger)] mb-0">
          <div className="card-title text-[var(--danger)]">
            <MdCancel /> Absent ({absentStudents.length})
          </div>
          {absentStudents.length > 0 ? (
            absentStudents?.map((s, i) => (
              <div key={i} className="py-1.5 border-b border-border text-sm text-muted-foreground">
                {s}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No records for this date</p>
          )}
        </div>
      </div>

      {/* Charts */}
      {attendanceStats.length > 0 ? (
        <div className="card">
          <div className="card-title">Semester Analytics</div>
          <Charts attendanceStats={attendanceStats} />
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <MdBarChart className="w-12 h-12 block mx-auto mb-3 opacity-30" />
            <p>No attendance data to display yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
