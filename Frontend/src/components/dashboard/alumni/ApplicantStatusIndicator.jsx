import React from "react";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP = {
  "Pending": { variant: "outline", label: "Pending Review" },
  "Shortlisted": { variant: "default", label: "Shortlisted" },
  "Referred": { variant: "success", label: "Referred" },
  "Rejected": { variant: "destructive", label: "Rejected" },
  "Active": { variant: "success", label: "Active" },
  "Closed": { variant: "secondary", label: "Closed" },
  "Draft": { variant: "outline", label: "Draft" },
};

export const ApplicantStatusIndicator = React.memo(({ status, className }) => {
  const mapping = STATUS_MAP[status] || { variant: "outline", label: status };

  return (
    <Badge variant={mapping.variant} className={className}>
      {mapping.label}
    </Badge>
  );
});
