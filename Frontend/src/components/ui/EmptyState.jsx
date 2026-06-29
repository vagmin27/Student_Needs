import React from 'react';
import { MdOutlineInbox } from 'react-icons/md';
import { cn } from "../../lib/utils";
import { Button } from "./button";

const EmptyState = ({ 
  icon: Icon = MdOutlineInbox, 
  title = "No Data Found", 
  message,
  description,
  actionLabel,
  onAction,
  action,
  className
}) => {
  const displayMessage = description || message || "There's nothing here yet. Try adjusting your filters or adding a new entry.";

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center border border-dashed border-[var(--border-color)] rounded-[var(--radius-md)] bg-[var(--bg-secondary)]/10 backdrop-blur-sm transition-all duration-300 max-w-lg mx-auto w-full group",
      className
    )}>
      <div className="w-16 h-16 bg-[var(--accent)]/[0.03] border border-[var(--accent)]/10 rounded-[var(--radius-md)] flex items-center justify-center mb-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:scale-105 transition-all duration-300 shadow-sm">
        <Icon className="w-7 h-7 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-300" />
      </div>
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
      <p className="text-sm text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
        {displayMessage}
      </p>
      {action && <div className="w-full flex justify-center">{action}</div>}
      {!action && actionLabel && onAction && (
        <Button 
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export { EmptyState };
export default EmptyState;