import React, { useEffect, useState, useRef } from "react";
import { motion, animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetricCard } from "../../ui/card";

// Re-export MetricCard and alias as StatCard
export { MetricCard };
export const StatCard = MetricCard;

// 1. PremiumCard Component
export const PremiumCard = React.forwardRef(({
  children,
  className,
  title,
  description,
  action,
  onClick,
  hoverEffect = true,
  glow = false,
  gradient = false,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick(e);
        }
      }}
      className={cn(
        "premium-card rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-primary)] shadow-sm flex flex-col h-full relative overflow-hidden",
        hoverEffect && "cursor-pointer",
        gradient && "bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-secondary)]",
        className
      )}
      {...props}
    >
      {/* Subtle radial glow background if requested */}
      {glow && (
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[var(--accent)]/10 blur-3xl pointer-events-none z-0" />
      )}
      
      {(title || description || action) && (
        <div className="pb-4 flex flex-row items-start justify-between z-10 border-b border-[var(--border-color)] mb-4">
          <div className="flex flex-col gap-y-1">
            {title && (
              <h3 className="text-base font-semibold leading-none tracking-tight text-[var(--text-primary)]">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)] description-text">
                {description}
              </p>
            )}
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col z-10">
        {children}
      </div>
    </motion.div>
  );
});
PremiumCard.displayName = "PremiumCard";

// 2. GlassPanel Component
export const GlassPanel = React.forwardRef(({
  children,
  className,
  hoverEffect = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--border-color)] rounded-[var(--radius-md)] relative overflow-hidden",
        hoverEffect && "hover:translate-y-[-4px] hover:scale-[1.01] hover:border-[var(--accent)] hover:shadow-md transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
GlassPanel.displayName = "GlassPanel";

// 3. DashboardHeader (Step 4 standard)
export const DashboardHeader = ({
  title,
  description,
  badge,
  action,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between pb-space-md border-b border-[var(--border-color)] mb-space-lg gap-space-md w-full", className)} {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {title}
          </h1>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  );
};

// Keep legacy SectionHeader alias for compatibility
export const SectionHeader = DashboardHeader;

// 4. DashboardSection (Step 4 standard)
export const DashboardSection = ({
  title,
  description,
  action,
  children,
  className,
  ...props
}) => {
  return (
    <section className={cn("space-y-space-md w-full mb-space-xl", className)} {...props}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-sm">
          <div>
            {title && (
              <h2 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
};

// 5. AnalyticsCard (Step 4 standard)
export const AnalyticsCard = React.forwardRef(({
  title,
  description,
  action,
  children,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available",
  emptyIcon,
  className,
  ...props
}, ref) => {
  return (
    <PremiumCard
      ref={ref}
      title={title}
      description={description}
      action={action}
      className={className}
      glow={false}
      {...props}
    >
      <div className="relative w-full h-full min-h-[300px] flex flex-col justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--card-bg)]/80 z-20 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
          </div>
        )}
        {isEmpty && !isLoading ? (
          <EmptyState title="No analytics details" description={emptyMessage} icon={emptyIcon} />
        ) : (
          <div className="w-full flex-1 z-10 relative">
            {children}
          </div>
        )}
      </div>
    </PremiumCard>
  );
});
AnalyticsCard.displayName = "AnalyticsCard";

// 6. ActivityFeed (Step 4 standard)
export const ActivityFeed = ({ items, className, ...props }) => {
  return (
    <div className={cn("space-y-space-md", className)} {...props}>
      {items && items.length > 0 ? (
        items.map((item, idx) => (
          <div key={idx} className="flex gap-space-md items-start p-space-sm hover:bg-[var(--bg-secondary)]/50 rounded-[var(--radius-sm)] transition-all border-b border-[var(--border-color)]/30 last:border-0 pb-3">
            {item.icon && (
              <div className={cn("p-2 rounded-full shrink-0 flex items-center justify-center bg-[var(--accent)]/10 text-[var(--accent)]", item.iconClassName)}>
                {item.icon}
              </div>
            )}
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-space-md">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</p>
                {item.time && <span className="text-xs text-[var(--text-muted)] font-medium shrink-0">{item.time}</span>}
              </div>
              {item.description && <p className="text-xs text-[var(--text-secondary)]">{item.description}</p>}
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-[var(--text-muted)] text-center py-4">No recent activity.</p>
      )}
    </div>
  );
};

// 7. PremiumButton Component
export const PremiumButton = React.forwardRef(({
  children,
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-sm)]";
  
  const variants = {
    default: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border border-transparent shadow-sm",
    primary: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border border-transparent shadow-sm",
    secondary: "bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border border-[var(--border-color)]",
    outline: "border border-[var(--border-color)] bg-transparent hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]",
    ghost: "hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    destructive: "bg-[var(--danger)] text-white hover:opacity-90",
    danger: "bg-[var(--danger)] text-white hover:opacity-90",
    success: "bg-[var(--success)] text-white hover:opacity-90",
    glass: "bg-white/5 backdrop-blur-md text-[var(--text-primary)] border border-white/10 hover:bg-white/10",
  };

  const sizes = {
    default: "h-10 px-4 text-sm",
    sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)]",
    lg: "h-12 px-6 text-base rounded-[var(--radius-lg)]",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : LeftIcon ? (
        <span className="mr-2 text-current flex items-center justify-center">
          {React.isValidElement(LeftIcon) ? LeftIcon : <LeftIcon className="w-4 h-4" />}
        </span>
      ) : null}
      {children}
      {!isLoading && RightIcon && (
        <span className="ml-2 text-current flex items-center justify-center">
          {React.isValidElement(RightIcon) ? RightIcon : <RightIcon className="w-4 h-4" />}
        </span>
      )}
    </button>
  );
});
PremiumButton.displayName = "PremiumButton";

// 8. PremiumInput Component
export const PremiumInput = React.forwardRef(({
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
  );
});
PremiumInput.displayName = "PremiumInput";

// 9. AnimatedCounter Component
export const AnimatedCounter = ({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0
}) => {
  const [count, setCount] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const numericValue = typeof value === "number" 
      ? value 
      : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
      
    const controls = animate(prevValueRef.current, numericValue, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setCount(latest);
      }
    });
    
    prevValueRef.current = numericValue;
    return () => controls.stop();
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      {suffix}
    </span>
  );
};

// 10. EmptyState Component
export const EmptyState = React.memo(({
  icon: Icon,
  title = "No information found",
  description,
  actionLabel,
  onAction,
  className
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 md:p-12 text-center border border-dashed border-[var(--border-color)] rounded-[var(--radius-lg)] bg-[var(--bg-secondary)]/10 backdrop-blur-sm hover:border-[var(--accent)]/30 transition-all duration-300 group max-w-lg mx-auto w-full",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--accent)]/[0.03] border border-[var(--accent)]/10 flex items-center justify-center mb-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:scale-105 transition-all duration-300 shadow-sm">
          <Icon className="w-7 h-7 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors duration-300" />
        </div>
      )}
      <h4 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-[var(--text-muted)] description-text mb-6 max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <PremiumButton
          variant="outline"
          size="sm"
          onClick={onAction}
        >
          {actionLabel}
        </PremiumButton>
      )}
    </div>
  );
});
EmptyState.displayName = "EmptyState";

// 11. PageLayout Component
export const PageLayout = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full py-space-md px-space-md md:px-space-lg flex flex-col gap-space-lg max-w-[1600px] mx-auto", className)} {...props}>
      {children}
    </div>
  );
};

// 12. ContentContainer Component
export const ContentContainer = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-space-xs sm:px-space-sm md:px-space-md", className)} {...props}>
      {children}
    </div>
  );
};

// 13. SectionContainer Component
export const SectionContainer = ({ children, className, ...props }) => {
  return (
    <section className={cn("space-y-space-md md:space-y-space-lg py-space-xs md:py-space-md", className)} {...props}>
      {children}
    </section>
  );
};

// 14. DashboardGrid Component
export const DashboardGrid = ({ children, className, cols = 3, ...props }) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 gap-space-md md:gap-space-lg",
        cols === 2 && "md:grid-cols-2",
        cols === 3 && "md:grid-cols-2 lg:grid-cols-3",
        cols === 4 && "md:grid-cols-2 lg:grid-cols-4",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// 15. CardGrid Component
export const CardGrid = ({ children, className, ...props }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm md:gap-space-md", className)} {...props}>
      {children}
    </div>
  );
};
