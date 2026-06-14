import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(undefined);

export const THEME_STORAGE_KEY = "student-needs-theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((newTheme) => {
    const nextTheme = typeof newTheme === "function" ? newTheme(theme) : newTheme;
    if (nextTheme === "light" || nextTheme === "dark") {
      setThemeState(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      
      const root = document.documentElement;
      root.setAttribute("data-theme", nextTheme);
      if (nextTheme === "dark") {
        root.classList.add("dark", "dark-theme");
        root.classList.remove("light", "light-theme");
      } else {
        root.classList.add("light", "light-theme");
        root.classList.remove("dark", "dark-theme");
      }
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setTheme]);

  // Synchronize on mounts/changes
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark", "dark-theme");
      root.classList.remove("light", "light-theme");
    } else {
      root.classList.add("light", "light-theme");
      root.classList.remove("dark", "dark-theme");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  ontext === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
