## Theme Audit

### Scope scanned

- `Frontend/src/**/*.jsx`
- `Frontend/src/**/*.js`
- `Frontend/src/**/*.css`
- `Frontend/src/**/*.module.css`

### Existing theme infrastructure

- `Frontend/src/contexts/ThemeContext.jsx`
  Already provides a theme context, but supports `system` in state and applies both classes and `data-theme`.
- `Frontend/src/hooks/useTheme.js`
  Re-exports the current theme hook/provider.
- `Frontend/src/components/ThemeToggle.jsx`
  Existing three-state toggle (`light`, `system`, `dark`) with strong custom styling.
- `Frontend/src/components/common/ThemeToggle.jsx`
  Second toggle implementation already exists.
- `Frontend/src/styles/theme.css`
  Existing global token file already present.
- `Frontend/src/index.css`
  Duplicates Gemini-like theme variables directly in the entry stylesheet.

### Files using hardcoded colors

- `Frontend/src/App.jsx`
  Toast styles use hardcoded dark colors.
- `Frontend/src/App.css`
  Contains many hardcoded colors and overlays, including chat/tutorial related areas.
- `Frontend/src/layouts/Attendance/DashboardLayout.jsx`
  Uses inline overlay/background/icon colors.
- `Frontend/src/utils/toast.js`
  Success, error, info, warning toasts use inline hex colors.
- `Frontend/src/components/Attendance/AttendanceCharts.jsx`
  Hardcoded chart palette.
- `Frontend/src/components/Attendance/Charts.jsx`
  Hardcoded chart tooltip, grid, ticks, and series colors.
- `Frontend/src/components/ErrorBoundary.jsx`
  Entire fallback UI uses hardcoded colors.
- `Frontend/src/components/dashboard/student/ExpenseBreakdownChart.jsx`
  Hardcoded chart palette.
- `Frontend/src/components/Expenses/dashboard/CategoryPieChart.jsx`
  Hardcoded chart palette.
- `Frontend/src/styles/components.css`
  Several rgba semantic borders and overlays.
- `Frontend/src/styles/utilities.css`
  Gradient and overlay rgba values.
- `Frontend/src/styles/Attendance/main.css`
  Multiple gradients, button fills, spinner colors.
- `Frontend/src/styles/Tutorials/*.css`
  Several files contain hardcoded overlays/shadows/accent colors.
- `Frontend/src/components/Tutorials/Login.jsx`
  Inline hardcoded colors.
- `Frontend/src/components/Tutorials/ReviewModal.jsx`
  Inline overlay color.
- `Frontend/src/components/Referrals/Student/LinkedInSection.jsx`
  LinkedIn brand color hardcoded.
- `Frontend/src/pages/UnifiedFlow.jsx`
  Includes hardcoded SVG brand colors and multiple accent values.

### Duplicate palettes / repeated theme patterns

- Gemini surface tokens appear in both:
  - `Frontend/src/index.css`
  - `Frontend/src/styles/theme.css` via mapped variables
- Two separate toggle components:
  - `Frontend/src/components/ThemeToggle.jsx`
  - `Frontend/src/components/common/ThemeToggle.jsx`
- Theme context is referenced from:
  - `Frontend/src/contexts/ThemeContext.jsx`
  - `Frontend/src/contexts/Referrals/ThemeContext.jsx`
  - `Frontend/src/hooks/useTheme.js`

### Components most relevant for migration

- `Frontend/src/components/dashboard/Navbar.jsx`
- `Frontend/src/components/dashboard/Sidebar.jsx`
- `Frontend/src/components/ui/card.jsx`
- `Frontend/src/components/Attendance/Navbar.jsx`
- `Frontend/src/App.jsx`
- `Frontend/src/main.jsx`
- `Frontend/src/index.css`
- `Frontend/src/styles/theme.css`

### Possible conflicts

- Replacing `Frontend/src/styles/theme.css` wholesale would likely break broader token usage because many components rely on existing variables such as `--primary`, `--border`, `--bg-secondary`, `--text-heading`, and shadow tokens.
- Replacing `Frontend/src/contexts/ThemeContext.jsx` directly without compatibility handling would break existing imports under `@/contexts/...`.
- Removing the existing three-state toggle without a compatibility layer would break imports from `@/components/ThemeToggle.jsx`.
- Some hardcoded colors are semantic or brand-specific rather than theme-surface colors:
  - chart series colors
  - LinkedIn brand blue
  - warning/error/success toast colors
  These should not all be force-migrated into the Gemini nav/card palette.

### Safe migration recommendation

- Introduce the new production theme provider at `Frontend/src/context/ThemeContext.jsx`.
- Keep compatibility by re-exporting from the existing `Frontend/src/contexts/ThemeContext.jsx`.
- Move Gemini light/dark surface variables into `Frontend/src/styles/theme.css` and remove duplicate declarations from `Frontend/src/index.css`.
- Replace hardcoded nav/sidebar/card surface colors with the requested CSS variables.
- Consolidate toggle usage behind one shared component implementation.
