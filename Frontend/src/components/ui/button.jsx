import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-sm border border-transparent hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        primary: "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover shadow-sm border border-transparent hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5",
        destructive: "bg-btn-danger text-btn-danger-text hover:bg-btn-danger-hover shadow-sm hover:-translate-y-0.5",
        danger: "bg-btn-danger text-btn-danger-text hover:bg-btn-danger-hover shadow-sm hover:-translate-y-0.5",
        success: "bg-btn-success text-btn-success-text hover:bg-btn-success-hover shadow-sm hover:-translate-y-0.5",
        warning: "bg-btn-warning text-btn-warning-text hover:bg-btn-warning-hover shadow-sm hover:-translate-y-0.5",
        outline: "border border-[var(--border-color)] bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover shadow-sm hover:-translate-y-0.5",
        secondary: "bg-btn-secondary text-btn-secondary-text hover:bg-btn-secondary-hover border border-[var(--border-color)] shadow-sm hover:-translate-y-0.5",
        ghost: "bg-transparent text-btn-ghost-text hover:bg-btn-ghost-hover hover:text-btn-ghost-hover-text",
        link: "bg-transparent text-[var(--link-color)] underline-offset-4 hover:underline hover:text-[var(--link-hover)]",
        glass: "bg-white/5 backdrop-blur-md text-btn-secondary-text border border-[var(--border-color)] hover:bg-btn-secondary-hover hover:-translate-y-0.5",
        gradient: "bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5",
        student: "bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-md hover:shadow-lg hover:-translate-y-0.5",
        verifier: "bg-[#10B981] text-white hover:bg-[#059669] shadow-md hover:shadow-lg hover:-translate-y-0.5",
        alumni: "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] shadow-md hover:shadow-lg hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-[var(--radius-sm)] px-3 text-xs",
        lg: "h-12 rounded-[var(--radius-md)] px-8 text-base",
        xl: "h-14 rounded-[var(--radius-md)] px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button"
  
  if (asChild) {
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current shrink-0" />
      ) : LeftIcon ? (
        <span className="mr-2 text-current flex items-center justify-center shrink-0">
          {React.isValidElement(LeftIcon) ? LeftIcon : <LeftIcon className="w-4 h-4" />}
        </span>
      ) : null}
      {children}
      {!isLoading && RightIcon && (
        <span className="ml-2 text-current flex items-center justify-center shrink-0">
          {React.isValidElement(RightIcon) ? RightIcon : <RightIcon className="w-4 h-4" />}
        </span>
      )}
    </Comp>
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
