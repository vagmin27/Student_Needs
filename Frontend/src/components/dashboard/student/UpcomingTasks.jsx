import React from "react";
import { EmptyState } from "../shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";

export const UpcomingTasks = React.memo(({ tasks = [] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <EmptyState 
        icon={CalendarClock} 
        title="All caught up!" 
        description="You have no upcoming tasks or assignments." 
      />
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-4">
      {tasks?.map((task) => (
        <div 
          key={task.id} 
          className="flex items-start justify-between p-3 sm:p-4 rounded-lg border border-border bg-secondary/40 hover:bg-secondary/70 transition-colors"
        >
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-sm sm:text-base text-foreground line-clamp-1">{task.title}</span>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span>{task.date}</span>
              <span>•</span>
              <span>{task.type}</span>
            </div>
          </div>
          <Badge variant={getPriorityColor(task.priority)} className="ml-2 shrink-0">
            {task.priority}
          </Badge>
        </div>
      ))}
    </div>
  );
});
