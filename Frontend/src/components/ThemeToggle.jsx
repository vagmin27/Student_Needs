import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/useTheme.js";
import { cn } from "@/lib/utils";

export const ThemeToggle = ({ className }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "relative flex items-center p-1 rounded-full select-none transition-all duration-300 ease-out hover:scale-[1.02]",
        "w-[136px] h-10 bg-[var(--bg-nav-container)] border border-[var(--border-color)] shadow-sm",
        className
      )}
      role="radiogroup"
      aria-label="Theme preference"
    >
      {/* Slider Knob */}
      <div
        className={cn(
          "absolute left-1 top-1 bottom-1 w-10 rounded-full bg-[var(--bg-tertiary)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-[var(--border-color)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center pointer-events-none",
          theme === "light"
            ? "translate-x-0"
            : theme === "system"
            ? "translate-x-[44px]"
            : "translate-x-[88px]"
        )}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      </div>

      {/* Light */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("light");
        }}
        className="flex items-center justify-center w-10 h-8 z-10 transition-colors duration-300 cursor-pointer focus:outline-none"
        role="radio"
        aria-checked={theme === "light"}
        title="Light Mode"
      >
        <Sun
          className={cn(
            "w-4.5 h-4.5 transition-all duration-300",
            theme === "light"
              ? "text-amber-500 scale-110 opacity-100"
              : "text-slate-400 dark:text-slate-500 scale-95 opacity-50 hover:opacity-80"
          )}
        />
      </button>

      {/* System */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("system");
        }}
        className="flex items-center justify-center w-10 h-8 z-10 transition-colors duration-300 cursor-pointer focus:outline-none"
        role="radio"
        aria-checked={theme === "system"}
        title="System Preference"
      >
        <Laptop
          className={cn(
            "w-4.5 h-4.5 transition-all duration-300",
            theme === "system"
              ? "text-[var(--primary)] dark:text-[var(--nav-accent)] scale-110 opacity-100"
              : "text-slate-400 dark:text-slate-500 scale-95 opacity-50 hover:opacity-80"
          )}
        />
      </button>

      {/* Dark */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("dark");
        }}
        className="flex items-center justify-center w-10 h-8 z-10 transition-colors duration-300 cursor-pointer focus:outline-none"
        role="radio"
        aria-checked={theme === "dark"}
        title="Dark Mode"
      >
        <Moon
          className={cn(
            "w-4.5 h-4.5 transition-all duration-300",
            theme === "dark"
              ? "text-[var(--primary)] dark:text-[var(--nav-accent)] scale-110 opacity-100"
              : "text-slate-400 dark:text-slate-500 scale-95 opacity-50 hover:opacity-80"
          )}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;