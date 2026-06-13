import React, { useEffect, useState, useRef } from "react";
import { motion, animate } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "premium-dashboard-card flex flex-col h-full relative overflow-hidden",
        hoverEffect && "cursor-pointer",
        gradient && "bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-secondary)]",
        className
      )}
      {...props}
    >
      {/* Subtle radial glow background if requested */}
      {glow && (
        <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none z-0" />
      )}
      
      {(title || description || action) && (
        <div className="pb-4 flex flex-row items-start justify-between z-10">
          <div className="flex flex-col gap-y-1">
            {title && (
              <h3 className="section-title text-foreground tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground description-text">
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
        "glass-panel relative overflow-hidden",
        hoverEffect && "hover:translate-y-[-4px] hover:scale-[1.01] hover:border-[var(--primary)] hover:shadow-[var(--elevation-3)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
GlassPanel.displayName = "GlassPanel";

// 3. SectionHeader Component
export const SectionHeader = ({
  title,
  description,
  badge,
  action,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex flex-row items-center justify-between pb-4 border-b border-border/40 mb-6", className)} {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <h2 className="section-title text-foreground tracking-tight">
            {title}
          </h2>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground description-text">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// 4. PremiumButton Component
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
  const baseStyles = "btn font-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:scale-[0.98]";
  
  const variants = {
    default: "btn-primary",
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "btn-ghost",
    destructive: "btn-danger",
    danger: "btn-danger",
    success: "btn-success",
    glass: "bg-white/5 backdrop-blur-md text-foreground border border-white/10 hover:bg-white/10",
  };

  const sizes = {
    default: "h-10 px-4",
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
        <LeftIcon className="w-4 h-4 mr-2 text-current" />
      ) : null}
      {children}
      {!isLoading && RightIcon && (
        <RightIcon className="w-4 h-4 ml-2 text-current" />
      )}
    </button>
  );
});
PremiumButton.displayName = "PremiumButton";

// 5. PremiumInput Component
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
          <LeftIcon className="absolute left-3.5 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-[var(--bg-secondary)] px-3.5 py-2.5 text-sm transition-all placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/10 disabled:cursor-not-allowed disabled:opacity-50",
            LeftIcon && "pl-11",
            RightIcon && "pr-11",
            error && "border-red-500 focus-visible:ring-red-500/10 focus-visible:border-red-500",
            className
          )}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3.5 h-4.5 w-4.5 text-muted-foreground flex items-center justify-center">
            {RightIcon}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs font-medium text-red-500 px-1">
          {error}
        </span>
      )}
    </div>
  );
});
PremiumInput.displayName = "PremiumInput";

// 6. AnimatedCounter Component
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
    // Standardize to clean number representation
    const numericValue = typeof value === "number" 
      ? value 
      : parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
      
    const controls = animate(prevValueRef.current, numericValue, {
      duration,
      ease: [0.22, 1, 0.36, 1], // premium cubic bezier easing
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

// 7. EmptyState Component
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
      "flex flex-col items-center justify-center p-8 md:p-12 text-center border border-dashed border-border/60 rounded-[var(--radius-lg)] bg-white/[0.01] backdrop-blur-sm hover:border-[var(--primary)]/30 transition-all duration-300 group max-w-lg mx-auto w-full",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--primary)]/[0.03] border border-[var(--primary)]/10 flex items-center justify-center mb-5 text-muted-foreground group-hover:text-[var(--primary)] group-hover:scale-105 transition-all duration-300 shadow-sm">
          <Icon className="w-7 h-7 text-muted-foreground group-hover:text-[var(--primary)] transition-colors duration-300" />
        </div>
      )}
      <h4 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h4>
      {description && (
        <p className="text-sm text-muted-foreground description-text mb-6 max-w-md leading-relaxed">
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

// 8. PageLayout Component
export const PageLayout = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full py-md px-md md:px-lg flex flex-col gap-lg max-w-[1600px] mx-auto", className)} {...props}>
      {children}
    </div>
  );
};

// 9. ContentContainer Component
export const ContentContainer = ({ children, className, ...props }) => {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-sm sm:px-md md:px-lg", className)} {...props}>
      {children}
    </div>
  );
};

// 10. SectionContainer Component
export const SectionContainer = ({ children, className, ...props }) => {
  return (
    <section className={cn("space-y-md md:space-y-lg py-sm md:py-md", className)} {...props}>
      {children}
    </section>
  );
};

// 11. DashboardGrid Component
export const DashboardGrid = ({ children, className, cols = 3, ...props }) => {
  return (
    <div 
      className={cn(
        "grid grid-cols-1 gap-md md:gap-lg",
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

// 12. CardGrid Component
export const CardGrid = ({ children, className, ...props }) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-sm md:gap-md", className)} {...props}>
      {children}
    </div>
  );
};
