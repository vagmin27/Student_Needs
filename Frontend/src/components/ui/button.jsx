import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-sm border border-transparent hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        primary: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-sm border border-transparent hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        destructive: "bg-btn-danger text-btn-danger-text hover:bg-btn-danger-hover shadow-sm hover:-translate-y-0.5",
        success: "bg-btn-success text-btn-success-text hover:bg-btn-success-hover shadow-sm hover:-translate-y-0.5",
        warning: "bg-btn-warning text-btn-warning-text hover:bg-btn-warning-hover shadow-sm hover:-translate-y-0.5",
        outline: "border border-[var(--border-color)] bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover shadow-sm hover:-translate-y-0.5",
        secondary: "bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover border border-[var(--border-color)] shadow-sm hover:-translate-y-0.5",
        ghost: "bg-transparent text-btn-ghost-text hover:bg-btn-ghost-hover hover:text-btn-ghost-hover-text",
        link: "bg-transparent text-[var(--link-color)] underline-offset-4 hover:underline hover:text-[var(--link-hover)]",
        glass: "bg-white/5 backdrop-blur-md text-btn-secondary-text border border-[var(--border-color)] hover:bg-btn-secondary-hover hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-md)] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

const PrimaryButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} variant="primary" className={className} {...props} />
))
PrimaryButton.displayName = "PrimaryButton"

const SecondaryButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} variant="secondary" className={className} {...props} />
))
SecondaryButton.displayName = "SecondaryButton"

const GhostButton = React.forwardRef(({ className, ...props }, ref) => (
  <Button ref={ref} variant="ghost" className={className} {...props} />
))
GhostButton.displayName = "GhostButton"

export { Button, buttonVariants, PrimaryButton, SecondaryButton, GhostButton }
