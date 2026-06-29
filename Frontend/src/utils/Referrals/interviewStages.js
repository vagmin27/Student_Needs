export function getInterviewStage(stage) {
  const norm = (stage || "").toLowerCase().trim();

  switch (norm) {
    case "applied":
    case "resume_screen":
    case "resume screen":
      return {
        label: "Resume Screen",
        badgeVariant: "outline",
        progressVariant: "secondary",
        order: 1
      };
    case "screening":
    case "hr_screen":
    case "hr screen":
      return {
        label: "Screening",
        badgeVariant: "info",
        progressVariant: "info",
        order: 2
      };
    case "technical":
    case "technical_interview":
    case "technical interview":
      return {
        label: "Technical Round",
        badgeVariant: "primary",
        progressVariant: "primary",
        order: 3
      };
    case "managerial":
    case "manager_round":
    case "manager round":
      return {
        label: "Managerial Round",
        badgeVariant: "warning",
        progressVariant: "warning",
        order: 4
      };
    case "hr":
    case "hr_round":
    case "hr round":
      return {
        label: "HR Round",
        badgeVariant: "warning",
        progressVariant: "warning",
        order: 5
      };
    case "offered":
    case "offer":
    case "hired":
      return {
        label: "Offered",
        badgeVariant: "success",
        progressVariant: "success",
        order: 6
      };
    default:
      return {
        label: stage || "Pending Review",
        badgeVariant: "outline",
        progressVariant: "default",
        order: 0
      };
  }
}
