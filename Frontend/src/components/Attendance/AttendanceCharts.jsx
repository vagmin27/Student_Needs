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

const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#38bdf8", "#a855f7"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2 text-sm shadow-md">
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
  const { isDark } = useTheme();
  const currentColors = isDark
    ? COLORS
    : ["#6c4cf1", "#9b7cf6", "#c4b5fd", "#ede9fe", "#4c2fc4"];

  const barData = bySubject.map((s) => ({
    subject: s.subjectName || s.subject,
    percentage: s.percentage ?? 0,
    presentDays: s.present ?? 0,
    total: s.total ?? 0,
  }));

  const pieData = barData.filter((d) => d.total > 0);

  const filteredTimeline = filterSubjectId
    ? timeline.filter((t) => String(t.subjectId) === String(filterSubjectId))
    : timeline;

  if (!barData.length && !filteredTimeline.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Add subjects and mark attendance to see charts.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {barData.length > 0 && (
        <>
          <div className="space-y-2 min-w-0 overflow-hidden">
            <p className="text-sm font-medium text-muted-foreground">Attendance % by subject</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="percentage" name="Attendance %" fill={isDark ? "#6366f1" : "#6c4cf1"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {pieData.length > 0 && (
            <div className="space-y-2 min-w-0 overflow-hidden">
              <p className="text-sm font-medium text-muted-foreground">Present classes by subject</p>
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
                      label={({ subject, percentage }) => `${subject} ${percentage}%`}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={currentColors[i % currentColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
      {filteredTimeline.length > 0 && (
        <div className="xl:col-span-2 space-y-2 min-w-0 overflow-hidden">
          <p className="text-sm font-medium text-muted-foreground">
            Attendance over time{filterSubjectId ? " (selected subject)" : ""}
          </p>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTimeline} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="present" stroke="#22c55e" strokeWidth={2} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} name="Absent" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttendanceCharts;
