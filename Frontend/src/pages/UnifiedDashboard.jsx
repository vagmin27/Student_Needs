import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  ReceiptText,
  CheckSquare,
  Search,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle,
  GraduationCap,
  Wallet,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import API, { ATTENDANCE_PATHS } from "@/services/Attendance/api";
import { getBookings } from "@/services/api/tutorialsApi.js";
import { expensesApi } from "@/services/api/expensesApi";
import { getUserId } from "@/utils/Expenses/authHelper.js";
import { opportunitiesApi } from "@/services/Referrals/opportunities.js";
import { studentProfileApi } from "@/services/Referrals/studentProfile.js";
import { TUTORIAL_PATHS } from "@/utils/tutorialRoutes";
import Modal from "@/components/Expenses/ui/Modal";
import { toast } from "react-hot-toast";

// Import Custom Design System Primitives
import {
  PremiumCard,
  GlassPanel,
  SectionHeader,
  PremiumButton,
  PremiumInput,
  AnimatedCounter,
  EmptyState,
  PageLayout,
  DashboardGrid,
} from "@/components/dashboard/shared/Primitives";
import { DashboardWideSkeleton } from "@/components/dashboard/shared/Skeleton";

// Import charts/sub-widgets
import { CGPAProgressionChart } from "@/components/dashboard/student/CGPAProgressionChart";
import { ExpenseBreakdownChart } from "@/components/dashboard/student/ExpenseBreakdownChart";
import { UpcomingTasks } from "@/components/dashboard/student/UpcomingTasks";
import { RecommendedOpportunities } from "@/components/dashboard/student/RecommendedOpportunities";

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
    to: "/referrals/browse-referrals",
    icon: Briefcase,
  },
];

const parseTime = (value) => {
  if (!value) return 0;
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
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
    note: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
      const expenseUserId = getUserId(expenseUser);

      const [attendanceRes, expenseRes, bookingRes, opRes, profileRes, billsRes, summaryRes] =
        await Promise.allSettled([
          API.get(ATTENDANCE_PATHS.student),
          expenseUserId
            ? expensesApi.getUserExpenses(expenseUserId)
            : Promise.resolve([]),
          getBookings(),
          opportunitiesApi.getOpportunities(),
          studentProfileApi.getProfileStatus(),
          expenseUserId ? expensesApi.getBills() : Promise.resolve([]),
          expenseUserId ? expensesApi.getDashboardSummary() : Promise.resolve(null),
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
      // Add slight delay to make loading state transitions feel smoother and premium
      setTimeout(() => {
        setLoading(false);
      }, 400);
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

  const handleQuickAddExpenseSubmit = async (e) => {
    e.preventDefault();
    const expenseUser = JSON.parse(localStorage.getItem("User") || "null");
    const expenseUserId = getUserId(expenseUser);
    if (!expenseUserId) {
      toast.error("Please login to your expense tracker first");
      return;
    }
    const res = await expensesApi.createExpense({
      ...quickExpenseForm,
      userId: expenseUserId,
      amount: Number(quickExpenseForm.amount),
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
        note: "",
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
    setSelectedCalendarDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setSelectedCalendarDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const getBillsForDate = (date) => {
    if (!date) return [];
    return bills.filter((bill) => {
      const bDate = new Date(bill.dueDate);
      return (
        bDate.getDate() === date.getDate() &&
        bDate.getMonth() === date.getMonth() &&
        bDate.getFullYear() === date.getFullYear()
      );
    });
  };

  if (loading) {
    return <DashboardWideSkeleton />;
  }

  const currencySymbol =
    expenseSummary?.currency === "USD"
      ? "$"
      : expenseSummary?.currency === "EUR"
      ? "€"
      : expenseSummary?.currency === "GBP"
      ? "£"
      : "₹";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 relative pb-16"
    >
      {/* 📊 Summary Metrics Grid */}
      <motion.div variants={itemVariants}>
        <SectionHeader title="Overview" description="Real-time summaries across active modules" />
        
        <DashboardGrid cols={4} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <PremiumCard glow={true}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Class Attendance</span>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <CheckCircle className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                <AnimatedCounter value={attendanceStats.percentage} decimals={1} suffix="%" />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {attendanceStats.present} attended · {attendanceStats.total} total classes
              </p>
            </div>
          </PremiumCard>

          <PremiumCard glow={true}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Spending</span>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center border border-[var(--primary)]/30/20">
                <Wallet className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                <AnimatedCounter value={expenseSummary?.totalSpent || 0} prefix={currencySymbol} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                {expenses.length} transaction{expenses.length === 1 ? "" : "s"} tracked
              </p>
            </div>
          </PremiumCard>

          <PremiumCard glow={true}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Profile Progress</span>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                {profileCompleteness != null ? (
                  <AnimatedCounter value={profileCompleteness} suffix="%" />
                ) : (
                  "0%"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Referral profile completeness rate
              </p>
            </div>
          </PremiumCard>

          <PremiumCard glow={true}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Open Roles</span>
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center border border-[var(--primary)]/30/20">
                <Briefcase className="w-5.5 h-5.5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold tracking-tight text-foreground">
                <AnimatedCounter value={opportunities.length} />
              </div>
              <p className="text-xs text-muted-foreground mt-2 font-medium">
                Alumni opportunities available
              </p>
            </div>
          </PremiumCard>
        </DashboardGrid>
      </motion.div>

      {/* 💰 Expense Tracker Quick Insights */}
      <motion.div variants={itemVariants}>
        <SectionHeader
          title="Expense Insights"
          description="Real-time financial indicators"
          action={
            <PremiumButton
              variant="outline"
              size="sm"
              onClick={() => navigate("/expenses-tracker")}
              rightIcon={ArrowRight}
            >
              Expense Tracker
            </PremiumButton>
          }
        />
        
        <DashboardGrid cols={5} className="grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="p-4 bg-[var(--bg-secondary)] border border-border/50 rounded-[var(--radius-lg)] text-center flex flex-col justify-center transition-all hover:scale-[1.02] hover:border-[var(--primary)]/30 duration-200 shadow-sm gap-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Monthly Budget</span>
            <span className="block text-xl font-bold text-foreground mt-1">
              <AnimatedCounter value={expenseSummary?.monthlyBudget || 0} prefix={currencySymbol} />
            </span>
          </div>
          <div className="p-4 bg-[var(--bg-secondary)] border border-border/50 rounded-[var(--radius-lg)] text-center flex flex-col justify-center transition-all hover:scale-[1.02] hover:border-[var(--primary)]/30 duration-200 shadow-sm gap-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Spent</span>
            <span className="block text-xl font-bold text-red-500 mt-1">
              <AnimatedCounter value={expenseSummary?.totalSpent || 0} prefix={currencySymbol} />
            </span>
          </div>
          <div className="p-4 bg-[var(--bg-secondary)] border border-border/50 rounded-[var(--radius-lg)] text-center flex flex-col justify-center transition-all hover:scale-[1.02] hover:border-[var(--primary)]/30 duration-200 shadow-sm gap-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Remaining</span>
            <span className={`block text-xl font-bold mt-1 ${
              (expenseSummary?.remainingBudget || 0) < 0 ? "text-red-500" : "text-emerald-500"
            }`}>
              <AnimatedCounter value={expenseSummary?.remainingBudget || 0} prefix={currencySymbol} />
            </span>
          </div>
          <div className="p-4 bg-[var(--bg-secondary)] border border-border/50 rounded-[var(--radius-lg)] text-center flex flex-col justify-center transition-all hover:scale-[1.02] hover:border-[var(--primary)]/30 duration-200 shadow-sm gap-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Upcoming Bills</span>
            <span className="block text-xl font-bold text-[var(--primary)] mt-1">
              <AnimatedCounter value={expenseSummary?.upcomingCount || 0} />
            </span>
          </div>
          <div className="p-4 bg-[var(--bg-secondary)] border border-border/50 rounded-[var(--radius-lg)] text-center flex flex-col justify-center transition-all hover:scale-[1.02] hover:border-[var(--primary)]/30 duration-200 shadow-sm col-span-2 sm:col-span-1 gap-4">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Overdue Bills</span>
            <span className={`block text-xl font-bold mt-1 ${
              (expenseSummary?.overdueCount || 0) > 0 ? "text-red-500 animate-pulse font-extrabold" : "text-muted-foreground/60"
            }`}>
              <AnimatedCounter value={expenseSummary?.overdueCount || 0} />
            </span>
          </div>
        </DashboardGrid>
      </motion.div>

      {/* Grid Content */}
      <DashboardGrid cols={3} className="grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Classes */}
          <motion.div variants={itemVariants}>
            <PremiumCard
              title="Upcoming Classes"
              description="Tutorial sessions scheduled for your modules"
              action={
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/tutorials/profile/manageBooking")}
                >
                  View all
                </PremiumButton>
              }
            >
              {upcomingClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center p-6 min-h-[290px] w-full max-w-[420px] mx-auto select-none gap-4">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-5 shrink-0 border border-[var(--primary)]/20 shadow-sm">
                    <Clock className="w-6 h-6" />
                  </div>
                  {/* Heading */}
                  <h4 className="font-serif text-base font-bold text-foreground tracking-tight mb-2 text-center">
                    No Scheduled Sessions
                  </h4>
                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed text-center mb-6 max-w-sm">
                    You don't have any upcoming tutorial classes booked. Search for a tutor to schedule one.
                  </p>
                  {/* CTA */}
                  <PremiumButton
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(TUTORIAL_PATHS.unifiedEntry)}
                    className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
                  >
                    Book a Tutor
                  </PremiumButton>
                </div>
              ) : (
                <UpcomingTasks tasks={upcomingClasses} />
              )}
            </PremiumCard>
          </motion.div>

          {/* Interactive billing due calendar */}
          <motion.div variants={itemVariants}>
            <PremiumCard
              title="📅 Bills Due Calendar"
              description="Monitor billing cycles and premium deadlines"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center bg-secondary/35 p-2.5 rounded-[var(--radius-md)] border border-border/60">
                  <button onClick={handlePrevMonth} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-secondary cursor-pointer text-foreground">
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm font-bold text-foreground">
                    {selectedCalendarDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <button onClick={handleNextMonth} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-secondary cursor-pointer text-foreground">
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Grid Calendar */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <span key={d} className="font-bold text-muted-foreground py-1">{d}</span>
                  ))}
                  {calendarCells.map((date, idx) => {
                    if (!date) return <span key={`pad-${idx}`} className="py-2.5" />;

                    const dueBills = getBillsForDate(date);
                    const hasBills = dueBills.length > 0;
                    const isCurrentDay =
                      new Date().getDate() === date.getDate() &&
                      new Date().getMonth() === date.getMonth() &&
                      new Date().getFullYear() === date.getFullYear();

                    // Get critical level color
                    let borderClass = "border-transparent";
                    let dotClass = "";
                    if (hasBills) {
                      const priorities = dueBills.map((b) => b.priority);
                      if (priorities.includes("Critical")) {
                        borderClass = "border-red-500/50 bg-red-500/5";
                        dotClass = "bg-red-500";
                      } else if (priorities.includes("High")) {
                        borderClass = "border-amber-500/50 bg-amber-500/5";
                        dotClass = "bg-amber-500";
                      } else {
                        borderClass = "border-[var(--primary)]/30/50 bg-[var(--primary)]/5";
                        dotClass = "bg-[var(--primary)]";
                      }
                    }

                    return (
                      <div
                        key={`day-${idx}`}
                        className={`py-2 rounded-[var(--radius-sm)] border flex flex-col items-center justify-between min-h-[46px] transition-all relative ${borderClass} ${
                          isCurrentDay ? "bg-[var(--primary)]/10 border-[var(--primary)] font-extrabold" : ""
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
                <div className="border-t border-border/40 pt-4">
                  <span className="text-xs font-bold text-foreground">
                    Due Payments in {selectedCalendarDate.toLocaleString("en-US", { month: "long" })}:
                  </span>
                  <div className="space-y-2 mt-3">
                    {bills.filter((b) => {
                      const bDate = new Date(b.dueDate);
                      return (
                        bDate.getMonth() === selectedCalendarDate.getMonth() &&
                        bDate.getFullYear() === selectedCalendarDate.getFullYear()
                      );
                    }).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No payments due this month.</p>
                    ) : (
                      bills
                        .filter((b) => {
                          const bDate = new Date(b.dueDate);
                          return (
                            bDate.getMonth() === selectedCalendarDate.getMonth() &&
                            bDate.getFullYear() === selectedCalendarDate.getFullYear()
                          );
                        })
                        .map((b) => (
                          <div
                            key={b._id}
                            className="flex justify-between items-center text-xs p-2.5 rounded-[var(--radius-md)] bg-secondary/35 border border-border/50"
                          >
                            <span className="font-semibold text-foreground">{b.billName}</span>
                            <div className="flex gap-2.5 items-center">
                              <span className="text-muted-foreground">Due: {new Date(b.dueDate).getDate()}</span>
                              <span
                                className={`px-2 py-0.5 rounded-[var(--radius-sm)] font-bold uppercase tracking-wider text-[8px] ${
                                  b.priority === "Critical"
                                    ? "bg-red-500 text-white"
                                    : b.priority === "High"
                                    ? "bg-amber-500 text-white"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {b.priority}
                              </span>
                              <span className="font-extrabold">{currencySymbol}{b.amount}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </PremiumCard>
          </motion.div>

          {/* Expenses Chart */}
          <motion.div variants={itemVariants}>
            <PremiumCard title="Expenses by Category" description="Visual categorization of tracked expenditures">
              <ExpenseBreakdownChart data={expenseChartData.chartData} />
            </PremiumCard>
          </motion.div>

          {/* Referrals & Jobs */}
          <motion.div variants={itemVariants}>
            <SectionHeader
              title="Referrals & Positions"
              description="Positions recommended by active alumni connections"
              action={
                <PremiumButton
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/referrals/browse-referrals")}
                >
                  Browse all
                </PremiumButton>
              }
            />
            <PremiumCard>
              <RecommendedOpportunities />
            </PremiumCard>
          </motion.div>
        </div>

        {/* Sidebar Actions Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <PremiumCard title="Quick Modules" description="Instant shortcuts to specific systems">
              <div className="grid grid-cols-1 gap-3">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      to={action.to}
                      className="flex items-center gap-3.5 p-3.5 rounded-[var(--radius-md)] border border-border hover:border-[var(--primary)]/40 hover:bg-secondary/40 transition-all hover:translate-x-1 duration-200"
                    >
                      <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--primary)]/10 text-[var(--primary)] shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{action.label}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </PremiumCard>
          </motion.div>

          {/* Recent Activity Feed */}
          <motion.div variants={itemVariants}>
            <PremiumCard title="Recent Logs" description="Real-time activity logs across portal modules">
              {recentActivity.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  title="No Activity Logged"
                  description="Your recent actions on the platform will appear here in chronological order."
                />
              ) : (
                <ul className="space-y-3">
                  {recentActivity.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3.5 p-3.5 rounded-[var(--radius-md)] border border-border/80 bg-secondary/15 hover:border-[var(--primary)]/20 transition-all duration-200"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground line-clamp-1">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{item.meta}</p>
                      </div>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-[var(--radius-sm)] shrink-0 bg-secondary/85 text-muted-foreground border border-border/40">
                        {item.module}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </PremiumCard>
          </motion.div>
        </div>
      </DashboardGrid>

      {/* Global floating action button on bottom right of student dashboard */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsQuickAddExpenseOpen(true)}
          className="w-14 h-14 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(212,163,115,0.3)] hover:shadow-[0_8px_30px_rgba(212,163,115,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-[var(--primary)]/10"
          title="Quick Add Expense"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Quick Add Expense Modal */}
      <Modal
        isOpen={isQuickAddExpenseOpen}
        onClose={() => setIsQuickAddExpenseOpen(false)}
        title="Quick Add Expense"
      >
        <form onSubmit={handleQuickAddExpenseSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Description / Title</label>
            <PremiumInput
              type="text"
              value={quickExpenseForm.title}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, title: e.target.value })}
              placeholder="e.g. Textbook, Transit pass"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Amount (₹)</label>
            <PremiumInput
              type="number"
              value={quickExpenseForm.amount}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, amount: e.target.value })}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Category</label>
              <select
                value={quickExpenseForm.category}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, category: e.target.value })}
                className="premium-input text-foreground h-11 w-full cursor-pointer rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-border/80 text-sm py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
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
                  "Other",
                ].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Payment Method</label>
              <select
                value={quickExpenseForm.paymentMethod}
                onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, paymentMethod: e.target.value })}
                className="premium-input text-foreground h-11 w-full cursor-pointer rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-border/80 text-sm py-2 px-3 focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Date</label>
            <PremiumInput
              type="date"
              value={quickExpenseForm.date}
              onChange={(e) => setQuickExpenseForm({ ...quickExpenseForm, date: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-5 border-t border-border/30 mt-6">
            <PremiumButton
              type="button"
              variant="secondary"
              onClick={() => setIsQuickAddExpenseOpen(false)}
            >
              Cancel
            </PremiumButton>
            <PremiumButton
              type="submit"
              variant="default"
            >
              Confirm
            </PremiumButton>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UnifiedDashboard;
