/**
 * Helper to determine attendance status details based on the attendance percentage.
 * @param {number} percentage - The attendance percentage (0 to 100)
 * @returns {object} Status object containing label, variant, progressColor, and classes
 */
export const getAttendanceStatus = (percentage) => {
  const pct = Number(percentage) || 0;
  if (pct >= 75) {
    return {
      label: "Good",
      variant: "success",
      progressColor: "bg-emerald-500",
      badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
    };
  } else if (pct >= 60) {
    return {
      label: "Average",
      variant: "warning",
      progressColor: "bg-amber-500",
      badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
    };
  } else {
    return {
      label: "Low",
      variant: "destructive",
      progressColor: "bg-red-500",
      badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };
  }
};
