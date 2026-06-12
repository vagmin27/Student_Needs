import React from "react";
import { EmptyState } from "../shared/EmptyState";
import { Inbox, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const RecentRequestsFeed = React.memo(({ requests = [], onAccept, onDecline }) => {
  if (!requests || requests.length === 0) {
    return (
      <EmptyState 
        icon={Inbox} 
        title="No Pending Requests" 
        description="You have caught up with all your booking requests." 
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests?.map((request) => (
        <div 
          key={request.id} 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-[var(--radius-sm)] border border-border bg-secondary/40 gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {request.avatar}
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm text-foreground">{request.studentName}</span>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{request.subject}</span>
                <span>•</span>
                <span>{request.date}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 sm:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
              onClick={() => onDecline && onDecline(request.id)}
              aria-label={`Decline request from ${request.studentName}`}
            >
              <X className="w-4 h-4 mr-1" /> Decline
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 sm:flex-none"
              onClick={() => onAccept && onAccept(request.id)}
              aria-label={`Accept request from ${request.studentName}`}
            >
              <Check className="w-4 h-4 mr-1" /> Accept
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
});
