import React from "react"
import { cn } from "../../lib/utils"

export const FormGroup = ({ children, className, ...props }) => {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full mb-space-md", className)} {...props}>
      {children}
    </div>
  )
}

export const FormLabel = ({ children, required, className, ...props }) => {
  return (
    <label
      className={cn(
        "block font-semibold text-sm text-[var(--text-primary)] select-none mb-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[var(--danger)] ml-1" aria-hidden="true">*</span>}
    </label>
  )
}

export const FormHelperText = ({ children, className, ...props }) => {
  return (
    <p
      className={cn("text-xs text-[var(--text-muted)] font-medium px-1 mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export const FormErrorMessage = ({ children, className, ...props }) => {
  if (!children) return null
  return (
    <p
      className={cn("text-xs font-semibold text-[var(--danger)] px-1 mt-0.5", className)}
      {...props}
    >
      {children}
    </p>
  )
}
