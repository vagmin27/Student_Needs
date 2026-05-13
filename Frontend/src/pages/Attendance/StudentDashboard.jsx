import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Attendance/AuthContext";
import API from "../../services/Attendance/api";
import {
  MdCheckCircle, MdCancel, MdWarning, MdCalendarToday, MdPerson,
} from "react-icons/md";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAttendance(); }, []);

  const fetchAttendance = async () => {
    try {
      const { data } = await API.get("/attendance/student");
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = (() => {
    const total = attendanceData.length;
    const present = attendanceData.filter((a) => a.attendance === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    return { total, present, absent, percentage };
  })();

  const subjectStats = (() => {
    const map = {};
    attendanceData.forEach((r) => {
      if (!map[r.subject]) map[r.subject] = { total: 0, present: 0 };
      map[r.subject].total++;
      if (r.attendance === "present") map[r.subject].present++;
    });
    return Object.entries(map).map(([subject, s]) => ({
      subject,
      percentage: ((s.present / s.total) * 100).toFixed(1),
      present: s.present,
      total: s.total,
    }));
  })();

  const lowAttendance = subjectStats.filter((s) => parseFloat(s.percentage) < 75);

  const getBarColor = (pct) => {
    if (pct >= 75) return "green";
    if (pct >= 60) return "amber";
    return "red";
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "S";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 80 }}>
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="user-avatar" style={{ width: 48, height: 48, fontSize: 18, flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <h1>Welcome, {user?.name}</h1>
          <p>Here's your attendance summary</p>
        </div>
      </div>

      {/* Low Attendance Warning */}
      {lowAttendance.length > 0 && (
        <div className="warning-banner">
          <MdWarning size={20} />
          <span>
            Low attendance in: {lowAttendance.map((s) => s.subject).join(", ")}. Minimum required is 75%.
          </span>
        </div>
      )}

      {/* Overall Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Overall Attendance</div>
            <div
              className="stat-value"
              style={{
                color:
                  parseFloat(stats.percentage) >= 75
                    ? "var(--success)"
                    : "var(--danger)",
              }}
            >
              {stats.percentage}%
            </div>
            <div className="stat-sub">Across all subjects</div>
          </div>
          <div
            className="stat-icon"
            style={{
              background:
                parseFloat(stats.percentage) >= 75
                  ? "var(--success-light)"
                  : "var(--danger-light)",
              color:
                parseFloat(stats.percentage) >= 75
                  ? "var(--success)"
                  : "var(--danger)",
            }}
          >
            <MdPerson />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Classes Attended</div>
            <div className="stat-value" style={{ color: "var(--success)" }}>{stats.present}</div>
            <div className="stat-sub">Present sessions</div>
          </div>
          <div className="stat-icon green"><MdCheckCircle /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Classes Missed</div>
            <div className="stat-value" style={{ color: "var(--danger)" }}>{stats.absent}</div>
            <div className="stat-sub">Absent sessions</div>
          </div>
          <div className="stat-icon red"><MdCancel /></div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Classes</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-sub">All subjects combined</div>
          </div>
          <div className="stat-icon indigo"><MdCalendarToday /></div>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      {subjectStats.length > 0 && (
        <div className="card">
          <div className="card-title">Subject-wise Attendance</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {subjectStats.map((s, i) => {
              const pct = parseFloat(s.percentage);
              const color = getBarColor(pct);
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{s.subject}</span>
                    <span
                      className={`badge badge-${
                        pct >= 75 ? "green" : pct >= 60 ? "amber" : "red"
                      }`}
                    >
                      {s.percentage}%
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>
                    {s.present} / {s.total} classes attended
                  </div>
                  <div className="progress-bar-wrap">
                    <div
                      className={`progress-bar-fill ${color}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Records */}
      <div className="card">
        <div className="card-title">Recent Attendance Records</div>
        {attendanceData.length === 0 ? (
          <div className="empty-state">
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData
                  .slice(-10)
                  .reverse()
                  .map((record, i) => (
                    <tr key={i}>
                      <td>{record.date}</td>
                      <td>{record.subject}</td>
                      <td>
                        <span
                          className={`badge ${
                            record.attendance === "present"
                              ? "badge-green"
                              : "badge-red"
                          }`}
                        >
                          {record.attendance === "present" ? (
                            <MdCheckCircle size={12} />
                          ) : (
                            <MdCancel size={12} />
                          )}
                          {record.attendance || "Not Marked"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;