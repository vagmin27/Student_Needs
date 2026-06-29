import React from "react";
import { Skeleton } from "../ui/skeleton";

/**
 * Standard Dashboard Loading view.
 */
export const DashboardLoading = () => (
  <div className="p-6 space-y-6 w-full animate-pulse">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-1/4 rounded-[var(--radius-md)]" />
      <Skeleton className="h-10 w-24 rounded-[var(--radius-md)]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-32 w-full rounded-[var(--radius-md)]" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Skeleton className="h-96 w-full rounded-[var(--radius-md)]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-96 w-full rounded-[var(--radius-md)]" />
      </div>
    </div>
  </div>
);

/**
 * Standard Attendance Loading view.
 */
export const AttendanceLoading = () => (
  <div className="space-y-6 w-full animate-pulse">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-48 rounded-[var(--radius-md)]" />
      <Skeleton className="h-10 w-36 rounded-[var(--radius-md)]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
    </div>
    <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] p-4 space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-6 w-1/4 rounded-[var(--radius-sm)]" />
        <Skeleton className="h-6 w-1/4 rounded-[var(--radius-sm)]" />
        <Skeleton className="h-6 w-1/4 rounded-[var(--radius-sm)]" />
      </div>
      <hr className="border-[var(--border-color)]" />
      {Array.from({ length: 4 })?.map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton className="h-5 w-1/12 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-5 w-3/12 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-5 w-4/12 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-5 w-2/12 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-5 w-2/12 rounded-[var(--radius-sm)] ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Standard Expenses/FinTrack Loading view.
 */
export const ExpensesLoading = () => (
  <div className="space-y-6 w-full animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
      <Skeleton className="h-28 w-full rounded-[var(--radius-md)]" />
    </div>
    <div className="flex gap-4 items-center">
      <Skeleton className="h-10 w-1/3 rounded-[var(--radius-md)]" />
      <Skeleton className="h-10 w-24 rounded-[var(--radius-md)]" />
      <Skeleton className="h-10 w-24 rounded-[var(--radius-md)] ml-auto" />
    </div>
    <div className="border border-[var(--border-color)] rounded-[var(--radius-md)] p-4 space-y-4">
      {Array.from({ length: 5 })?.map((_, i) => (
        <div key={i} className="flex gap-6 items-center">
          <Skeleton className="h-6 w-16 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-6 w-40 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-6 w-24 rounded-[var(--radius-sm)]" />
          <Skeleton className="h-6 w-20 rounded-[var(--radius-sm)] ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * Standard Referrals Loading view.
 */
export const ReferralsLoading = () => (
  <div className="space-y-6 w-full animate-pulse">
    <div className="flex gap-4">
      <Skeleton className="h-10 w-2/3 rounded-[var(--radius-md)]" />
      <Skeleton className="h-10 w-1/3 rounded-[var(--radius-md)]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 })?.map((_, i) => (
        <div key={i} className="border border-[var(--border-color)] p-5 rounded-[var(--radius-lg)] space-y-4">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-1/2 rounded-[var(--radius-sm)]" />
            <Skeleton className="h-6 w-16 rounded-[var(--radius-sm)]" />
          </div>
          <Skeleton className="h-4 w-full rounded-[var(--radius-sm)]" />
          <Skeleton className="h-4 w-3/4 rounded-[var(--radius-sm)]" />
          <div className="flex gap-4 justify-between items-center pt-2">
            <Skeleton className="h-8 w-24 rounded-[var(--radius-md)]" />
            <Skeleton className="h-5 w-24 rounded-[var(--radius-sm)]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
