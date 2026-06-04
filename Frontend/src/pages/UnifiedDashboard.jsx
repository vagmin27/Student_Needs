import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdSchool,
  MdAccountBalanceWallet,
  MdWorkOutline,
  MdAdd,
  MdChevronLeft,
  MdChevronRight
} from "react-icons/md";
import {
  Briefcase,
  ReceiptText,
  CheckSquare,
  Search,
  ArrowRight,
  Calendar as CalendarIcon,
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
import Modal from "@/components/Expenses/ui/Modal";
import { toast } from "react-hot-toast";

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
  const { user, isInitialized } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [profileCompleteness, setProfileCompleteness] = useState(null);
  
  // Expense integration states
  const [bills, setBills] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [isQuickAddExpenseOpen, setIsQuickAddExpenseOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  
  // Quick Add Form
  const [quickExpenseForm, setQuickExpenseForm] = useState({
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    title: "",
    type: "expense",
    paymentMethod: "UPI",
    note: ""
  });

  const load = async () => {
    setLoading(true);
    try {
      const expenseUser = JSON.parse(localStorage.getItem("User") || "null");

      const [attendanceRes, expenseRes, bookingRes, opRes, profileRes, billsRes, summaryRes] =
        await Promise.allSettled([
          API.get(ATTENDANCE_PATHS.student),
          expenseUser?._id
            ? expensesApi.getUserExpenses(expenseUser._id)
            : Promise.resolve([]),
          getBookings(),
          opportunitiesApi.getOpportunities(),
          studentProfileApi.getProfileStatus(),
          expenseUser?._id ? expensesApi.getBills() : Promise.resolve([]),
          expenseUser?._id ? expensesApi.getDashboardSummary() : Promise.resolve(null),
        ]);

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

      if (billsRes.status === "fulfilled") {
        setBills(billsRes.value || []);
      }

      if (summaryRes.status === "fulfilled") {
        setExpenseSummary(summaryRes.value || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      load();
    }
  }, [isInitialized, user]);

  const attendanceStats = useMemo(() => {
    const total = attendanceData.length;
    const present = attendanceData.filter(
      (a) => (a.attendance || a.status) === "present",
    ).length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0";
    return { total, present, percentage };
  }, [attendanceData]);

  const expenseChartData = useMemo(() => {
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

    expenseChartData.recent.forEach((e, i) => {
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
  }, [attendanceData, expenseChartData.recent, bookings, opportunities]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "S";

  const handleQuickAddExpenseSubmit = async (e) => {
    e.preventDefault();
    const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
    if (!expenseUser) {
      toast.error("Please login to your expense tracker first");
      return;
    }
    const res = await expensesApi.createExpense({
      ...quickExpenseForm,
      userId: expenseUser._id,
      amount: Number(quickExpenseForm.amount)
    });
    if (res) {
      toast.success("Expense tracked successfully!");
      setIsQuickAddExpenseOpen(false);
      setQuickExpenseForm({
        amount: "",
        category: "Food",
        date: new Date().toISOString().split("T")[0],
        title: "",
        type: "expense",
        paymentMethod: "UPI",
        note: ""
      });
      load();
    }
  };

  // Mini Calendar grid builder
  const calendarCells = useMemo(() => {
    const year = selectedCalendarDate.getFullYear();
    const month = selectedCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= numDays; d++) {
      cells.push(new Date(year, month, d));
    }
    return cells;
  }, [selectedCalendarDate]);

  const handlePrevMonth = () => {
    setSelectedCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setSelectedCalendarDate(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const getBillsForDate = (date) => {
    if (!date) return [];
    return bills.filter(bill => {
      const bDate = new Date(bill.dueDate);
      return bDate.getDate() === date.getDate() &&
             bDate.getMonth() === date.getMonth() &&
             bDate.getFullYear() === date.getFullYear();
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <span className="spinner spinner-lg" />
      </div>
    );
  }

  const currencySymbol = expenseSummary?.currency === "USD" ? "$" : expenseSummary?.currency === "EUR" ? "€" : expenseSummary?.currency === "GBP" ? "£" : "₹";

  return (
    <div className="space-y-6 relative pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="dashboard-title text-foreground tracking-tight">
              Welcome, {user?.name || user?.firstName || "Student"}
            </h1>
            <p className="text-muted-foreground description-text">
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
            value={`${currencySymbol}${expenseSummary?.totalSpent?.toLocaleString() || "0"}`}
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

      {/* 💰 Expense Tracker Summary Widget */}
      <DashboardSection title="Expense Tracker Overview">
        <Link to="/expenses-tracker" className="block hover:scale-[1.005] active:scale-[0.998] transition-transform duration-200 cursor-pointer">
          <div className="p-5 bg-card border border-border rounded-2xl shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <div className="p-3 bg-secondary/35 rounded-xl border border-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Budget</span>
              <span className="block text-lg font-bold text-foreground mt-1">
                {currencySymbol}{expenseSummary?.monthlyBudget?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="p-3 bg-secondary/35 rounded-xl border border-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Spent</span>
              <span className="block text-lg font-bold text-rose-500 mt-1">
                {currencySymbol}{expenseSummary?.totalSpent?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="p-3 bg-secondary/35 rounded-xl border border-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Remaining</span>
              <span className={`block text-lg font-bold mt-1 ${
                (expenseSummary?.remainingBudget || 0) < 0 ? "text-rose-600" : "text-emerald-500"
              }`}>
                {currencySymbol}{expenseSummary?.remainingBudget?.toLocaleString() || "0"}
              </span>
            </div>
            <div className="p-3 bg-secondary/35 rounded-xl border border-border/50 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Upcoming Bills</span>
              <span className="block text-lg font-bold text-blue-500 mt-1">{expenseSummary?.upcomingCount || 0}</span>
            </div>
            <div className="p-3 bg-secondary/35 rounded-xl border border-border/50 text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Overdue Bills</span>
              <span className={`block text-lg font-extrabold mt-1 ${
                (expenseSummary?.overdueCount || 0) > 0 ? "text-rose-600 animate-pulse" : "text-muted-foreground/60"
              }`}>{expenseSummary?.overdueCount || 0}</span>
            </div>
          </div>
        </Link>
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

          {/* Interactive billing due calendar */}
          <DashboardCard 
            title="📅 Upcoming Due Calendar"
            description="Monthly billing schedule and productivity due dates"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-secondary/25 p-2 rounded-xl border border-border/60">
                <button onClick={handlePrevMonth} className="p-1 rounded hover:bg-secondary cursor-pointer">
                  <MdChevronLeft size={20} />
                </button>
                <span className="text-sm font-bold text-foreground">
                  {selectedCalendarDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                </span>
                <button onClick={handleNextMonth} className="p-1 rounded hover:bg-secondary cursor-pointer">
                  <MdChevronRight size={20} />
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                  <span key={d} className="font-bold text-muted-foreground py-1">{d}</span>
                ))}
                {calendarCells.map((date, idx) => {
                  if (!date) return <span key={`pad-${idx}`} className="py-2" />;
                  
                  const dueBills = getBillsForDate(date);
                  const hasBills = dueBills.length > 0;
                  const isCurrentDay = new Date().getDate() === date.getDate() && 
                                       new Date().getMonth() === date.getMonth() && 
                                       new Date().getFullYear() === date.getFullYear();
                                       
                  // Get critical level color
                  let borderClass = "border-transparent";
                  let dotClass = "";
                  if (hasBills) {
                    const priorities = dueBills.map(b => b.priority);
                    if (priorities.includes("Critical")) {
                      borderClass = "border-rose-500/50 bg-rose-500/5";
                      dotClass = "bg-rose-500";
                    } else if (priorities.includes("High")) {
                      borderClass = "border-amber-500/50 bg-amber-500/5";
                      dotClass = "bg-amber-500";
                    } else {
                      borderClass = "border-blue-500/50 bg-blue-500/5";
                      dotClass = "bg-blue-500";
                    }
                  }

                  return (
                    <div 
                      key={`day-${idx}`} 
                      className={`py-1.5 rounded-lg border flex flex-col items-center justify-between min-h-[44px] transition-all relative ${borderClass} ${
                        isCurrentDay ? "bg-primary/10 border-primary font-extrabold" : ""
                      }`}
                    >
                      <span className="text-foreground text-xs">{date.getDate()}</span>
                      {hasBills && (
                        <span className={`w-1.5 h-1.5 rounded-full ${dotClass} animate-pulse`} title={`${dueBills.length} bill(s) due`} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* List of bills for selected month */}
              <div className="border-t border-border/40 pt-3">
                <span className="text-xs font-bold text-foreground">Upcoming Payments in {selectedCalendarDate.toLocaleString("en-US", { month: "long" })}:</span>
                <div className="space-y-1.5 mt-2">
                  {bills.filter(b => {
                    const bDate = new Date(b.dueDate);
                    return bDate.getMonth() === selectedCalendarDate.getMonth() && 
                           bDate.getFullYear() === selectedCalendarDate.getFullYear();
                  }).length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No payments due this month.</p>
                  ) : (
                    bills.filter(b => {
                      const bDate = new Date(b.dueDate);
                      return bDate.getMonth() === selectedCalendarDate.getMonth() && 
                             bDate.getFullYear() === selectedCalendarDate.getFullYear();
                    }).map(b => (
                      <div key={b._id} className="flex justify-between items-center text-xs p-2 rounded bg-secondary/20 border border-border/50">
                        <span className="font-semibold text-foreground">{b.billName}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-muted-foreground">Due: {new Date(b.dueDate).getDate()}</span>
                          <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                            b.priority === "Critical" ? "bg-rose-500 text-white" : b.priority === "High" ? "bg-amber-500 text-white" : "bg-secondary text-muted-foreground"
                          }`}>{b.priority}</span>
                          <span className="font-extrabold">{currencySymbol}{b.amount}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Expenses by Category" description="From your expense tracker">
            <ExpenseBreakdownChart data={expenseChartData.chartData} />
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

      {/* Global floating action button on bottom right of student dashboard */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsQuickAddExpenseOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-brand-primary/30 hover:shadow-brand-primary/50 transition-all hover:scale-110 active:scale-95 duration-200 cursor-pointer"
          title="Quick Add Expense"
        >
          <MdAdd size={28} />
        </button>
      </div>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={isQuickAddExpenseOpen}
        onClose={() => setIsQuickAddExpenseOpen(false)}
        title="Quick Add Expense"
      >
        <form onSubmit={handleQuickAddExpenseSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Description / Title</label>
            <input
              type="text"
              value={quickExpenseForm.title}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, title: e.target.value })}
              className="premium-input text-foreground h-10 w-full"
              placeholder="e.g. Books, Bus ticket"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
            <input
              type="number"
              value={quickExpenseForm.amount}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, amount: e.target.value })}
              className="premium-input text-foreground h-10 w-full"
              placeholder="0.00"
              min="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={quickExpenseForm.category}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, category: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer"
              >
                {[
                  "Tuition Fees",
                  "Hostel Fees",
                  "Mess Fees",
                  "Books",
                  "Transportation",
                  "Internet",
                  "Mobile Recharge",
                  "Subscriptions",
                  "Food",
                  "Shopping",
                  "Healthcare",
                  "Other"
                ].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
              <select
                value={quickExpenseForm.paymentMethod}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, paymentMethod: e.target.value })}
                className="premium-input text-foreground h-10 w-full cursor-pointer"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <input
              type="date"
              value={quickExpenseForm.date}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, date: e.target.value })}
              className="premium-input text-foreground h-10 w-full cursor-pointer"
              required
            />
          </div>

          <div className="flex gap-4 justify-end pt-4 border-t border-border/20">
            <button
              type="button"
              onClick={() => setIsQuickAddExpenseOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-colors font-bold cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UnifiedDashboard;
