/**
 * Centralized presentation-independent helper for expense statuses and priority levels.
 */
export function getExpenseStatus(status, nextDateStr = null, isActive = true) {
  if (!isActive) {
    return {
      label: "Paused",
      badgeVariant: "secondary",
      iconVariant: "muted",
      progressVariant: "neutral"
    };
  }

  let calculatedStatus = status;
  if (nextDateStr) {
    const diff = new Date(nextDateStr) - new Date();
    if (diff < 0) {
      calculatedStatus = "Overdue";
    } else if (diff < 86400000 * 3) {
      calculatedStatus = "Upcoming";
    } else {
      calculatedStatus = "Active";
    }
  }

  const normalized = (calculatedStatus || "").toLowerCase();

  switch (normalized) {
    case "overdue":
    case "critical":
      return {
        label: calculatedStatus || "Overdue",
        badgeVariant: "destructive",
        iconVariant: "danger",
        progressVariant: "destructive"
      };
    case "due today":
    case "upcoming":
    case "high":
      return {
        label: calculatedStatus || "Upcoming",
        badgeVariant: "warning",
        iconVariant: "warning",
        progressVariant: "warning"
      };
    case "active":
    case "medium":
    case "success":
    case "paid":
      return {
        label: calculatedStatus || "Active",
        badgeVariant: "success",
        iconVariant: "success",
        progressVariant: "success"
      };
    default:
      return {
        label: calculatedStatus || "Normal",
        badgeVariant: "outline",
        iconVariant: "info",
        progressVariant: "default"
      };
  }
}
