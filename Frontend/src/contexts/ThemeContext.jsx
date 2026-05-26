import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export const THEME_STORAGE_KEY = "student-needs-theme";

const ThemeContext = createContext(undefined);

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark" || saved === "system") return saved;

  const legacy = localStorage.getItem("theme");
  if (legacy === "light" || legacy === "dark" || legacy === "system") return legacy;

  return "system";
};

const applyThemeToDocument = (theme) => {
  const root = document.documentElement;
  let resolved = theme;
  
  if (theme === "system") {
    resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  
  const isDark = resolved === "dark";

  root.classList.remove("light", "dark", "light-theme", "dark-theme");
  root.classList.add(isDark ? "dark" : "light");
  root.classList.add(isDark ? "dark-theme" : "light-theme");
  root.setAttribute("data-theme", resolved);
  root.style.colorScheme = resolved;

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  localStorage.setItem("theme", theme);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => {
        applyThemeToDocument("system");
      };
      // For cross-browser compatibility with older devices
      if (media.addEventListener) {
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
      } else if (media.addListener) {
        media.addListener(listener);
        return () => media.removeListener(listener);
      }
    }
  }, [theme]);

  const resolvedTheme = useMemo(() => {
    if (theme !== "system") return theme;
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, [theme]);

  const setTheme = useCallback((next) => {
    setThemeState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return resolved === "light" || resolved === "dark" || resolved === "system" ? resolved : "dark";
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const resolved = prev === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : prev;
      return resolved === "dark" ? "light" : "dark";
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isDark: resolvedTheme === "dark",
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

/* Apply saved theme before React paint to avoid flash */
if (typeof document !== "undefined") {
  applyThemeToDocument(getInitialTheme());
}
