import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartPalette } from '../../../utils/chartPalette';

const MonthlyExpenseChart = ({ exdata }) => {
  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyTotals = Array(12).fill(0);
    
    if (exdata && exdata.length > 0) {
      exdata.forEach(item => {
        const date = new Date(Date.parse(item.date));
        if(!isNaN(date.getMonth())) {
          monthlyTotals[date.getMonth()] += item.amount;
        }
      });
    }

    const currentMonth = new Date().getMonth();
    const data = [];
    
    for (let i = 5; i >= 0; i--) {
      let m = currentMonth - i;
      if (m < 0) m += 12; // wrap around
      data.push({
        name: monthNames[m],
        Expenses: monthlyTotals[m]
      });
    }

    return data;
  }, [exdata]);

  return (
    <div className="glass-card flex flex-col h-[320px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground">Expense Overview</h3>
        <select className="bg-[var(--input-bg)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm rounded-[var(--radius-sm)] outline-none px-3 py-1 cursor-pointer">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>
      <div className="flex-1 w-full relative min-h-[220px]">
        <ChartContainer height="100%" minHeight={220}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
            <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
            <Tooltip 
              cursor={{ fill: 'var(--neutral-bg)' }}
              content={<ChartTooltip formatter={(value) => `₹${value.toLocaleString()}`} />}
            />
            <Bar dataKey="Expenses" fill={chartPalette.primary} radius={[6, 6, 0, 0]} barSize={32} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;