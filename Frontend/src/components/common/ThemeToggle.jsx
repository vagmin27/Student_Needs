import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative flex items-center justify-center p-2 rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nav-accent)] focus-visible:ring-offset-2 transition-all duration-300",
        "w-10 h-10 bg-[var(--bg-surface-2)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface-3)] shadow-sm",
        className
      )}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={cn(
            "w-5 h-5 absolute transition-all duration-500 transform text-amber-500",
            theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
        {/* Moon Icon */}
        <Moon
          className={cn(
            "w-5 h-5 absolute transition-all duration-500 transform text-[var(--nav-accent)]",
            theme === "light" ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
