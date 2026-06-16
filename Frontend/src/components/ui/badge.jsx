import React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent)] text-white hover:opacity-90",
        secondary:
          "border-transparent bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]",
        destructive:
          "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20 hover:opacity-90",
        danger:
          "bg-[var(--danger-bg)] text-[var(--danger)] border-[var(--danger)]/20 hover:opacity-90",
        success:
          "bg-[var(--success-bg)] text-[var(--success)] border-[var(--success)]/20 hover:opacity-90",
        warning:
          "bg-[var(--warning-bg)] text-[var(--warning)] border-[var(--warning)]/20 hover:opacity-90",
        info:
          "bg-[var(--info-bg)] text-[var(--info)] border-[var(--info)]/20 hover:opacity-90",
        neutral:
          "bg-[var(--neutral-bg)] text-[var(--text-secondary)] border-[var(--border-color)]",
        outline: "border-[var(--border-color)] text-[var(--text-primary)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
