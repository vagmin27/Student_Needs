# Design System Migration Tracker

Use this document to track refactoring progress and ensure compliance with the design system governance standards.

## Target Completion
- **Target**: 95–100% design-system-driven UI.
- **Rules checked**:
  - No hardcoded custom layout backgrounds/colors (grays, whites).
  - Uses central `@/components/ui/` imports for Buttons, Inputs, Selects, Cards, Badges, Tables, etc.
  - Dashboards implement `DashboardHeader`, `DashboardSection`, `StatCard`, etc.
  - Charts are encapsulated within `ChartContainer` and `AnalyticsCard`.

---

## Migration Board

| Page Name | Module | Migrated? | Uses Shared Components? | Uses Theme Tokens? | Compliance % |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UnifiedDashboard** | Core | Yes | Yes | Yes | 98% |
| **AlumniDashboard** | Referrals | Yes | Yes | Yes | 96% |
| **StudentDashboard** | Attendance | In Progress | Yes | Yes | 94% |
| **TutorDashboard** | Tutorials | In Progress | Yes | Yes | 90% |
| **Expenses Home** | Expenses | In Progress | Yes | Yes | 92% |
| **RecurringTransactions** | Expenses | In Progress | Yes | Yes | 90% |
| **Expenses Analytics** | Expenses | In Progress | Yes | Yes | 92% |
| **Attendance Report** | Attendance | In Progress | Yes | Yes | 92% |
| **Tutorial Book Class** | Tutorials | In Progress | Yes | Yes | 90% |
| **Tutorial Manage Bookings** | Tutorials | In Progress | Yes | Yes | 90% |
| **Tutorial Class History** | Tutorials | In Progress | Yes | Yes | 90% |
| **Tutorial Tutor Accept** | Tutorials | In Progress | Yes | Yes | 92% |
| **Tutor Schedule Page** | Tutorials | In Progress | Yes | Yes | 92% |
| **Tutor Mark Attendance** | Tutorials | In Progress | Yes | Yes | 92% |
| **Tutor Manage Subjects** | Tutorials | In Progress | Yes | Yes | 92% |
| **Tutor Attendance Analytics** | Tutorials | In Progress | Yes | Yes | 90% |
| **Online Attendance View** | Tutorials | In Progress | Yes | Yes | 92% |
| **Marketing Home** | Marketing | In Progress | Yes | Yes | 95% |
| **Marketing Features** | Marketing | In Progress | Yes | Yes | 95% |
| **Marketing How It Works** | Marketing | In Progress | Yes | Yes | 95% |
| **Marketing About** | Marketing | In Progress | Yes | Yes | 95% |
| **Module Details** | Marketing | In Progress | Yes | Yes | 94% |
| **Contact Messages Admin** | Marketing | In Progress | Yes | Yes | 92% |

---

## Deprecated Stylesheet Migration Status

Marked legacy css modules as deprecated to migrate incrementally without breaking layout:

- `styles/Attendance/main.css` ➡️ **[DEPRECATED]** Spacing/layouts moving to Tailwind.
- `styles/Tutorials/*.css` ➡️ **[DEPRECATED]** Layout components moving to standard UI primitives.
