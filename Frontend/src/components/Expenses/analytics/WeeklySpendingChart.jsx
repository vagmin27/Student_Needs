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
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#cbd5e1' }}
        />
        <Legend wrapperStyle={{ color: '#94a3b8' }} iconType="circle" />
        <Bar dataKey="ThisWeek" fill="rgba(52, 211, 153, 0.8)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="LastWeek" fill="rgba(255, 255, 255, 0.1)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklySpendingChart;