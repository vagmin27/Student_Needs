import React from "react";
import { EmptyState } from "../shared/EmptyState";
import { Activity, CheckCircle2, XCircle, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const BookingActivityTimeline = React.memo(({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <EmptyState 
        icon={Activity} 
        title="No Recent Activity" 
        description="Your booking timeline is currently empty." 
      />
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      <div className="flex flex-col gap-0 border-transparent">
        {activities?.map((activity, index) => {
          let formattedDate = activity.timestamp;
          try {
            const dateObj = new Date(activity.timestamp);
            if (!isNaN(dateObj.getTime())) {
              const datePart = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
              }).format(dateObj);
              const timePart = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }).format(dateObj);
              formattedDate = `${datePart} • ${timePart}`;
            }
          } catch (e) {
            // fallback to original if parsing fails
          }

          return (
            <div key={activity.id || index} className="flex items-start gap-4 py-3 hover:bg-muted/30 transition-colors px-2 rounded-md">
              <div className="mt-1 flex-shrink-0">
                <div className={`timeline-status-dot ${activity.color || 'text-[var(--primary)]'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{activity.title}</p>
                <div className="flex flex-col mt-0.5">
                  <span className="text-sm font-semibold text-foreground">
                    {activity.subject || "Session"}
                  </span>
                  <span className="text-sm text-muted-foreground truncate">
                    {activity.summary || activity.subtitle || activity.description}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap pt-0.5">
                {formattedDate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
