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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'destructive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'info':
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
      <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6 pb-2">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative pl-6">
            <span className="absolute -left-2.5 top-1 bg-white dark:bg-slate-950 p-0.5 rounded-full ring-2 ring-white dark:ring-slate-950">
              {getStatusIcon(activity.status)}
            </span>
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                  {activity.title}
                </span>
                <span className="text-xs text-slate-500 shrink-0">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {activity.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
