import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-sm)] border border-[var(--border-color)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text-primary)] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/30 focus-visible:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const PremiumInput = React.forwardRef(({
  className,
  type = "text",
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  error,
  ...props
}, ref) => {
  return (
    <div className="relative w-full flex flex-col gap-1.5">
      <div className="relative flex items-center w-full">
        {LeftIcon && (
          <div className="absolute left-3.5 h-5 w-5 text-[var(--text-muted)] pointer-events-none flex items-center justify-center">
            {React.isValidElement(LeftIcon) ? LeftIcon : <LeftIcon className="w-4 h-4" />}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-all placeholder:text-[var(--text-muted)]/60 focus-visible:outline-none focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/10 disabled:cursor-not-allowed disabled:opacity-50",
            LeftIcon && "pl-11",
            RightIcon && "pr-11",
            error && "border-[var(--danger)] focus-visible:ring-[var(--danger)]/10 focus-visible:border-[var(--danger)]",
            className
          )}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3.5 h-5 w-5 text-[var(--text-muted)] flex items-center justify-center">
            {React.isValidElement(RightIcon) ? RightIcon : <RightIcon className="w-4 h-4" />}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-[var(--danger)] px-1">
          {error}
        </span>
      )}
    </div>
  )
})
PremiumInput.displayName = "PremiumInput"

export { Input, PremiumInput }
