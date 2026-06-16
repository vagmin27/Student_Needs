import React from "react";
import { cn } from "@/lib/utils";

// 1. Base Shimmer Element
export const Shimmer = ({ className, circle = false, height, width, ...props }) => {
  return (
    <div
      className={cn(
        "skeleton",
        circle && "rounded-full",
        className
      )}
      style={{
        height: height || undefined,
        width: width || undefined,
      }}
      {...props}
    />
  );
};

// 2. MetricCardSkeleton
export const MetricCardSkeleton = () => {
  return (
    <div className="premium-dashboard-card p-6 flex items-center justify-between space-x-4">
      <div className="flex-1 flex flex-col space-y-3">
        <Shimmer className="h-4 w-24 rounded" />
        <Shimmer className="h-8 w-32 rounded-[var(--radius-sm)]" />
        <Shimmer className="h-3 w-40 rounded" />
      </div>
      <Shimmer className="w-12 h-12 rounded-full shrink-0" />
    </div>
  );
};

// 3. CardSkeleton
export const CardSkeleton = ({ rows = 4 }) => {
  return (
    <div className="premium-dashboard-card p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-border/40">
        <div className="space-y-1.5 flex-1">
          <Shimmer className="h-5 w-40 rounded" />
          <Shimmer className="h-3 w-60 rounded" />
        </div>
        <Shimmer className="h-6 w-16 rounded" />
      </div>
      <div className="space-y-3 pt-2">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <Shimmer className="h-10 w-10 rounded-[var(--radius-md)] shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Shimmer className="h-4 w-3/4 rounded" />
              <Shimmer className="h-3 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. ChartSkeleton
export const ChartSkeleton = () => {
  return (
    <div className="premium-dashboard-card p-6 flex flex-col space-y-4">
      <div className="flex justify-between items-center pb-2">
        <div className="space-y-1.5">
          <Shimmer className="h-5 w-36 rounded" />
          <Shimmer className="h-3 w-56 rounded" />
        </div>
        <div className="flex space-x-2">
          <Shimmer className="h-8 w-16 rounded-[var(--radius-sm)]" />
          <Shimmer className="h-8 w-16 rounded-[var(--radius-sm)]" />
        </div>
      </div>
      <div className="h-64 w-full flex items-end justify-between pt-4 gap-2">
        <Shimmer className="h-1/4 w-full rounded-t" />
        <Shimmer className="h-2/4 w-full rounded-t" />
        <Shimmer className="h-3/4 w-full rounded-t" />
        <Shimmer className="h-1/2 w-full rounded-t" />
        <Shimmer className="h-5/6 w-full rounded-t" />
        <Shimmer className="h-2/3 w-full rounded-t" />
        <Shimmer className="h-1/3 w-full rounded-t" />
        <Shimmer className="h-4/5 w-full rounded-t" />
      </div>
    </div>
  );
};

// 5. ListSkeleton
export const ListSkeleton = ({ items = 5 }) => {
  return (
    <div className="premium-dashboard-card p-6 flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-2">
        <Shimmer className="h-5 w-40 rounded" />
        <Shimmer className="h-4 w-20 rounded" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: items }).map((_, idx) => (
          <div key={idx} className="flex items-center justify-between py-1">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Shimmer className="h-9 w-9 rounded-[var(--radius-md)] shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <Shimmer className="h-3.5 w-1/2 rounded" />
                <Shimmer className="h-3 w-1/4 rounded" />
              </div>
            </div>
            <Shimmer className="h-5 w-16 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Complete Dashboard Wide Skeleton
export const DashboardWideSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Welcome Hero Skeleton */}
      <div className="premium-dashboard-card p-8 min-h-[220px] flex flex-col justify-between overflow-hidden relative">
        <div className="space-y-3 max-w-lg z-10">
          <Shimmer className="h-8 w-2/3 rounded-[var(--radius-sm)]" />
          <Shimmer className="h-4.5 w-full rounded" />
          <Shimmer className="h-4.5 w-4/5 rounded" />
        </div>
        <div className="flex flex-wrap gap-3 mt-6 z-10">
          <Shimmer className="h-10 w-32 rounded-[var(--radius-md)]" />
          <Shimmer className="h-10 w-32 rounded-[var(--radius-md)]" />
          <Shimmer className="h-10 w-32 rounded-[var(--radius-md)]" />
        </div>
        {/* Glow orb simulation */}
        <div className="absolute right-10 bottom-0 w-52 h-52 rounded-full bg-[var(--primary)]/5 blur-3xl" />
      </div>

      {/* Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>

      {/* Large Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartSkeleton />
          <CardSkeleton rows={3} />
        </div>
        <div className="space-y-6">
          <ListSkeleton items={5} />
          <CardSkeleton rows={4} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWideSkeleton;
