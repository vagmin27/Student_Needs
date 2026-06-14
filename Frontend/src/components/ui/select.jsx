import * as React from "react"
import { cn } from "../../lib/utils"

const Select = React.forwardRef(({ className, children, error, helperText, ...props }, ref) => {
  return (
    <div className="relative w-full flex flex-col gap-1.5">
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-all focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10",
            error && "border-[var(--danger)] focus-visible:ring-[var(--danger)]/10 focus-visible:border-[var(--danger)]",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-[var(--text-muted)] flex items-center justify-center h-5 w-5">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs font-medium text-[var(--danger)] px-1">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-[var(--text-muted)] px-1">
          {helperText}
        </span>
      )}
    </div>
  )
})
Select.displayName = "Select"

export { Select }
