/**
 * Barrel re-export file to maintain backward compatibility with existing imports.
 * Redirects to the singular src/context/ThemeContext.jsx configuration.
 */
export { ThemeProvider, useTheme, THEME_STORAGE_KEY } from "../context/ThemeContext.jsx";
export default { THEME_STORAGE_KEY };
