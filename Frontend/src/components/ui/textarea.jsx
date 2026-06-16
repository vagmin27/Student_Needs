import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, error, helperText, ...props }, ref) => {
  return (
    <div className="relative w-full flex flex-col gap-1.5">
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[100px] w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-all placeholder:text-[var(--text-muted)]/60 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
          error && "border-[var(--danger)] focus-visible:ring-[var(--danger)]/10 focus-visible:border-[var(--danger)]",
          className
        )}
        {...props}
      />
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
Textarea.displayName = "Textarea"

export { Textarea }
