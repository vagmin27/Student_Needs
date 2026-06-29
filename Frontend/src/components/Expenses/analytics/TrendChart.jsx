import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartPalette } from '../../../utils/chartPalette';

const TrendChart = ({ data, labels }) => {
  const chartData = labels?.map((label, index) => ({
    name: label,
    Amount: data[index] || 0
  })) || [];

  return (
    <ChartContainer height="100%" minHeight={280}>
      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartPalette.primary} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={chartPalette.primary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
        <Tooltip 
          content={<ChartTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />}
        />
        <Area type="monotone" dataKey="Amount" stroke={chartPalette.primary} fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ChartContainer>
  );
};

export default TrendChart;