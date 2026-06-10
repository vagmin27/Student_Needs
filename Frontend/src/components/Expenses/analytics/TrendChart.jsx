import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendChart = ({ data, labels }) => {
  const chartData = labels?.map((label, index) => ({
    name: label,
    Amount: data[index] || 0
  })) || [];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
          itemStyle={{ color: 'var(--text-secondary)' }}
        />
        <Area type="monotone" dataKey="Amount" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;