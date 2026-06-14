import React from "react";
import { ResponsiveContainer, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";

export const ChartContainer = React.memo(({ children, height = 300, minHeight = 250, className }) => {
  return (
    <div 
      className={cn("w-full", className)} 
      style={{ height, minHeight }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
});

export const ChartGrid = (props) => (
  <CartesianGrid
    strokeDasharray="3 3"
    stroke="var(--border-color)"
    opacity={0.3}
    vertical={false}
    {...props}
  />
);

export const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-3 rounded-[var(--radius-sm)] shadow-[var(--shadow-md)] backdrop-blur-md z-50">
        {label && <p className="text-xs font-semibold text-[var(--text-primary)] mb-1.5">{label}</p>}
        <div className="space-y-1">
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color || item.fill }} />
              <span className="text-[var(--text-secondary)]">{item.name}:</span>
              <span className="font-bold text-[var(--text-primary)]">
                {formatter ? formatter(item.value, item.name, item) : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const chartColors = {
  primary: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
  neutral: "var(--text-muted)"
};

export default ChartContainer;
