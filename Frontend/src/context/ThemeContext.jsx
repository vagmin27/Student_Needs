import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const THEME_STORAGE_KEY = "student-needs-theme";

const ThemeContext = createContext(undefined);

const isThemeValue = (value) => value === "light" || value === "dark";

const getPreferredTheme = () => {
  if (typeof window === "undefined") return "light";

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (isThemeValue(savedTheme)) return savedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme) => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  root.classList.remove("light", "dark", "light-theme", "dark-theme");
  root.classList.add(theme);
  root.classList.add(`${theme}-theme`);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getPreferredTheme);

  useEffect(() => {
    applyTheme(theme);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    setThemeState((currentTheme) => {
      const resolvedTheme =
        typeof nextTheme === "function" ? nextTheme(currentTheme) : nextTheme;

      return isThemeValue(resolvedTheme) ? resolvedTheme : currentTheme;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark",
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      setTheme,
      toggleTheme,
    }),
    [setTheme, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

if (typeof document !== "undefined") {
  applyTheme(getPreferredTheme());
}
