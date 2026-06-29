import { useEffect, useState } from "react";
import API, { ATTENDANCE_PATHS } from "../../services/Attendance/api";
import AttendanceCharts from "../../components/Attendance/AttendanceCharts";
import {
  MdPeople, MdCheckCircle, MdCancel, MdCalendarToday, MdTrendingUp, MdBarChart,
} from "react-icons/md";
import {
  PageLayout,
  SectionContainer,
  DashboardGrid,
  PremiumCard,
  DashboardHeader,
  StatCard,
  AnalyticsCard,
} from "../../components/dashboard/shared/Primitives";

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
    if (!selected.length) {
      setPresentStudents([]);
      setAbsentStudents([]);
      return;
    }
    const presentSet = new Set();
    const absentSet = new Set();
    selected.forEach((att) => {
      att.attendanceRecords.forEach((r) => {
        const student = studentsData.find((s) => s._id === r.studentId?.toString());
        if (!student) return;
        if (r.attendance === "present") {
          presentSet.add(student.Name);
          absentSet.delete(student.Name);
        }
        if (r.attendance === "absent") {
          absentSet.add(student.Name);
          presentSet.delete(student.Name);
        }
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
    <PageLayout>
      <DashboardHeader
        title="Teacher Dashboard"
        description="Overview of attendance and student performance"
      />

      {/* Stat Cards */}
      <SectionContainer>
        <DashboardGrid cols={4}>
          <StatCard
            title="Total Students"
            value={students.length}
            subtext="Registered in system"
            icon={MdPeople}
          />

          <StatCard
            title="Present Today"
            value={presentStudents.length}
            subtext={`${presentPct}% attendance rate`}
            icon={MdCheckCircle}
          />

          <StatCard
            title="Absent Today"
            value={absentStudents.length}
            subtext="For selected date"
            icon={MdCancel}
          />

          <StatCard
            title="Latest Session"
            value={latestSubject || "—"}
            subtext={latestDate || "No sessions yet"}
            icon={MdTrendingUp}
          />
        </DashboardGrid>
      </SectionContainer>

      {/* Date Filter */}
      <SectionContainer>
        <PremiumCard hoverEffect={false}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <MdCalendarToday className="text-[var(--accent)]" /> View Attendance By Date
            </h3>
            <input
              type="date"
              className="form-input max-w-[220px]"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </PremiumCard>
      </SectionContainer>

      {/* Present / Absent Lists */}
      <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <PremiumCard hoverEffect={false} className="border-l-4 border-l-[var(--success)]">
            <h3 className="text-base font-semibold text-[var(--success)] flex items-center gap-2 mb-4">
              <MdCheckCircle /> Present ({presentStudents.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {presentStudents.length > 0 ? (
                presentStudents.map((s, i) => (
                  <div key={i} className="py-2 border-b border-border/40 text-sm text-muted-foreground">
                    {s}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No records for this date</p>
              )}
            </div>
          </PremiumCard>

          <PremiumCard hoverEffect={false} className="border-l-4 border-l-[var(--danger)]">
            <h3 className="text-base font-semibold text-[var(--danger)] flex items-center gap-2 mb-4">
              <MdCancel /> Absent ({absentStudents.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {absentStudents.length > 0 ? (
                absentStudents.map((s, i) => (
                  <div key={i} className="py-2 border-b border-border/40 text-sm text-muted-foreground">
                    {s}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No records for this date</p>
              )}
            </div>
          </PremiumCard>
        </div>
      </SectionContainer>

      {/* Charts */}
      <SectionContainer>
        {attendanceStats.length > 0 ? (
          <AnalyticsCard title="Semester Analytics" description="Charts from teacher attendance records">
            <AttendanceCharts bySubject={attendanceStats} />
          </AnalyticsCard>
        ) : (
          <PremiumCard hoverEffect={false}>
            <div className="py-12 text-center text-muted-foreground">
              <MdBarChart className="w-12 h-12 block mx-auto mb-3 opacity-30" />
              <p>No attendance data to display yet</p>
            </div>
          </PremiumCard>
        )}
      </SectionContainer>
    </PageLayout>
  );
}

export default Dashboard;
