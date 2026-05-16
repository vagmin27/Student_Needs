import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // assuming utility exists or we'll adjust

export const DashboardCard = React.memo(({ title, description, children, className, contentClassName }) => {
  return (
    <Card className={cn("hover:border-primary/50 transition-colors flex flex-col h-full", className)}>
      {(title || description) && (
        <CardHeader className="pb-4">
          {title && <CardTitle className="text-lg">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={cn("flex-1", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
});
