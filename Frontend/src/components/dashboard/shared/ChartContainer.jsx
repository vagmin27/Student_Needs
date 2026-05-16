import React from "react";
import { ResponsiveContainer } from "recharts";
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
