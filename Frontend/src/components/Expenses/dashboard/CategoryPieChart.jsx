import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { sortCategoryWise } from '../../../utils/Expenses/seperator';
import { ChartContainer, ChartTooltip } from '../../dashboard/shared/ChartContainer';
import { chartColors } from '../../../utils/chartPalette';

export function CategoryPieChart({ exdata }) {
  const categories = ['Grocery', 'Vehicle', 'Shopping', 'Travel', 'Food', 'Fun', 'Other'];
  const totalexp = sortCategoryWise(exdata, categories);

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
          <ChartContainer height="100%" minHeight={220}>
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
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={<ChartTooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />}
              />
              <Legend 
                layout="vertical" 
                verticalAlign="middle" 
                align="right"
                iconType="circle"
                wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}