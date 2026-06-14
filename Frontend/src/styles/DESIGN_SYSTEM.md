# UniConnect Design System

This reference document serves as the guide for the Shared Design System. All future pages, layouts, and feature additions must conform to this specification.

---

## Token Scales

### Spacing Scale
Always use spacing tokens or Tailwind classes mapping to these dimensions:
| Token Name | Value | Tailwind Class Equivalent | Purpose |
|---|---|---|---|
| `--space-xs` | `4px` | `p-space-xs`, `gap-space-xs`, `m-space-xs` | Fine grid offsets, micro gaps |
| `--space-sm` | `8px` | `p-space-sm`, `gap-space-sm`, `m-space-sm` | Badge spacing, item list gaps |
| `--space-md` | `16px` | `p-space-md`, `gap-space-md`, `m-space-md` | Standard gutters, card inner padding |
| `--space-lg` | `24px` | `p-space-lg`, `gap-space-lg`, `m-space-lg` | Desktop spacing, dashboard section padding |
| `--space-xl` | `32px` | `p-space-xl`, `gap-space-xl`, `m-space-xl` | Massive page vertical margins |
| `--space-2xl`| `48px` | `p-space-2xl`, `gap-space-2xl` | Hero blocks, header overlays |

### Border Radius Scale
| Token Name | Value | Tailwind Class Equivalent | Purpose |
|---|---|---|---|
| `--radius-sm` | `8px` | `rounded-sm` | Buttons, small input items, badges |
| `--radius-md` | `12px` | `rounded-md` | Standard cards, input boxes, dropdown selectors |
| `--radius-lg` | `16px` | `rounded-lg` | Inner panels, table containers, page sections |
| `--radius-xl` | `24px` | `rounded-xl` | Outer dialogs, full dashboard wrappers |

### Shadow Scale
| Token Name | Value | Purpose |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Standard card elevation |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.08)` | Hovering elements, floating headers |
| `--shadow-lg` | `0 10px 25px rgba(0,0,0,0.1)` | Overlay modalls, dialog frames |
| `--shadow-glow`| `0 0 24px rgba(37,99,235,0.15)`| Glowing accents on active premium items |

### Typography Scale
Use standard tailwind font sizes. Text colors are controlled dynamically using these custom variables:
- `text-text-primary` (`var(--text-primary)`): Main headings, tables, labels.
- `text-text-secondary` (`var(--text-secondary)`): Paragraphs, descriptions.
- `text-text-muted` (`var(--text-muted)`): Footers, subtle timings, disabled text.

### Color Tokens
| Variable | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--bg-primary` | `#F8FAFC` | `#030712` | Main page viewport background |
| `--bg-secondary` | `#F1F5F9` | `#050B18` | Sidebar panels, inner grid background |
| `--bg-tertiary` | `#E2E8F0` | `#08101F` | Hover row triggers |
| `--card-bg` | `#FFFFFF` | `rgba(255,255,255,0.03)` | Base container card background |
| `--border-color` | `#E2E8F0` | `rgba(255,255,255,0.08)` | Borders and dividers |
| `--accent` | `#2563EB` | `#3B82F6` | Interactive triggers, primary buttons |

---

## Component Usage Guide

### 1. Button Variants
Never write custom layout button rules. Import `Button`, `PrimaryButton`, `SecondaryButton`, `GhostButton` from `@/components/ui/button`:
```jsx
import { PrimaryButton, SecondaryButton, GhostButton } from "@/components/ui/button";

// Examples:
<PrimaryButton onClick={handleSave}>Save Changes</PrimaryButton>
<SecondaryButton onClick={handleCancel}>Cancel</SecondaryButton>
<GhostButton onClick={handleToggle}>Collapse</GhostButton>
```

### 2. Card Variants
Cards should be declared using semantic slots:
```jsx
import { PremiumCard, GlassCard, MetricCard } from "@/components/ui/card";

// Premium card with glowing border and radial accent:
<PremiumCard title="Analytics Overview" description="Monthly metrics dashboard" glow>
  <p>Card Content here...</p>
</PremiumCard>

// Translucent glass card:
<GlassCard className="p-6">
  <p>Glass Content here...</p>
</GlassCard>

// Metrics card with arrow indicators:
<MetricCard title="Total Earnings" value="$24,850" trend="up" trendValue="12.5%" />
```

### 3. Form Primitives
Inputs and labels must wrap inside form groups to ensure uniform spacing:
```jsx
import { FormGroup, FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form";
import { PremiumInput } from "@/components/ui/input";

<FormGroup>
  <FormLabel required>Email Address</FormLabel>
  <PremiumInput error={validationError} placeholder="Enter your email" />
  <FormHelperText>We will never share your email.</FormHelperText>
</FormGroup>
```

### 4. Dashboard Primitives
All main view dashboards must utilize these structures to prevent one-off UI designs:
```jsx
import { DashboardHeader, DashboardSection, StatCard, AnalyticsCard, ActivityFeed } from "@/components/dashboard/shared/Primitives";

// 1. Header
<DashboardHeader title="Student Portal" description="Manage classes and attendance" action={<Button>Refresh</Button>} />

// 2. Sections and grids
<DashboardSection title="Overview Metrics">
  <div className="grid grid-cols-3 gap-6">
    <StatCard title="Overall Attendance" value="94.5%" trend="up" trendValue="2%" />
    <StatCard title="Active Classes" value="12" />
    <StatCard title="Due Assignments" value="3" trend="down" trendValue="1" />
  </div>
</DashboardSection>
```

---

## Style Enforcement Rules

### ❌ Forbidden Rules
- **No direct grays/blacks**: Do not use utility classes like `text-black`, `text-slate-900`, `bg-white`, `bg-slate-900`. Use semantic classes (`text-text-primary`, `bg-card-bg`).
- **No inline color values**: Do not specify `style={{ color: "#2563EB" }}`. Map it to the theme variable or use tailwind colors.
- **No hex code values in markup**: Avoid `#F3F4F6` inside components. Reference CSS theme variables.
- **No page-specific card or button overrides**: Refrain from defining `.my-custom-button { background-color: purple; }` or custom classes inside pages.

### ✅ Required Rules
- Always use the shared component library under `src/components/ui/`.
- Ensure all dashboards consume the primitives from `src/components/dashboard/shared/Primitives`.
- All Recharts tables and charts must wrap inside `ChartContainer` and `AnalyticsCard`.
