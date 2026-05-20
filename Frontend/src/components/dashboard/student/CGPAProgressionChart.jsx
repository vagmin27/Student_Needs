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
            <stop offset="5%" stopColor="rgba(99, 102, 241, 1)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="rgba(99, 102, 241, 1)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="semester" 
          stroke="#94a3b8" 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          stroke="#94a3b8" 
          tickLine={false} 
          axisLine={false} 
          domain={['dataMin - 0.5', 10]} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#cbd5e1' }}
          animationDuration={300}
        />
        <Area 
          type="monotone" 
          dataKey="cgpa" 
          stroke="rgba(99, 102, 241, 1)" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorCgpa)" 
          animationDuration={700}
        />
      </AreaChart>
    </ChartContainer>
  );
});
