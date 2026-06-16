import React from "react";
import { Skeleton } from "./skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 w-full h-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
        <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
        <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-[var(--radius-md)]" />
        </div>
        <div>
          <Skeleton className="h-96 w-full rounded-[var(--radius-md)]" />
        </div>
      </div>
    </div>
  );
}
