import React from "react";
import { cn } from "@/lib/utils";

export const EmptyState = React.memo(({ icon: Icon, title, description, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[200px] h-full", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 text-muted-foreground">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
});
