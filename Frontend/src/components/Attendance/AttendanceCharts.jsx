import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = [
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
  "var(--info)",
  "var(--text-secondary)"
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-[var(--shadow-md)]">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
          {p.name?.includes("%") || p.dataKey === "percentage" ? "%" : ""}
        </p>
      ))}
    </div>
  );
};

export function AttendanceCharts({ bySubject = [], timeline = [], filterSubjectId = "" }) {
  const { theme } = useTheme();

  const barData = bySubject.map((s) => ({
    subject: s.subjectName || s.subject || "Unknown",
    percentage: s.percentage ?? 0,
    presentDays: s.presentDays ?? s.present ?? 0,
    total: s.totalClasses ?? s.total ?? 0,
  }));

  const pieData = barData.filter((d) => d.total > 0);

  const filteredTimeline = filterSubjectId
    ? timeline.filter((t) => String(t.subjectId) === String(filterSubjectId))
    : timeline;

  if (!barData.length && !filteredTimeline.length) {
    return (
      <p className="text-sm text-[var(--text-muted)] text-center py-8">
        Add subjects and mark attendance to see charts.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {barData.length > 0 && (
        <>
          <div className="space-y-2 min-w-0 overflow-hidden">
            <p className="text-sm font-medium text-[var(--text-muted)]">Attendance % by subject</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" name="Attendance %" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {pieData.length > 0 && (
            <div className="space-y-2 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-[var(--text-muted)]">Present classes by subject</p>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="presentDays"
                      nameKey="subject"
                      outerRadius={90}
                      innerRadius={45}
                      paddingAngle={2}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index, subject, percentage }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 1.35;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="var(--text-primary)"
                            textAnchor={x > cx ? 'start' : 'end'}
                            dominantBaseline="central"
                            fontSize={11}
                          >
                            {`${subject} ${percentage}%`}
                          </text>
                        );
                      }}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {filteredTimeline.length > 0 && (
        <div className="xl:col-span-2 space-y-2 min-w-0 overflow-hidden">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            Attendance over time{filterSubjectId ? " (selected subject)" : ""}
          </p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimeline} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--text-secondary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-secondary)" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="present" stroke="var(--success)" strokeWidth={2} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="var(--danger)" strokeWidth={2} name="Absent" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceCharts;
