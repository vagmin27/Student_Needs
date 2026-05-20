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
            <stop offset="5%" stopColor="rgba(99, 102, 241, 1)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="rgba(99, 102, 241, 1)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#cbd5e1' }}
        />
        <Area type="monotone" dataKey="Amount" stroke="rgba(99, 102, 241, 1)" fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;