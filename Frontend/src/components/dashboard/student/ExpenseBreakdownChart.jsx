import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../shared/ChartContainer";
import { EmptyState } from "../shared/EmptyState";
import { Wallet } from "lucide-react";

const COLORS = [
  'rgba(99, 102, 241, 0.8)',  // Indigo
  'rgba(251, 146, 60, 0.8)',  // Orange
  'rgba(52, 211, 153, 0.8)',  // Emerald
  'rgba(251, 113, 133, 0.8)', // Rose
  'rgba(148, 163, 184, 0.8)', // Slate
];

export const ExpenseBreakdownChart = React.memo(({ data = [] }) => {
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => `₹ ${value.toLocaleString()}`}
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#cbd5e1' }}
          animationDuration={300}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          iconType="circle"
          wrapperStyle={{ color: '#94a3b8', fontSize: '12px', paddingTop: '10px' }}
        />
      </PieChart>
    </ChartContainer>
  );
});
