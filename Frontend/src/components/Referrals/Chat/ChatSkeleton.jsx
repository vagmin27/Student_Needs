import React from "react";

export function ChatSkeleton() {
  return (
    <div className="w-full h-full flex flex-col space-y-4 p-4 animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="h-10 bg-muted/40 rounded-[var(--radius-sm)] w-full border border-border/20" />
      
      {/* Active Chats List Skeleton */}
      <div className="space-y-3 flex-1 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-[var(--radius-md)] border border-border/10 bg-card/20"
          >
            {/* Avatar skeleton */}
            <div className="w-12 h-12 bg-muted/50 rounded-full flex-shrink-0" />
            
            {/* Details skeleton */}
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-muted/50 rounded w-1/3" />
                <div className="h-3 bg-muted/30 rounded w-12" />
              </div>
              <div className="h-3 bg-muted/40 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex-1 flex flex-col space-y-4 p-6 overflow-hidden animate-pulse">
      {[1, 2, 3, 4].map((i) => {
        const isRight = i % 2 === 0;
        return (
          <div
            key={i}
            className={`flex items-end gap-3 max-w-[75%] ${
              isRight ? "ml-auto flex-row-reverse" : "mr-auto"
            }`}
          >
            {/* Avatar skeleton */}
            {!isRight && <div className="w-8 h-8 bg-muted/40 rounded-full flex-shrink-0" />}
            
            {/* Bubble skeleton */}
            <div
              className={`rounded-[var(--radius-lg)] p-4 border border-border/10 ${
                isRight
                  ? "bg-primary/10 rounded-br-none"
                  : "bg-muted/30 rounded-bl-none"
              }`}
            >
              <div className="space-y-1.5 w-48 sm:w-64">
                <div className="h-3.5 bg-muted/50 rounded w-full" />
                <div className="h-3.5 bg-muted/40 rounded w-5/6" />
              </div>
              <div className={`h-2.5 bg-muted/30 rounded w-8 mt-2 ${isRight ? "ml-auto" : ""}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
