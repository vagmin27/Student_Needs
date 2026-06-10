import React, { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../shared/ChartContainer";
import { EmptyState } from "../shared/EmptyState";
import { TrendingUp } from "lucide-react";

export const CGPAProgressionChart = React.memo(({ data = [] }) => {
  const chartData = useMemo(() => data, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <EmptyState 
        icon={TrendingUp} 
        title="No Academic Data" 
        description="Your CGPA progression will appear here once results are published." 
      />
    );
  }

  return (
    <ChartContainer height={280}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCgpa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis 
          dataKey="semester" 
          stroke="var(--text-secondary)" 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          stroke="var(--text-secondary)" 
          tickLine={false} 
          axisLine={false} 
          domain={['dataMin - 0.5', 10]} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          animationDuration={300}
        />
        <Area 
          type="monotone" 
          dataKey="cgpa" 
          stroke="var(--primary)" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCgpa)" 
          animationDuration={700}
        />
      </AreaChart>
    </ChartContainer>
  );
});
