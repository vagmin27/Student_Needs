import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sortCategoryWise } from '../../../utils/Expenses/seperator';
import { useTheme } from '../../../context/ThemeContext';

export function CategoryPieChart({ exdata }) {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

  const COLORS = isDark
    ? [
        'rgba(251, 146, 60, 0.8)',  // Orange
        'rgba(96, 165, 250, 0.8)',  // Blue
        'rgba(192, 132, 252, 0.8)', // Purple
        'rgba(129, 140, 248, 0.8)', // Indigo
        'rgba(251, 113, 133, 0.8)', // Rose
        'rgba(52, 211, 153, 0.8)',  // Emerald
        'rgba(148, 163, 184, 0.8)', // Slate
      ]
    : ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE"];

  const chartData = categories?.map((cat, index) => ({
    name: cat,
    value: totalexp[index]
  }))?.filter(item => item.value > 0);

  const isEmpty = chartData.length === 0;

  return (
    <div className="glass-card flex flex-col h-[320px]">
      <h3 className="text-xl font-bold text-foreground mb-6">Expenses by Category</h3>
      <div className="flex-1 relative w-full h-full min-h-[220px]">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹ ${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)' }}
                itemStyle={{ color: 'var(--text-secondary)' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}