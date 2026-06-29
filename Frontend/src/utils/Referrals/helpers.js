export function getReferralStatus(status) {
  const norm = (status || "").toLowerCase().trim();

  switch (norm) {
    case "unverified":
      return {
        label: "Unverified",
        badgeVariant: "warning",
        iconVariant: "clock",
        progressVariant: "warning"
      };
    case "pending":
      return {
        label: "Pending",
        badgeVariant: "warning",
        iconVariant: "clock",
        progressVariant: "warning"
      };
    case "applied":
      return {
        label: "Applied",
        badgeVariant: "info",
        iconVariant: "clock",
        progressVariant: "info"
      };
    case "verified":
      return {
        label: "Verified",
        badgeVariant: "success",
        iconVariant: "check",
        progressVariant: "success"
      };
    case "referred":
    case "accepted":
    case "approved":
      return {
        label: "Referred",
        badgeVariant: "success",
        iconVariant: "check",
        progressVariant: "success"
      };
    case "shortlisted":
      return {
        label: "Shortlisted",
        badgeVariant: "primary",
        iconVariant: "alert",
        progressVariant: "primary"
      };
    case "rejected":
      return {
        label: "Rejected",
        badgeVariant: "destructive",
        iconVariant: "x",
        progressVariant: "destructive"
      };
    default:
      return {
        label: status || "Unknown",
        badgeVariant: "outline",
        iconVariant: "clock",
        progressVariant: "default"
      };
  }
}
