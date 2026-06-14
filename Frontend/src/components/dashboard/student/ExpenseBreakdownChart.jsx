import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, chartColors } from "../shared/ChartContainer";
import { EmptyState } from "../shared/Primitives";
import { Wallet } from "lucide-react";

export const ExpenseBreakdownChart = React.memo(({ data = [] }) => {
  const colors = useMemo(() => [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.info,
    chartColors.neutral
  ], []);

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
        <Tooltip content={<ChartTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />} />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          wrapperStyle={{ color: "var(--text-secondary)", fontSize: "12px", paddingTop: "10px" }}
        />
      </PieChart>
    </ChartContainer>
  );
});
