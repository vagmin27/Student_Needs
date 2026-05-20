import React from "react";
import Skeleton from "../Expenses/ui/Skeleton";
import EmptyState from "../ui/EmptyState";
import { AlertCircle } from "lucide-react";

/**
 * AsyncStateWrapper standardizes how loading, error, and empty states are rendered
 * across the application, preventing boilerplate duplication.
 */
const AsyncStateWrapper = ({
  isLoading,
  isError,
  isEmpty,
  errorMessage = "Failed to load data.",
  emptyTitle = "No Data Found",
  emptyDescription = "There are no records to display at this time.",
  emptyAction,
  skeletonCount = 3,
  skeletonHeight = "h-20",
  children,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4 w-full">
        {Array.from({ length: skeletonCount })?.map((_, i) => (
          <Skeleton key={i} className={`w-full ${skeletonHeight} rounded-xl`} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6 border border-red-100 bg-red-50/30 rounded-xl flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <p className="text-sm text-red-600 font-medium">{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return <>{children}</>;
};

export default AsyncStateWrapper;
