import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils"; // assuming utility exists or we'll adjust

function DashboardCardComponent({
  onClick,
  children,
  className,
  title,
  description,
  contentClassName,
  ...props
}) {
  return (
    <Card 
      onClick={(e) => {
        if (onClick) {
          console.log("DashboardCard clicked");
          onClick(e);
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "hover:border-primary/50 transition-colors flex flex-col h-full", 
        onClick && "cursor-pointer hover:shadow-md pointer-events-auto outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", 
        className
      )}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          console.log("DashboardCard clicked (keyboard)");
          onClick(e);
        }
      }}
      {...props}
    >
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
}

export const DashboardCard = React.memo(DashboardCardComponent);
