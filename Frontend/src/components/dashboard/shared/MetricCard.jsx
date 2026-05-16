import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const MetricCard = React.memo(({ title, value, subtext, icon: Icon, iconClassName, trend, trendValue }) => {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend === 'up' ? "text-emerald-500" : trend === 'down' ? "text-red-500" : "text-slate-500"
                )}>
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''} {trendValue}
                </span>
              )}
            </div>
            {subtext && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtext}
              </p>
            )}
          </div>
          {Icon && (
            <div className={cn("p-3 rounded-xl bg-primary/10 text-primary shrink-0", iconClassName)}>
              <Icon className="w-5 h-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});
