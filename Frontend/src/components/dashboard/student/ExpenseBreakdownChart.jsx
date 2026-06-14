import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../shared/ChartContainer";
import { EmptyState } from "../shared/EmptyState";
import { Wallet } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const COLORS = [
  '#D4A373', // Primary Gold
  '#E6C594', // Soft Gold
  '#B88654', // Muted Amber
  '#FAEDCD', // Warm Sand
  '#8B949E', // Refined Slate
];

export const ExpenseBreakdownChart = React.memo(({ data = [] }) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => isDark 
    ? COLORS
    : ["#6c4cf1", "#9b7cf6", "#c4b5fd", "#ede9fe", "#4c2fc4"]
  , [isDark]);

  const chartData = useMemo(() => data?.filter(d => d.amount > 0), [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <EmptyState 
        icon={Wallet} 
        title="No Expenses" 
        description="Your expense breakdown will appear here once you track transactions." 
      />
    );
  }

  return (
    <ChartContainer height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          innerRadius="60%"
          outerRadius="80%"
          paddingAngle={2}
          dataKey="amount"
          stroke="none"
          animationDuration={700}
        >
          {chartData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `₹ ${value.toLocaleString()}`}
          contentStyle={{ 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            color: 'var(--text-primary)', 
            borderRadius: 'var(--radius-md)',
            boxShadow: "var(--shadow-md)"
          }}
          itemStyle={{ color: 'var(--text-primary)' }}
          animationDuration={300}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px', paddingTop: '10px' }}
        />
      </PieChart>
    </ChartContainer>
  );
});
