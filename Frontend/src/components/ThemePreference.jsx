import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/useTheme.js";
import { cn } from "@/lib/utils";

/**
 * Theme preference control for settings pages.
 * Synced with navbar ThemeToggle via ThemeProvider.
 */
export const ThemePreference = ({
  title = "Theme Preference",
  description = "Choose how the platform looks. Applies to every module instantly.",
  className,
  variant = "card",
}) => {
  const { theme, setTheme } = useTheme();

  const options = [
    { id: "light", label: "Light Mode", icon: Sun, desc: "Clean modern dashboard" },
    { id: "system", label: "System Default", icon: Laptop, desc: "Sync with your device settings" },
    { id: "dark", label: "Dark Mode", icon: Moon, desc: "Premium neon cyber style" },
  ];

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center justify-between gap-4", className)}>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="flex rounded-[var(--radius-sm)] border border-border p-1 bg-secondary/50">
          {options.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
                theme === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-card p-4 sm:p-5 space-y-4",
        className,
      )}
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(({ id, label, icon: Icon, desc }) => {
          const active = theme === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-[var(--radius-md)] border-2 text-left transition-all duration-300",
                active
                  ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                  : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemePreference;
