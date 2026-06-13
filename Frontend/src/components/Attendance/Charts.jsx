import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#38bdf8", "#a855f7"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--bg-surface-1)", border: "1px solid var(--border-subtle)",
        borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "var(--text-primary)",
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload?.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function Charts({ attendanceStats }) {
  if (!attendanceStats || attendanceStats.length === 0) return null;

  return (
    <div className="charts-grid">
      {/* Bar: Attendance % */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--text-secondary)" }}>
          Attendance % by Subject
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceStats} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" name="Attendance %" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar: Present Days */}
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--text-secondary)" }}>
          Present Days by Subject
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceStats} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="presentDays" name="Present Days" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie: Distribution */}
      <div style={{ gridColumn: "1 / -1" }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12, color: "var(--text-secondary)" }}>
          Semester Attendance Distribution
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendanceStats}
                dataKey="presentDays"
                nameKey="subject"
                outerRadius={110}
                innerRadius={50}
                paddingAngle={3}
                label={({ subject, percentage }) => `${subject} ${percentage}%`}
                labelLine={{ stroke: "var(--text-secondary)" }}
              >
                {attendanceStats?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Charts;