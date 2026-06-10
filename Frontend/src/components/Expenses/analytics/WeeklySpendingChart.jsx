import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const WeeklySpendingChart = ({ data, labels }) => {
  const chartData = labels?.map((label, index) => ({
    name: label,
    ThisWeek: data[index] || 0,
    LastWeek: (data[index] || 0) * (0.8 + Math.random() * 0.4)
  })) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
        />
        <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} iconType="circle" />
        <Bar dataKey="ThisWeek" fill="var(--success)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="LastWeek" fill="var(--neutral-bg)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklySpendingChart;