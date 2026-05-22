import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MdCheckCircle,
  MdSchool,
  MdAccountBalanceWallet,
  MdWorkOutline,
} from "react-icons/md";
import {
  Briefcase,
  ReceiptText,
  CheckSquare,
  Search,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { ATTENDANCE_PATHS } from "@/services/Attendance/api";
import { getBookings } from "@/services/api/tutorialsApi.js";
import { expensesApi } from "@/services/api/expensesApi";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { DashboardSection } from "@/components/dashboard/shared/DashboardSection";
import { DashboardCard } from "@/components/dashboard/shared/DashboardCard";
import { MetricCard } from "@/components/dashboard/shared/MetricCard";
import { CGPAProgressionChart } from "@/components/dashboard/student/CGPAProgressionChart";
import { ExpenseBreakdownChart } from "@/components/dashboard/student/ExpenseBreakdownChart";
import { UpcomingTasks } from "@/components/dashboard/student/UpcomingTasks";
import { RecommendedOpportunities } from "@/components/dashboard/student/RecommendedOpportunities";
import { Button } from "@/components/ui/button";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";

const QUICK_ACTIONS = [
  {
    label: "Find Tutor",
    description: "Open tutorials module",
    to: TUTORIAL_PATHS.unifiedEntry,
    icon: Search,
  },
  {
    label: "Attendance",
    description: "View class records",
    to: "/student/attendance",
    icon: CheckSquare,
  },
  {
    label: "Add Expense",
    description: "Track spending",
    to: "/expenses-tracker",
    icon: ReceiptText,
  },
  {
    label: "Referrals",
    description: "Browse opportunities",
    to: "/student/referrals",
    icon: Briefcase,
  },
];

const parseTime = (value) => {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const UnifiedDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const expenseUser = JSON.parse(localStorage.getItem("User") || "null");

        const [attendanceRes, expenseRes, bookingRes, opRes, profileRes] =
          await Promise.allSettled([
            API.get(ATTENDANCE_PATHS.student),
            expenseUser?._id
              ? expensesApi.getUserExpenses(expenseUser._id)
              : Promise.resolve([]),
            getBookings(),
            opportunitiesApi.getOpportunities(),
            studentProfileApi.getProfileStatus(),
          ]);

        if (cancelled) return;

        if (attendanceRes.status === "fulfilled") {
          setAttendanceData(attendanceRes.value?.data || []);
        }

        if (expenseRes.status === "fulfilled") {
          setExpenses(expenseRes.value || []);
        }

        if (bookingRes.status === "fulfilled") {
          setBookings(Array.isArray(bookingRes.value) ? bookingRes.value : []);
        }

        if (opRes.status === "fulfilled" && opRes.value?.success) {
          setOpportunities(opRes.value.data || []);
        }

        if (profileRes.status === "fulfilled" && profileRes.value?.success) {
          setProfileCompleteness(profileRes.value.data?.completeness ?? null);
        }
      } catch {
        if (!cancelled) {
          setAttendanceData([]);
          setExpenses([]);
          setBookings([]);
          setOpportunities([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const attendanceStats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter(
      (a) => (a.attendance || a.status) === "present",
    ).length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";
    return { total, present, percentage };
  }, [attendanceData]);

  const expenseSummary = useMemo(() => {
    const total = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const byCategory = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
    });
    const chartData = Object.entries(byCategory).map(([name, amount]) => ({
      name,
      amount,
    }));
    const recent = [...expenses]
      .sort((a, b) => parseTime(b.date) - parseTime(a.date))
      .slice(0, 5);
    return { total, chartData, recent };
  }, [expenses]);

  const upcomingClasses = useMemo(() => {
    const now = Date.now();
    return bookings
      .filter(
        (b) =>
          b.date &&
          parseTime(b.date) >= now &&
          b.status !== "Cancelled",
      )
      .sort((a, b) => parseTime(a.date) - parseTime(b.date))
      .slice(0, 4)
      .map((b) => ({
        id: b._id,
        title:
          b.subject ||
          b.tutorName ||
          [b.tutor_firstname, b.tutor_lastname].filter(Boolean).join(" ") ||
          "Tutorial Session",
        date: new Date(b.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: b.status || "Scheduled",
        priority: "medium",
      }));
  }, [bookings]);

  const recentActivity = useMemo(() => {
    const items = [];

    attendanceData.forEach((r, i) => {
      items.push({
        id: `att-${i}-${r._id || i}`,
        label: `${r.subject || r.subjectName || "Class"} — ${r.attendance || r.status || "recorded"}`,
        meta: r.date ? new Date(r.date).toLocaleDateString() : "Attendance",
        module: "Attendance",
        time: parseTime(r.date),
      });
    });

    expenseSummary.recent.forEach((e, i) => {
      items.push({
        id: `exp-${e._id || i}`,
        label: `₹${(e.amount || 0).toLocaleString()} · ${e.category || "Expense"}`,
        meta: e.date ? new Date(e.date).toLocaleDateString() : "Expense",
        module: "Expenses",
        time: parseTime(e.date),
      });
    });

    bookings.forEach((b, i) => {
      items.push({
        id: `book-${b._id || i}`,
        label: b.subject || b.tutorName || "Tutorial booking",
        meta: b.status || "Booking",
        module: "Tutorials",
        time: parseTime(b.date || b.createdAt),
      });
    });

    opportunities.slice(0, 3).forEach((o, i) => {
      items.push({
        id: `opp-${o._id || i}`,
        label: o.jobTitle || o.title || "New opportunity",
        meta: o.company || o.postedBy?.company || "Referrals",
        module: "Referrals",
        time: parseTime(o.createdAt || o.postedAt),
      });
    });

    return items
      .sort((a, b) => b.time - a.time)
      .slice(0, 8);
  }, [attendanceData, expenseSummary.recent, bookings, opportunities]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {user?.name || user?.firstName || "Student"}
            </h1>
            <p className="text-muted-foreground">
              Overview across attendance, expenses, tutorials, and referrals
            </p>
          </div>
        </div>
      </div>

      <DashboardSection title="Summary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Attendance"
            value={`${attendanceStats.percentage}%`}
            subtext={`${attendanceStats.present} attended · ${attendanceStats.total} total`}
            icon={MdCheckCircle}
            iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          />
          <MetricCard
            title="Expenses"
            value={`₹${expenseSummary.total.toLocaleString()}`}
            subtext={`${expenses.length} transaction${expenses.length === 1 ? "" : "s"}`}
            icon={MdAccountBalanceWallet}
            iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          />
          <MetricCard
            title="Profile"
            value={
              profileCompleteness != null ? `${profileCompleteness}%` : "—"
            }
            subtext="Referrals profile completeness"
            icon={MdSchool}
            iconClassName="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
          <MetricCard
            title="Opportunities"
            value={opportunities.length}
            subtext="Open referrals from your college"
            icon={MdWorkOutline}
            iconClassName="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
          />
        </div>
      </DashboardSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard
            title="Upcoming Classes"
            description="Tutorial sessions from your bookings"
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tutorials/profile/manageBooking">View all</Link>
              </Button>
            }
          >
            <UpcomingTasks tasks={upcomingClasses} />
          </DashboardCard>

          <DashboardCard title="Expenses by Category" description="From your expense tracker">
            <ExpenseBreakdownChart data={expenseSummary.chartData} />
          </DashboardCard>

          <DashboardSection
            title="Referrals & Internships"
            description="Recommended opportunities"
            action={
              <Button variant="outline" size="sm" asChild>
                <Link to="/student/referrals">Browse all</Link>
              </Button>
            }
          >
            <DashboardCard>
              <RecommendedOpportunities />
            </DashboardCard>
          </DashboardSection>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Quick Actions" description="Open a module">
            <div className="grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </div>
          </DashboardCard>

          <DashboardCard title="Recent Activity" description="Latest across all modules">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No recent activity yet. Use a module to see updates here.
              </p>
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-2 p-3 rounded-lg border border-border bg-secondary/20"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wide px-2 py-0.5 rounded shrink-0 bg-secondary text-muted-foreground">
                      {item.module}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
