import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(undefined);

export const THEME_STORAGE_KEY = "student-needs-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }
  return "system";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  const applyTheme = useCallback((activeTheme) => {
    const root = document.documentElement;
    root.setAttribute("data-theme", activeTheme);
    if (activeTheme === "dark") {
      root.classList.add("dark", "dark-theme");
      root.classList.remove("light", "light-theme");
    } else {
      root.classList.add("light", "light-theme");
      root.classList.remove("dark", "dark-theme");
    }
  }, []);

  const setTheme = useCallback((newTheme) => {
    const nextTheme = typeof newTheme === "function" ? newTheme(theme) : newTheme;
    if (nextTheme === "light" || nextTheme === "dark" || nextTheme === "system") {
      setThemeState(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return isDark ? "light" : "dark";
      }
      return prev === "dark" ? "light" : "dark";
    });
  }, [setTheme]);

  // Synchronize theme configuration and media listeners
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = (e) => {
        applyTheme(e.matches ? "dark" : "light");
      };
      
      // Apply initial theme based on system preference
      applyTheme(mediaQuery.matches ? "dark" : "light");
      
      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () => {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      };
    } else {
      applyTheme(theme);
    }
  }, [theme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
