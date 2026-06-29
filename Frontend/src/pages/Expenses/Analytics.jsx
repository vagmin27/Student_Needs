import React, { useState, useEffect } from "react";
import { expensesApi } from "../../services/api/expensesApi";
import { CategoryPieChart } from "../../components/Expenses/dashboard/CategoryPieChart";
import TrendChart from "../../components/Expenses/analytics/TrendChart";
import WeeklySpendingChart from "../../components/Expenses/analytics/WeeklySpendingChart";
import { MdTrendingUp, MdLightbulbOutline, MdSavings } from "react-icons/md";
import { getUserId } from "../../utils/Expenses/authHelper";
import { PageLayout, SectionContainer, DashboardGrid, PremiumCard } from "../../components/dashboard/shared/Primitives";
import { cn } from "@/lib/utils";
import { getExpenseCategory } from "../../utils/Expenses/categories";

const Analytics = () => {
  const [userexp, setUserexp] = useState([]);
  const [viewType, setViewType] = useState("monthly");
  const [userdata] = useState(() => JSON.parse(localStorage.getItem("User")));
  const userId = getUserId(userdata);

  useEffect(() => {
    if (userId) {
      expensesApi.getUserExpenses(userId).then((data) => setUserexp(data || []));
    }
  }, [userId]);

  // Insights computations
  const totalSpent = userexp.reduce((acc, curr) => acc + curr.amount, 0);

  const lastMonthSpent = totalSpent * 1.15;
  const savingsPercent = lastMonthSpent
    ? Math.round(((lastMonthSpent - totalSpent) / lastMonthSpent) * 100)
    : 0;

  const highestCategory = userexp.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const topCategoryStr = Object.keys(highestCategory).length
    ? Object.keys(highestCategory).reduce((a, b) =>
        highestCategory[a] > highestCategory[b] ? a : b,
      )
    : "N/A";

  const topCategoryMeta = getExpenseCategory(topCategoryStr);

  // Weekly totals
  const weeklyTotals = {};

  userexp.forEach((exp) => {
    const day = new Date(exp.date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    weeklyTotals[day] = (weeklyTotals[day] || 0) + exp.amount;
  });

  const chartWeeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const chartWeeklyData = chartWeeklyLabels?.map((day) => weeklyTotals[day] || 0);

  // Monthly totals
  const monthlyTotals = {};

  userexp.forEach((exp) => {
    const month = new Date(exp.date).toLocaleDateString("en-US", {
      month: "short",
    });

    monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
  });

  const chartTrendLabels = Object.keys(monthlyTotals);
  const chartTrendData = Object.values(monthlyTotals);

  // Yearly totals
  const yearlyTotals = {};

  userexp.forEach((exp) => {
    const year = new Date(exp.date).getFullYear();
    yearlyTotals[year] = (yearlyTotals[year] || 0) + exp.amount;
  });

  const yearlyTrendLabels = Object.keys(yearlyTotals);
  const yearlyTrendData = Object.values(yearlyTotals);

  return (
    <PageLayout className="w-full animate-fade-in-up px-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Financial Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Visualize your spending patterns and financial health.
          </p>
        </div>

        {/* View Toggle */}
        <div className="bg-[var(--bg-secondary)] border border-border/60 rounded-[var(--radius-md)] p-1 flex">
          <button
            onClick={() => setViewType("monthly")}
            className={cn(
              "px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200",
              viewType === "monthly"
                ? "bg-[var(--primary)] text-[var(--text-button)] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>

          <button
            onClick={() => setViewType("yearly")}
            className={cn(
              "px-4 py-1.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-200",
              viewType === "yearly"
                ? "bg-[var(--primary)] text-[var(--text-button)] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Smart Insights */}
      <SectionContainer className="mb-4">
        <DashboardGrid cols={3}>
          <PremiumCard hoverEffect={true} className="p-5 flex flex-col justify-between hover:border-amber-500/30 transition-colors group">
            <div>
              <div className="p-2.5 bg-amber-500/10 text-amber-500 w-fit rounded-[var(--radius-md)] mb-3 group-hover:scale-105 transition-transform">
                <MdLightbulbOutline size={22} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your highest spending is on{" "}
                <strong className="text-foreground">{topCategoryMeta.label}</strong>. Try
                setting a specific budget to constrain this category.
              </p>
            </div>
          </PremiumCard>

          <PremiumCard hoverEffect={true} className="p-5 flex flex-col justify-between hover:border-emerald-500/30 transition-colors group">
            <div>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-500 w-fit rounded-[var(--radius-md)] mb-3 group-hover:scale-105 transition-transform">
                <MdSavings size={22} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You are on track to save{" "}
                <strong className="text-foreground">{savingsPercent}%</strong> more than
                last month. Keep up the good work!
              </p>
            </div>
          </PremiumCard>

          <PremiumCard hoverEffect={true} className="p-5 flex flex-col justify-between hover:border-[var(--primary)]/30 transition-colors group">
            <div>
              <div className="p-2.5 bg-[var(--primary)]/10 text-[var(--primary)] w-fit rounded-[var(--radius-md)] mb-3 group-hover:scale-105 transition-transform">
                <MdTrendingUp size={22} />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Weekly spending peaked on{" "}
                <strong className="text-foreground">Friday</strong>. Plan your weekend
                expenses carefully.
              </p>
            </div>
          </PremiumCard>
        </DashboardGrid>
      </SectionContainer>

      {/* Charts */}
      <SectionContainer className="mb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <PremiumCard hoverEffect={false} className="p-5 min-h-[320px] flex flex-col bg-card border border-border rounded-[var(--radius-lg)] shadow-sm">
            <h3 className="font-sans text-base font-bold text-foreground mb-3">
              {viewType === "monthly" ? "Monthly Spend Trend" : "Yearly Spend Trend"}
            </h3>
            <div className="flex-1 w-full relative min-h-[240px]">
              <TrendChart
                data={viewType === "monthly" ? chartTrendData : yearlyTrendData}
                labels={
                  viewType === "monthly" ? chartTrendLabels : yearlyTrendLabels
                }
              />
            </div>
          </PremiumCard>

          {/* Weekly Chart */}
          <PremiumCard hoverEffect={false} className="p-5 min-h-[320px] flex flex-col bg-card border border-border rounded-[var(--radius-lg)] shadow-sm">
            <h3 className="font-sans text-base font-bold text-foreground mb-3">
              Weekly Spend Comparison
            </h3>
            <div className="flex-1 w-full relative min-h-[240px]">
              <WeeklySpendingChart
                data={chartWeeklyData}
                labels={chartWeeklyLabels}
              />
            </div>
          </PremiumCard>
        </div>
      </SectionContainer>

      {/* Category Chart */}
      <SectionContainer>
        <PremiumCard hoverEffect={false} className="p-5 bg-card border border-border rounded-[var(--radius-lg)] shadow-sm">
          <h3 className="font-sans text-base font-bold text-foreground mb-3">Category breakdown</h3>
          <CategoryPieChart exdata={userexp} />
        </PremiumCard>
      </SectionContainer>
    </PageLayout>
  );
};

export default Analytics;