/**
 * Centralized presentation-independent helper for expense categories.
 */
export function getExpenseCategory(category) {
  const normalized = (category || "").toLowerCase();

  switch (normalized) {
    case "grocery":
    case "mess fees":
    case "food":
      return {
        label: category || "Food",
        icon: "food",
        badgeVariant: "success",
        chartVariant: "success"
      };
    case "vehicle":
    case "travel":
    case "transportation":
      return {
        label: category || "Travel",
        icon: "travel",
        badgeVariant: "info",
        chartVariant: "info"
      };
    case "shopping":
    case "fun":
      return {
        label: category || "Shopping",
        icon: "shopping",
        badgeVariant: "warning",
        chartVariant: "warning"
      };
    case "tuition fees":
    case "books":
    case "healthcare":
      return {
        label: category || "Education",
        icon: "education",
        badgeVariant: "default",
        chartVariant: "primary"
      };
    case "internet":
    case "mobile recharge":
    case "subscriptions":
      return {
        label: category || "Utilities",
        icon: "utilities",
        badgeVariant: "secondary",
        chartVariant: "accent"
      };
    case "hostel fees":
      return {
        label: category || "Hostel",
        icon: "hostel",
        badgeVariant: "outline",
        chartVariant: "secondary"
      };
    default:
      return {
        label: category || "Other",
        icon: "other",
        badgeVariant: "outline",
        chartVariant: "secondary"
      };
  }
}
