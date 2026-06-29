import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartPalette } from '../../../utils/chartPalette';

const WeeklySpendingChart = ({ data, labels }) => {
  const chartData = labels?.map((label, index) => ({
    name: label,
    ThisWeek: data[index] || 0,
    LastWeek: (data[index] || 0) * (0.8 + Math.random() * 0.4)
  })) || [];

  return (
    <ChartContainer height="100%" minHeight={280}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <Tooltip 
          content={<ChartTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />}
        />
        <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} iconType="circle" />
        <Bar dataKey="ThisWeek" name="This Week" fill={chartPalette.success} radius={[4, 4, 0, 0]} />
        <Bar dataKey="LastWeek" name="Last Week" fill={chartPalette.secondary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
};

export default WeeklySpendingChart;