import React from 'react';
import { cn } from '@/lib/utils.js';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Configuration for different resume and application statuses.
 * Defines the label, icon, and Tailwind styling for each state.
 */
const statusConfig = {
  unverified: {
    label: 'Unverified',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-info/10 text-info border-info/20',
  },
  shortlisted: {
    label: 'Shortlisted',
    icon: CheckCircle,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  referred: {
    label: 'Referred',
    icon: CheckCircle,
    className: 'bg-success/10 text-success border-success/20',
  },
};

/**
 * StatusBadge Component
 * A visual indicator for various student and application states.
 * * @param {Object} props
 * @param {string} props.status - The status key (e.g., 'verified', 'pending').
 * @param {string} [props.className] - Additional Tailwind classes.
 */
export function StatusBadge({ status, className }) {
  // Fallback to 'pending' or a null-safe object if status is missing
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border transition-colors',
        config.className,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}