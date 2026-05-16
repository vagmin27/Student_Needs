import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sortCategoryWise } from '../../../utils/Expenses/seperator';

export function CategoryPieChart({ exdata }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

  const COLORS = [
    'rgba(251, 146, 60, 0.8)',  // Orange
    'rgba(96, 165, 250, 0.8)',  // Blue
    'rgba(192, 132, 252, 0.8)', // Purple
    'rgba(129, 140, 248, 0.8)', // Indigo
    'rgba(251, 113, 133, 0.8)', // Rose
    'rgba(52, 211, 153, 0.8)',  // Emerald
    'rgba(148, 163, 184, 0.8)', // Slate
  ];

  const chartData = categories.map((cat, index) => ({
    name: cat,
    value: totalexp[index]
  })).filter(item => item.value > 0);

  const isEmpty = chartData.length === 0;

  return (
    <div className="glass-panel p-6 flex flex-col h-full min-h-[300px]">
      <h3 className="text-xl font-bold text-white mb-6">Expenses by Category</h3>
      <div className="flex-1 relative w-full h-full min-h-[220px]">
        {isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 text-sm">No data available</p>
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
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `₹ ${value.toLocaleString()}`}
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: 'none', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}