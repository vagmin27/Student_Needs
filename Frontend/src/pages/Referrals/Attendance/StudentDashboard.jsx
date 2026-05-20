import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API from "../../services/Attendance/api";
import { MdCheckCircle, MdCancel, MdWarning, MdCalendarToday, MdPerson } from "react-icons/md";
import { DashboardSection } from "../../components/dashboard/shared/DashboardSection";
import { DashboardCard } from "../../components/dashboard/shared/DashboardCard";
import { MetricCard } from "../../components/dashboard/shared/MetricCard";
import { CGPAProgressionChart } from "../../components/dashboard/student/CGPAProgressionChart";
import { ExpenseBreakdownChart } from "../../components/dashboard/student/ExpenseBreakdownChart";
import { UpcomingTasks } from "../../components/dashboard/student/UpcomingTasks";
import { RecommendedOpportunities } from "../../components/dashboard/student/RecommendedOpportunities";
import { apiClient } from "@/services/apiClient";
import { useWebSocket } from "@/hooks/useWebSocket";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Required exact state from user prompt
  const [attendanceData, setAttendanceData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [cgpaData, setCgpaData] = useState([]); // Adding cgpaData for the progression chart
  const [loading, setLoading] = useState(true);
  
  const { on } = useWebSocket();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => { 
    fetchDashboardData();
  }, []);

  useEffect(() => {
    on("dashboard_refresh", () => {
      fetchDashboardData();
      setRefreshTrigger(prev => prev + 1);
    });
  }, [on]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch attendance
      try {
        const attRes = await API.get("/attendance/student");
        if (attRes.data) setAttendanceData(attRes.data);
      } catch (err) {
        console.error("Attendance fetch error:", err);
        setAttendanceData([]);
      }

      // Fetch unified analytics (including cgpa, expenses, upcoming, activity)
      try {
        const res = await apiClient.get("/api/analytics/student-dashboard");
        if (res.data?.success && res.data?.data) {
          const d = res.data.data;
          setExpenseData(d.expenseData || []);
          setUpcomingClasses(d.upcomingTasks || d.upcomingClasses || []);
          setRecentActivity(d.recentActivity || []);
          setCgpaData(d.cgpaData || []);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const stats = React.useMemo(() => {
    const total = attendanceData?.length || 0;
    const present = attendanceData?.filter((a) => a?.attendance === "present")?.length || 0;
    const absent = total - present;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    return { total, present, absent, percentage };
  }, [attendanceData]);

  const subjectStats = React.useMemo(() => {
    const map = {};
    attendanceData?.forEach((r) => {
      if (!r?.subject) return;
      if (!map[r.subject]) map[r.subject] = { total: 0, present: 0 };
      map[r.subject].total++;
      if (r.attendance === "present") map[r.subject].present++;
    });
    return Object.entries(map)?.map(([subject, s]) => ({
      subject,
      percentage: ((s.present / s.total) * 100).toFixed(1),
      present: s.present,
      total: s.total,
    })) || [];
  }, [attendanceData]);

  const lowAttendance = React.useMemo(() => 
    subjectStats?.filter((s) => parseFloat(s.percentage) < 75) || [], 
  [subjectStats]);

  const initials = user?.name
    ? user.name.split(" ")?.map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "S";

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome, {user?.name || "Student"}</h1>
            <p className="text-muted-foreground">Here's your academic and activity summary</p>
          </div>
        </div>
      </div>

      {/* Low Attendance Warning */}
      {lowAttendance?.length > 0 && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 flex items-center gap-3">
          <MdWarning size={20} className="shrink-0" />
          <span className="text-sm font-medium">
            Low attendance in: {lowAttendance?.map((s) => s.subject).join(", ")}. Minimum required is 75%.
          </span>
        </div>
      )}

      {/* Analytics Overview Grid */}
      <DashboardSection title="Overview" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Overall Attendance"
            value={`${stats.percentage}%`}
            subtext="Across all subjects"
            icon={MdPerson}
            iconClassName={parseFloat(stats.percentage) >= 75 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}
          />
          <MetricCard
            title="Classes Attended"
            value={stats.present}
            subtext="Present sessions"
            icon={MdCheckCircle}
            iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
          <MetricCard
            title="Classes Missed"
            value={stats.absent}
            subtext="Absent sessions"
            icon={MdCancel}
            iconClassName="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          />
          <MetricCard
            title="Total Classes"
            value={stats.total}
            subtext="All subjects combined"
            icon={MdCalendarToday}
          />
        </div>
      </DashboardSection>

      {/* Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {cgpaData?.length > 0 ? (
            <DashboardCard title="CGPA Progression" description="Your academic performance over time">
              <CGPAProgressionChart data={cgpaData} />
            </DashboardCard>
          ) : (
            <DashboardCard title="CGPA Progression" description="Your academic performance over time">
              <div className="flex h-48 items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-secondary/20">
                No grading data available.
              </div>
            </DashboardCard>
          )}

          {/* Subject-wise Attendance */}
          {subjectStats?.length > 0 && (
            <DashboardCard title="Subject-wise Attendance" description="Detailed breakdown by course">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {subjectStats?.map((s, i) => {
                  const pct = parseFloat(s.percentage);
                  return (
                    <div key={i} className="p-4 rounded-lg border border-border bg-slate-50 dark:bg-slate-900/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">{s.subject}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${pct >= 75 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : pct >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {s.percentage}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {s.present} / {s.total} classes attended
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
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

        <div className="space-y-6">
          <DashboardCard title="AI Recommended Opportunities" description="Based on your profile and skills" onClick={() => navigate('/student/referrals')}>
            <RecommendedOpportunities refreshTrigger={refreshTrigger} />
          </DashboardCard>

          <DashboardCard title="Upcoming Classes" description="Due assignments and scheduled classes" onClick={() => navigate('/tutorials')}>
            {upcomingClasses?.length > 0 ? (
              <UpcomingTasks tasks={upcomingClasses} />
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-secondary/20 text-sm">
                No upcoming classes.
              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Recent Activity" description="Your latest platform actions">
            {recentActivity?.length > 0 ? (
              <div className="space-y-4">
                {recentActivity?.map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.title || "Action recorded"}</p>
                      <p className="text-xs text-muted-foreground">{activity.time || "Recently"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-secondary/20 text-sm">
                No recent activity.
              </div>
            )}
          </DashboardCard>
          
          <DashboardCard title="Expenses" description="Monthly spending breakdown" onClick={() => navigate('/expenses-tracker')}>
            {expenseData?.length > 0 ? (
              <ExpenseBreakdownChart data={expenseData} />
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-secondary/20 text-sm">
                No expenses logged this month.
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;