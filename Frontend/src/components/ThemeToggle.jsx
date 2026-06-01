import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme.js";
import { cn } from "@/lib/utils";

/**
 * Global theme toggle — sun (light) / moon (dark).
 * Use in any navbar; stays synced with ThemeProvider + settings.
 */
export const ThemeToggle = ({ className, size = "default" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses =
    size === "sm" ? "w-9 h-9" : size === "lg" ? "w-11 h-11" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={cn(
        "relative rounded-xl flex items-center justify-center transition-colors",
        "bg-secondary hover:bg-secondary/80 border border-border/50",
        "text-foreground shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "min-w-[40px] min-h-[40px]",
        sizeClasses,
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <span className="flex items-center justify-center w-full h-full">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : 180,
          }}
          transition={{ duration: 0.2 }}
          className="absolute text-slate-600 dark:text-slate-300"
        >
          <Moon className={iconSize} />
        </motion.div>
      </span>
      <span className="flex items-center justify-center w-full h-full">
        <motion.div
          initial={false}
          animate={{
            scale: !isDark ? 1 : 0,
            opacity: !isDark ? 1 : 0,
            rotate: !isDark ? 0 : -180,
          }}
          transition={{ duration: 0.2 }}
          className="absolute text-amber-500"
        >
          <Sun className={iconSize} />
        </motion.div>
      </span>
    </motion.button>
  );
};

export default ThemeToggle;
