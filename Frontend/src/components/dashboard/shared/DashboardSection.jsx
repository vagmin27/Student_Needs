import React from "react";
import { cn } from "@/lib/utils";

export const DashboardSection = React.memo(({ title, description, children, action, className }) => {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>
        {children}
      </div>
    </section>
  );
});
