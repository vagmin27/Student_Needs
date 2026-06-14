import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm transition-all duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-[var(--text-primary)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--text-muted)]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// PremiumCard variant
const PremiumCard = React.forwardRef(({
  children,
  className,
  title,
  description,
  action,
  glow = true,
  hoverEffect = true,
  ...props
}, ref) => {
  return (
    <Card
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-secondary)] border-[var(--border-color)]",
        hoverEffect && "hover:border-[var(--accent)] hover:shadow-[var(--shadow-glow)]",
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none z-0" />
      )}
      {(title || description || action) && (
        <CardHeader className="pb-4 flex flex-row items-start justify-between z-10 relative">
          <div className="flex flex-col gap-y-1">
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className="z-10 relative flex-1">
        {children}
      </CardContent>
    </Card>
  )
})
PremiumCard.displayName = "PremiumCard"

// GlassCard variant
const GlassCard = React.forwardRef(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-[var(--border-color)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
      className
    )}
    {...props}
  />
))
GlassCard.displayName = "GlassCard"

// MetricCard variant
const MetricCard = React.forwardRef(({
  className,
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  ...props
}, ref) => {
  return (
    <PremiumCard ref={ref} className={className} glow={false} {...props}>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{value}</h2>
            {trend && (
              <span className={cn(
                "text-xs font-semibold px-2 py-0.5 rounded-full",
                trend === "up" ? "bg-[var(--success-bg)] text-[var(--success)]" : "bg-[var(--danger-bg)] text-[var(--danger)]"
              )}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-[var(--text-muted)]">
              {subtext}
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] shrink-0 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </PremiumCard>
  )
})
MetricCard.displayName = "MetricCard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PremiumCard,
  GlassCard,
  MetricCard
}
