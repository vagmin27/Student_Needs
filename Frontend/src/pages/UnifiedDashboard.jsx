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
  Gift,
  MessageSquare,
  Award,
  BookOpen,
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
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
  DashboardHeader,
  DashboardSection,
  SectionHeader,
  StatCard,
  MetricCard,
  AnalyticsCard,
  ActivityFeed,
  PremiumButton,
  PremiumInput,
  AnimatedCounter,
  EmptyState,
  PageLayout,
  DashboardGrid,
} from "@/components/dashboard/shared/Primitives";
import { DashboardWideSkeleton } from "@/components/dashboard/shared/Skeleton";

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
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date(2026, 5, 17));

  // User details integration (Long name wrapping test safe)
  const displayName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Student";

  const displayRole =
    user?.role ||
    user?.accountType ||
    "Student";

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

  const calendarCells = useMemo(() => {
    const year = selectedCalendarDate.getFullYear();
    const month = selectedCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();
    const prevMonthNumDays = new Date(year, month, 0).getDate();

    const cells = [];
    
    // Padding days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthNumDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let d = 1; d <= numDays; d++) {
      cells.push({
        date: new Date(year, month, d),
        isCurrentMonth: true
      });
    }
    
    // Next month days to pad to 42 cells
    const remainingCells = 42 - cells.length;
    for (let d = 1; d <= remainingCells; d++) {
      cells.push({
        date: new Date(year, month + 1, d),
        isCurrentMonth: false
      });
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

  const donutData = useMemo(() => {
    const colors = {
      Books: "#3b82f6",
      Food: "#8b5cf6",
      Transportation: "#14b8a6",
      Transport: "#14b8a6",
      Shopping: "#ec4899",
      Others: "#f59e0b",
      Other: "#f59e0b",
      "Tuition Fees": "#ef4444",
      "Hostel Fees": "#f97316",
    };

    if (!expenses || expenses.length === 0) {
      return [
        { name: "Books", amount: 1200, percentage: "28.2%", color: "#3b82f6" },
        { name: "Food", amount: 1080, percentage: "25.4%", color: "#8b5cf6" },
        { name: "Transport", amount: 720, percentage: "16.9%", color: "#14b8a6" },
        { name: "Shopping", amount: 680, percentage: "16.0%", color: "#ec4899" },
        { name: "Others", amount: 577.01, percentage: "13.5%", color: "#f59e0b" },
      ];
    }

    const total = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const byCategory = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
    });

    const entries = Object.entries(byCategory).map(([name, amount]) => {
      const percentageValue = total > 0 ? (amount / total) * 100 : 0;
      return {
        name,
        amount,
        percentage: `${percentageValue.toFixed(1)}%`,
        color: colors[name] || `#${Math.floor(Math.random()*16777215).toString(16)}`,
      };
    });

    if (entries.length > 5) {
      entries.sort((a, b) => b.amount - a.amount);
      const top4 = entries.slice(0, 4);
      const remainingAmount = entries.slice(4).reduce((acc, curr) => acc + curr.amount, 0);
      const remainingPct = total > 0 ? (remainingAmount / total) * 100 : 0;
      top4.push({
        name: "Others",
        amount: remainingAmount,
        percentage: `${remainingPct.toFixed(1)}%`,
        color: "#f59e0b",
      });
      return top4;
    }

    return entries;
  }, [expenses]);

  const activityCards = useMemo(() => {
    if (!recentActivity || recentActivity.length === 0) {
      return [
        {
          title: "Attendance marked",
          desc: "DBMS class attendance marked present",
          time: "2h ago",
          dotColor: "bg-emerald-500",
          iconBg: "bg-emerald-500/10",
          iconColor: "text-emerald-500",
          icon: CheckCircle,
        },
        {
          title: "Expense added",
          desc: "Food expense of ₹250 added",
          time: "5h ago",
          dotColor: "bg-cyan-500",
          iconBg: "bg-cyan-500/10",
          iconColor: "text-cyan-500",
          icon: Wallet,
        },
        {
          title: "Tutor session booked",
          desc: "CS-301 session with Dr. Marcus",
          time: "1d ago",
          dotColor: "bg-indigo-500",
          iconBg: "bg-indigo-500/10",
          iconColor: "text-indigo-500",
          icon: GraduationCap,
        },
      ];
    }

    return recentActivity.slice(0, 3).map((act, idx) => {
      let IconComponent = Activity;
      let iconBg = "bg-slate-500/10";
      let iconColor = "text-slate-500";
      let dotColor = "bg-slate-500";
      let title = "Update";

      if (act.module === "Attendance") {
        IconComponent = CheckCircle;
        iconBg = "bg-indigo-500/10";
        iconColor = "text-indigo-500";
        dotColor = "bg-indigo-500";
        title = "Attendance marked";
      } else if (act.module === "Expenses") {
        IconComponent = Wallet;
        iconBg = "bg-cyan-500/10";
        iconColor = "text-cyan-500";
        dotColor = "bg-cyan-500";
        title = "Expense tracked";
      } else if (act.module === "Tutorials") {
        IconComponent = GraduationCap;
        iconBg = "bg-emerald-500/10";
        iconColor = "text-emerald-500";
        dotColor = "bg-emerald-500";
        title = "Tutor session booked";
      } else if (act.module === "Referrals") {
        IconComponent = Briefcase;
        iconBg = "bg-pink-500/10";
        iconColor = "text-pink-500";
        dotColor = "bg-pink-500";
        title = "Referral opportunity";
      }

      const timeDiff = Date.now() - act.time;
      let timeStr = "Recent";
      if (timeDiff > 0) {
        const mins = Math.floor(timeDiff / 60000);
        const hrs = Math.floor(mins / 60);
        const days = Math.floor(hrs / 24);
        if (days > 0) timeStr = `${days}d ago`;
        else if (hrs > 0) timeStr = `${hrs}h ago`;
        else if (mins > 0) timeStr = `${mins}m ago`;
        else timeStr = "Just now";
      } else {
        timeStr = idx === 0 ? "2h ago" : idx === 1 ? "5h ago" : "1d ago";
      }

      return {
        title,
        desc: act.label,
        time: timeStr,
        dotColor,
        iconBg,
        iconColor,
        icon: IconComponent,
      };
    });
  }, [recentActivity]);

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
      className="space-y-8 relative pb-16 px-1 w-full min-w-0 max-w-full overflow-hidden box-border"
    >
      {/* 👋 Welcome Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/40 mb-2 w-full min-w-0 max-w-full box-border overflow-hidden">
        <div className="space-y-1.5 min-w-0 max-w-full">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize tracking-wider shrink-0">
              {displayRole} Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex flex-wrap items-center gap-2 mt-1 break-words whitespace-normal leading-tight max-w-full">
            Welcome back, <span className="text-primary break-all">{displayName}</span> <span className="animate-bounce shrink-0">👋</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium break-words whitespace-normal max-w-full">Here's what's happening with your academic journey today.</p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-center shrink-0">
          <div className="px-4 py-2.5 rounded-2xl bg-card border border-border/80 text-xs font-bold text-muted-foreground shadow-sm flex items-center gap-2 shrink-0">
            <CalendarIcon size={14} className="text-primary shrink-0" />
            <span className="whitespace-normal break-words">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Row 1: KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full min-w-0 max-w-full">
        {/* Card 1: Attendance */}
        <div className="bg-card/50 backdrop-blur-md border border-border/85 rounded-[20px] p-6 flex flex-col justify-between shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] relative group hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 transition-all duration-300 min-h-[170px] min-w-0 max-w-full overflow-hidden box-border h-full w-full">
          <div className="flex justify-between items-center gap-4 w-full min-w-0 pt-1">
            <div className="space-y-1 min-w-0 text-left">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase break-words whitespace-normal block">Class Attendance</span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight mt-1.5 break-words whitespace-normal block leading-none">
                {attendanceStats.percentage > 0 ? `${attendanceStats.percentage}%` : "94.2%"}
              </h3>
              <span className="text-xs text-muted-foreground block font-semibold mt-1 break-words whitespace-normal">This Month</span>
            </div>
            <div className="p-3.5 rounded-[14px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105 border border-indigo-500/20 shadow-[0_2px_8px_rgba(99,102,241,0.08)] dark:shadow-[0_0_15px_rgba(167,139,250,0.15)] shrink-0 self-center">
              <GraduationCap size={20} className="shrink-0" />
            </div>
          </div>
          <div className="mt-6 w-full min-w-0 pb-1">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                style={{ width: `${attendanceStats.percentage > 0 ? attendanceStats.percentage : 94.2}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold block mt-2.5 break-words whitespace-normal leading-normal text-left">
              {attendanceStats.total > 0 ? `${attendanceStats.present} attended • ${attendanceStats.total - attendanceStats.present} missed` : "27 attended • 3 missed"}
            </span>
          </div>
        </div>

        {/* Card 2: Total Spending */}
        <div className="bg-card/50 backdrop-blur-md border border-border/85 rounded-[20px] p-6 flex flex-col justify-between shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] relative group hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 transition-all duration-300 min-h-[170px] min-w-0 max-w-full overflow-hidden box-border h-full w-full">
          <div className="flex justify-between items-center gap-4 w-full min-w-0 pt-1">
            <div className="space-y-1 min-w-0 text-left">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase break-words whitespace-normal block">Total Spending</span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight mt-1.5 break-words whitespace-normal block leading-none">
                {expenseSummary?.totalSpent !== undefined ? `${currencySymbol}${expenseSummary.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "₹4,257.01"}
              </h3>
              <span className="text-xs text-muted-foreground block font-semibold mt-1 break-words whitespace-normal">This Month</span>
            </div>
            <div className="p-3.5 rounded-[14px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition-transform duration-300 group-hover:scale-105 border border-cyan-500/20 shadow-[0_2px_8px_rgba(6,182,212,0.08)] dark:shadow-[0_0_15px_rgba(56,189,248,0.15)] shrink-0 self-center">
              <Wallet size={20} className="shrink-0" />
            </div>
          </div>
          <div className="mt-6 w-full min-w-0 pb-1">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                style={{ 
                  width: `${
                    expenseSummary?.totalSpent && expenseSummary?.monthlyBudget
                      ? Math.min((expenseSummary.totalSpent / expenseSummary.monthlyBudget) * 100, 100)
                      : 70.9
                  }%` 
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold block mt-2.5 break-words whitespace-normal leading-normal text-left">
              {expenseSummary?.remainingBudget !== undefined && expenseSummary?.monthlyBudget !== undefined 
                ? `${currencySymbol}${expenseSummary.remainingBudget.toLocaleString()} left of ${currencySymbol}${expenseSummary.monthlyBudget.toLocaleString()}` 
                : "₹1,743 left of ₹6,000"}
            </span>
          </div>
        </div>

        {/* Card 3: Profile Progress */}
        <div className="bg-card/50 backdrop-blur-md border border-border/85 rounded-[20px] p-6 flex flex-col justify-between shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] relative group hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 transition-all duration-300 min-h-[170px] min-w-0 max-w-full overflow-hidden box-border h-full w-full">
          <div className="flex justify-between items-center gap-4 w-full min-w-0 pt-1">
            <div className="space-y-1 min-w-0 text-left">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase break-words whitespace-normal block">Profile Progress</span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight mt-1.5 break-words whitespace-normal block leading-none">
                {profileCompleteness !== null ? `${profileCompleteness}%` : "100%"}
              </h3>
              <span className="text-xs text-muted-foreground block font-semibold mt-1 break-words whitespace-normal">Complete</span>
            </div>
            <div className="p-3.5 rounded-[14px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-105 border border-emerald-500/20 shadow-[0_2px_8px_rgba(52,211,153,0.08)] dark:shadow-[0_0_15px_rgba(52,211,153,0.15)] shrink-0 self-center">
              <TrendingUp size={20} className="shrink-0" />
            </div>
          </div>
          <div className="mt-6 w-full min-w-0 pb-1">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" 
                style={{ width: `${profileCompleteness !== null ? profileCompleteness : 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2 mt-2.5 min-w-0 text-left">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] text-muted-foreground font-semibold break-words whitespace-normal leading-normal">
                {profileCompleteness !== null && profileCompleteness < 100 ? `${100 - profileCompleteness}% tasks remaining` : "All tasks completed"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Referrals Made */}
        <div className="bg-card/50 backdrop-blur-md border border-border/85 rounded-[20px] p-6 flex flex-col justify-between shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] relative group hover:-translate-y-1 hover:shadow-lg hover:border-accent/30 transition-all duration-300 min-h-[170px] min-w-0 max-w-full overflow-hidden box-border h-full w-full">
          <div className="flex justify-between items-center gap-4 w-full min-w-0 pt-1">
            <div className="space-y-1 min-w-0 text-left">
              <span className="text-[11px] font-bold text-muted-foreground tracking-wider uppercase break-words whitespace-normal block">Referrals Made</span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight mt-1.5 break-words whitespace-normal block leading-none">
                {opportunities.length > 0 ? opportunities.length : "8"}
              </h3>
              <span className="text-xs text-muted-foreground block font-semibold mt-1 break-words whitespace-normal">Opportunities</span>
            </div>
            <div className="p-3.5 rounded-[14px] bg-pink-500/10 text-pink-600 dark:text-pink-400 transition-transform duration-300 group-hover:scale-105 border border-pink-500/20 shadow-[0_2px_8px_rgba(244,114,182,0.08)] dark:shadow-[0_0_15px_rgba(244,114,182,0.15)] shrink-0 self-center">
              <Gift size={20} className="shrink-0" />
            </div>
          </div>
          <div className="mt-6 w-full min-w-0 pb-1">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" 
                style={{ width: `${Math.min((opportunities.length || 8) * 10, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground font-semibold block mt-2.5 break-words whitespace-normal leading-normal text-left">
              {(opportunities.length || 8) >= 8 ? "Top tier advocate status" : `${opportunities.length || 8} tracked applications`}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Classes & Expense Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0 max-w-full">
        {/* Column 1: Upcoming Classes */}
        <div className="lg:col-span-5 bg-card/50 backdrop-blur-md border border-border/80 rounded-[20px] p-6 shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col h-full justify-between min-w-0 max-w-full overflow-hidden box-border w-full">
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-4 w-full gap-2 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground tracking-wide break-words whitespace-normal">Upcoming Classes</h3>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 break-words whitespace-normal">Tutorial sessions scheduled for your modules</p>
            </div>
            <button 
              onClick={() => navigate("/tutorials/profile/manageBooking")}
              className="text-[11px] font-bold text-indigo-600 dark:text-[#818cf8] hover:text-indigo-700 dark:hover:text-[#a5b4fc] transition-colors cursor-pointer shrink-0"
            >
              View all
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center space-y-4 py-2 w-full min-w-0">
            {upcomingClasses.length > 0 ? (
              upcomingClasses.map((item) => (
                <div key={item.id} className="bg-secondary/40 border border-border/60 rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/70 hover:border-accent/40 transition-all duration-200 group gap-3 min-w-0 max-w-full overflow-hidden box-border">
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 shrink-0">
                      <CalendarIcon size={16} className="shrink-0" />
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-1.5 shrink-0 whitespace-nowrap">
                        UPCOMING
                      </span>
                      <h4 className="text-xs font-bold text-foreground break-words whitespace-normal leading-normal group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mt-1">{item.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 break-words whitespace-normal font-medium flex items-center gap-1.5 min-w-0 w-full">
                        <Clock size={10} className="text-muted-foreground shrink-0" />
                        <span className="break-words">{item.date} • Online Session</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/tutorials")}
                    className="p-2 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(79,70,229,0.2)]"
                  >
                    <ArrowRight size={12} className="stroke-[3] shrink-0" />
                  </button>
                </div>
              ))
            ) : (
              /* Mock booking layout */
              <div className="bg-secondary/40 border border-border/60 rounded-2xl p-4 flex items-center justify-between hover:bg-secondary/70 hover:border-accent/40 transition-all duration-200 group gap-3 min-w-0 max-w-full overflow-hidden box-border">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 shrink-0">
                    <CalendarIcon size={16} className="shrink-0" />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 mb-1.5 shrink-0 whitespace-nowrap">
                      UPCOMING
                    </span>
                    <h4 className="text-xs font-bold text-foreground break-words whitespace-normal leading-normal group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors mt-1">CS-301 Algorithms with Dr. Marcus</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 break-words whitespace-normal font-semibold flex items-center gap-1.5 min-w-0 w-full">
                      <Clock size={10} className="shrink-0" />
                      <span className="break-words">17 Jun, 05:30 PM • Online Session</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate("/tutorials")}
                  className="p-2 rounded-xl bg-accent text-white hover:bg-accent-hover transition-colors shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(79,70,229,0.2)]"
                >
                  <ArrowRight size={12} className="stroke-[3] shrink-0" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Expense Overview */}
        <div className="lg:col-span-7 bg-card/50 backdrop-blur-md border border-border/80 rounded-[20px] p-6 shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col justify-between h-full min-w-0 max-w-full overflow-hidden box-border w-full">
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-4 w-full gap-2 min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground tracking-wide break-words whitespace-normal">Expense Overview</h3>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 break-words whitespace-normal">Visual breakdown of your expenses</p>
            </div>
            <button 
              onClick={() => navigate("/expenses-tracker")}
              className="text-[11px] font-bold text-indigo-600 dark:text-[#818cf8] hover:text-indigo-700 dark:hover:text-[#a5b4fc] transition-colors cursor-pointer shrink-0"
            >
              View report
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 py-2.5 w-full min-w-0 max-w-full">
            {/* Recharts Pie Donut with explicit sizing container */}
            <div className="relative w-[160px] h-[160px] flex items-center justify-center shrink-0 mx-auto sm:mx-0 min-w-0 max-w-full overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest leading-none">Total</span>
                <span className="text-sm font-black text-foreground mt-1 leading-none break-words">
                  {expenseSummary?.totalSpent !== undefined ? `${currencySymbol}${expenseSummary.totalSpent.toLocaleString()}` : "₹4,257.01"}
                </span>
              </div>
              <PieChart width={160} height={160} className="overflow-visible shrink-0">
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>

            {/* Custom Legend */}
            <div className="flex flex-col gap-2.5 w-full sm:w-auto min-w-[200px] max-w-xs pl-0 sm:pl-4 text-left">
              {donutData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-xs w-full gap-2.5 min-w-0 max-w-full overflow-hidden box-border">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="font-bold text-muted-foreground text-[11px] break-words whitespace-normal leading-normal">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-extrabold text-foreground text-[11px] whitespace-nowrap">{currencySymbol}{item.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
                    <span className="text-muted-foreground font-bold w-10 text-right text-[10px] shrink-0 whitespace-nowrap">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Grid for Bills Due Calendar & Quick Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0 max-w-full">
        {/* Column 1: Bills Due Calendar */}
        <div className="lg:col-span-5 bg-card/50 backdrop-blur-md border border-border/80 rounded-[20px] p-6 shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col h-full justify-between min-w-0 max-w-full overflow-hidden box-border w-full">
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-4 w-full min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground tracking-wide break-words whitespace-normal">Bills Due Calendar</h3>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 break-words whitespace-normal">Monitor billing cycles and premium deadlines</p>
            </div>
          </div>

          <div className="space-y-4 w-full min-w-0">
            {/* Header with Arrow controls */}
            <div className="flex justify-between items-center bg-secondary/50 p-2.5 rounded-2xl border border-border/60 w-full gap-2 min-w-0">
              <button 
                onClick={handlePrevMonth} 
                className="p-1.5 rounded-xl hover:bg-card hover:text-foreground transition-colors cursor-pointer text-muted-foreground shrink-0"
              >
                <ChevronLeft size={16} className="shrink-0" />
              </button>
              <span className="text-xs font-bold text-foreground tracking-wider uppercase truncate min-w-0">
                {selectedCalendarDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button 
                onClick={handleNextMonth} 
                className="p-1.5 rounded-xl hover:bg-card hover:text-foreground transition-colors cursor-pointer text-muted-foreground shrink-0"
              >
                <ChevronRight size={16} className="shrink-0" />
              </button>
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-1 text-center w-full min-w-0 max-w-full px-2.5 pb-2.5">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                <span key={dayName} className="font-bold text-[10px] text-muted-foreground py-2 uppercase tracking-widest block">{dayName}</span>
              ))}
              {calendarCells.map((cellObj, idx) => {
                const { date, isCurrentMonth } = cellObj;
                const dayNum = date.getDate();
                const isSelected = 
                  selectedCalendarDate &&
                  date.getDate() === selectedCalendarDate.getDate() &&
                  date.getMonth() === selectedCalendarDate.getMonth() &&
                  date.getFullYear() === selectedCalendarDate.getFullYear();

                let hasDot = false;
                let dotColorClass = "";
                
                // Show mock dots on June 5, 12, 19
                const isJune2026 = date.getMonth() === 5 && date.getFullYear() === 2026;
                if (isCurrentMonth && isJune2026) {
                  if (dayNum === 5) { hasDot = true; dotColorClass = "bg-amber-500"; }
                  else if (dayNum === 12) { hasDot = true; dotColorClass = "bg-cyan-500"; }
                  else if (dayNum === 19) { hasDot = true; dotColorClass = "bg-pink-500"; }
                }

                // Actual bills
                const dueBills = isCurrentMonth ? getBillsForDate(date) : [];
                if (dueBills.length > 0) {
                  hasDot = true;
                  const priorities = dueBills.map(b => b.priority);
                  if (priorities.includes("Critical") || priorities.includes("High")) {
                    dotColorClass = "bg-red-500";
                  } else {
                    dotColorClass = "bg-indigo-500";
                  }
                }

                return (
                  <div 
                    key={`day-${idx}`} 
                    className="py-1 flex flex-col items-center justify-center relative cursor-pointer min-w-0 overflow-hidden box-border w-full aspect-square"
                    onClick={() => setSelectedCalendarDate(date)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-bold shrink-0
                      ${isSelected 
                        ? "bg-primary text-white shadow-[0_0_12px_rgba(79,70,229,0.4)]" 
                        : isCurrentMonth 
                        ? "text-foreground hover:bg-secondary" 
                        : "text-muted-foreground/40 hover:bg-secondary/30"
                      }
                    `}>
                      {dayNum}
                    </div>
                    {hasDot && !isSelected && (
                      <span className={`absolute bottom-0.5 w-1.5 h-1.5 rounded-full ${dotColorClass} shrink-0`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Quick Modules Shortcuts */}
        <div className="lg:col-span-7 bg-card/50 backdrop-blur-md border border-border/80 rounded-[20px] p-6 shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col h-full justify-between min-w-0 max-w-full overflow-hidden box-border w-full">
          <div className="flex justify-between items-center pb-4 border-b border-border/60 mb-4 w-full min-w-0">
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-foreground tracking-wide break-words whitespace-normal">Quick Modules</h3>
              <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 break-words whitespace-normal">Access your most-used features</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-center py-2 w-full min-w-0">
            {[
              {
                label: "Book Session",
                desc: "Find a tutor & book",
                icon: GraduationCap,
                to: TUTORIAL_PATHS.unifiedEntry,
                borderClass: "border-indigo-500 hover:border-indigo-600",
                bgClass: "bg-indigo-500/[0.04] hover:bg-indigo-500/[0.08]",
                textClass: "text-indigo-600 dark:text-indigo-400",
              },
              {
                label: "My Bookings",
                desc: "View your classes",
                icon: CheckSquare,
                to: "/tutorials/profile/manageBooking",
                borderClass: "border-emerald-500 hover:border-emerald-600",
                bgClass: "bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]",
                textClass: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Resources",
                desc: "Get study materials",
                icon: BookOpen,
                to: TUTORIAL_PATHS.unifiedEntry,
                borderClass: "border-amber-500 hover:border-amber-600",
                bgClass: "bg-amber-500/[0.04] hover:bg-amber-500/[0.08]",
                textClass: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Ask Doubt",
                desc: "Chat with educators",
                icon: MessageSquare,
                to: "/chat",
                borderClass: "border-rose-500 hover:border-rose-600",
                bgClass: "bg-rose-500/[0.04] hover:bg-rose-500/[0.08]",
                textClass: "text-rose-600 dark:text-rose-400",
              },
            ].map((mod, idx) => {
              const Icon = mod.icon;
              return (
                <Link
                  key={idx}
                  to={mod.to}
                  className={`border border-border/60 border-l-4 ${mod.borderClass} ${mod.bgClass} rounded-2xl p-6 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 group cursor-pointer w-full min-w-0 max-w-full overflow-hidden box-border`}
                >
                  <div className="flex items-center justify-between w-full gap-2 mb-3">
                    <div className={`p-2.5 rounded-xl bg-card border border-border/80 shrink-0 ${mod.textClass}`}>
                      <Icon size={18} className="transition-transform duration-300 group-hover:scale-110 shrink-0" />
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                  </div>
                  <div className="mt-4 min-w-0 w-full text-left">
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors break-words whitespace-normal leading-snug">{mod.label}</h4>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium leading-normal break-words whitespace-normal">{mod.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Activity timeline events */}
      <div className="bg-card/50 backdrop-blur-md border border-border/80 rounded-[20px] p-6 shadow-sm dark:shadow-[0_10px_35px_rgba(0,0,0,0.3)] flex flex-col space-y-6 min-w-0 max-w-full overflow-hidden box-border w-full">
        <div className="flex justify-between items-center pb-3 border-b border-border/60 w-full min-w-0 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-foreground tracking-wide break-words whitespace-normal">Recent Activity</h3>
            <p className="text-[11px] text-muted-foreground font-semibold mt-0.5 break-words whitespace-normal">Your latest actions and updates across portals</p>
          </div>
          <button 
            onClick={() => navigate("/student/attendance")}
            className="text-[11px] font-bold text-indigo-600 dark:text-[#818cf8] hover:text-indigo-700 dark:hover:text-[#a5b4fc] transition-colors cursor-pointer shrink-0"
          >
            View all activity
          </button>
        </div>

        <div className="relative border-l border-border/60 ml-4 pl-6 space-y-6 py-2 w-full min-w-0 max-w-full">
          {activityCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div key={idx} className="relative flex items-center gap-4 group w-full min-w-0 max-w-full overflow-hidden box-border">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 flex items-center justify-center shrink-0">
                  <div className="w-3.5 h-3.5 rounded-full border border-background bg-card flex items-center justify-center shadow-sm">
                    <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />
                  </div>
                </div>
                {/* Icon wrapper */}
                <div className={`p-2.5 rounded-xl ${card.iconBg} ${card.iconColor} border border-border/60 shrink-0 self-center`}>
                  <Icon size={16} className="shrink-0" />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 max-w-full bg-secondary/20 hover:bg-secondary/40 border border-border/40 hover:border-accent/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-300 box-border text-left">
                  <div className="min-w-0 max-w-full">
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors break-words whitespace-normal leading-normal">{card.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed break-words whitespace-normal">{card.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <span className="text-xs text-muted-foreground/80 font-medium whitespace-nowrap">{card.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global floating action button on bottom right of student dashboard */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setIsQuickAddExpenseOpen(true)}
          className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-primary/20 shrink-0"
          title="Quick Add Expense"
        >
          <Plus size={24} className="shrink-0" />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
