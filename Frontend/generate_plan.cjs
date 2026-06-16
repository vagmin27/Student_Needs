const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync('audit_report.json', 'utf8'));

// Categorize files
const pages = [];
const components = [];
const layouts = [];
const styles = [];
const others = [];

report.forEach(item => {
  // Only include files needing modification
  if (item.issues.length === 0) return;
  
  const f = item.file;
  if (f.startsWith('src/pages/')) {
    pages.push(item);
  } else if (f.startsWith('src/components/')) {
    components.push(item);
  } else if (f.startsWith('src/layouts/')) {
    layouts.push(item);
  } else if (f.startsWith('src/styles/')) {
    styles.push(item);
  } else {
    others.push(item);
  }
});

let mdTable = `| File Name | Decision | Current Design Issues & Required UniConnect Changes |\n`;
mdTable += `| :--- | :--- | :--- |\n`;

function formatRow(item) {
  const decision = '**Needs modification**';
  const issueText = item.issues.join('; ') + '. Refactor to use unified Inter font, standard radii variables, and design tokens.';
  return `| [\`${path.basename(item.file)}\`](file:///${path.resolve(item.file).replace(/\\/g, '/')}) | ${decision} | ${issueText} |\n`;
}

// Generate pages
if (pages.length > 0) {
  mdTable += `| **PAGES** | | |\n`;
  pages.forEach(item => {
    mdTable += formatRow(item);
  });
}

// Generate components
if (components.length > 0) {
  mdTable += `| **COMPONENTS** | | |\n`;
  components.forEach(item => {
    mdTable += formatRow(item);
  });
}

// Generate layouts
if (layouts.length > 0) {
  mdTable += `| **LAYOUTS** | | |\n`;
  layouts.forEach(item => {
    mdTable += formatRow(item);
  });
}

// Generate styles
if (styles.length > 0) {
  mdTable += `| **STYLES** | | |\n`;
  styles.forEach(item => {
    mdTable += formatRow(item);
  });
}

// Generate others
if (others.length > 0) {
  mdTable += `| **OTHERS / ROOT FILES** | | |\n`;
  others.forEach(item => {
    mdTable += formatRow(item);
  });
}

const planContent = `# Implementation Plan - Project-Wide UI/UX Refactor for Exact Visual Replication

This implementation plan details the steps to scan every file in the frontend and perform a comprehensive UI/UX refactor, ensuring the visual appearance of all dashboards, tables, forms, layouts, and components is extremely close to the UniConnect reference design. All existing routing, API calls, and business logic will be preserved without modifications.

## Strict Visual Replication Checklist

- **Typography**: 
  - Switch all headings, dashboards, page titles, and body content to the \`Inter\` sans-serif font stack.
  - Headings will use weights \`700\` to \`800\` with tight letter spacing (\`tracking-tight\` / \`tracking-tighter\` / \`-0.03em\`).
- **Color Scales**:
  - **Light Theme**: Background (\`#F8FAFC\`), Cards/Panels (\`#FFFFFF\`), Primary accents (\`#4F46E5\`), Primary Hover (\`#4338CA\`), Text Primary (\`#0F172A\`), Text Secondary (\`#64748B\`), Border (\`#E2E8F0\`), Success (\`#10B981\`).
  - **Dark Theme**: Background (\`#020617\`), Cards/Panels (\`#0F172A\`), Secondary Surfaces (\`#111827\`), Primary accents (\`#6366F1\`), Text Primary (\`#F8FAFC\`), Text Secondary (\`#94A3B8\`), Border (\`rgba(255,255,255,0.08)\`).
- **Radius Scale**:
  - Buttons: \`12px\` (\`var(--radius-sm)\` / \`var(--radius-md)\`)
  - Inputs: \`12px\` (\`var(--radius-sm)\` / \`var(--radius-md)\`)
  - Cards & Small Containers: \`16px\` (\`var(--radius-lg)\`)
  - Large outer panels & Dialogs: \`24px\` (\`var(--radius-xl)\`)
- **Effects**:
  - Glassmorphic panels: \`backdrop-filter: blur(20px)\`, \`background: rgba(255, 255, 255, 0.05)\` (dark) / \`rgba(255, 255, 255, 0.7)\` (light), \`border: 1px solid rgba(255, 255, 255, 0.08)\`.
  - Shadows: Soft shadows (Light: \`0 10px 30px rgba(15,23,42,0.08)\`, Dark: \`0 10px 40px rgba(0,0,0,0.35)\`).
  - Hover Lift: Card translateY offset transition (\`hover:-translate-y-1 hover:shadow-lg transition-all duration-300\`).
  - Gradient CTAs: Purple-blue gradient backgrounds for primary actions and CTA cards.

---

## Detailed File Audit and Target Changes

${mdTable}

---

## Proposed Changes by Area

### 1. Stylesheets Scanning & Refactoring
We will refactor custom page stylesheets and CSS overrides to ensure styling variables (colors, spacing, typography) are uniformly inherited.
- **[theme.css](file:///c:/Users/Dell/Desktop/StudentNeeds/Frontend/src/styles/theme.css)**: Remove any leftover hardcoded background overrides.
- **[variables.css](file:///c:/Users/Dell/Desktop/StudentNeeds/Frontend/src/styles/variables.css)** & **[App.css](file:///c:/Users/Dell/Desktop/StudentNeeds/Frontend/src/App.css)**: Consolidate layout transitions and card sizes.
- **Custom CSS Sheets**: Eliminate custom backgrounds and colors in page-specific sheets (e.g. \`TutorLoginPage.css\`) to support standard light/dark modes.

### 2. Marketing / Landing Pages
- **About / Features / How It Works**: Align typography (ensure Inter sans-serif font stack) and border radius.
- **Header & Footer**: Refactor sticky header wrapper to include a sleek glass background panel with backdrop-blur, and clean up contact modals.

### 3. Authentication Flow
- **Login / Signup / Forgot Password / Verify OTP**:
  - Redesign form wraps to center properly.
  - Implement uniform input fields with \`44px\` height, \`12px\` rounded border radius, and active color outline shadow rings.

### 4. Dashboards Unification (Attendance, Expenses, Referrals, Tutorials, Admin)
Dashboards are the core workspace. We will unify their layout elements:
- **[UnifiedDashboard.jsx](file:///c:/Users/Dell/Desktop/StudentNeeds/Frontend/src/pages/UnifiedDashboard.jsx)**:
  - Modify dashboard layout structure to exactly match the reference screenshot.
  - Organize grid: Left column features "Upcoming Classes" (with Algorithm class badge) and "Bills Due Calendar"; right column has "Expense Overview" Donut chart and "Quick Modules" grid list.
  - The bottom section contains a full-width "Recent Activity" row showcasing three activities horizontally.
- **Student & Tutor Dashboards**:
  - Remove all occurrences of custom serif/monospaced fonts.
  - Refactor all statistics grids to use unified \`StatCard\` layouts with identical padding and card structures.
- **Expenses Home**:
  - Replace all occurrences of \`font-mont\` with standard \`font-sans\` (Inter).
  - Modernize prediction widgets to use glassmorphic panels.

### 4A. Critical Dashboard Architecture Replication

## CRITICAL DASHBOARD ARCHITECTURE REQUIREMENT

The objective is not merely to restyle existing dashboards.

The objective is to visually replicate the UniConnect dashboard architecture as closely as possible.

Existing dashboards should be treated as data sources and business-logic containers only.

The current JSX layout structures may be redesigned completely when necessary.

Business logic, routing, state management, API integrations, permissions, and functionality must remain unchanged.

Visual structure may be replaced.

### Allowed Changes

The refactor may:

- Rewrite JSX layout hierarchies
- Reorganize dashboard sections
- Replace card arrangements
- Replace grid systems
- Replace dashboard widget placement
- Replace navigation presentation
- Replace statistics card composition
- Replace content grouping strategy
- Introduce new reusable layout wrappers

### Not Allowed Changes

The refactor must NOT:

- Modify API endpoints
- Modify backend contracts
- Modify authentication flows
- Modify routing behavior
- Modify business rules
- Remove features
- Remove dashboard functionality

### Dashboard Layout Target

All dashboard experiences should converge toward a shared SaaS-style architecture:

Top Bar:
- Welcome section
- Search
- Notifications
- Theme toggle
- User avatar

Row 1:
- Four KPI cards

Row 2:
- Upcoming Classes
- Expense Overview

Row 3:
- Calendar / Events
- Quick Modules

Row 4:
- Recent Activity Timeline

### Visual Similarity Requirement

When compared side-by-side with the UniConnect reference:

- Card sizing should feel equivalent
- Card spacing should feel equivalent
- Dashboard rhythm should feel equivalent
- Information hierarchy should feel equivalent
- Section ordering should feel equivalent
- Visual density should feel equivalent

If preserving an old layout prevents achieving similarity, the layout should be replaced.

### 4B. DASHBOARD-BY-DASHBOARD REPLICATION REQUIREMENT

Do NOT implement the new architecture only in UnifiedDashboard.jsx.

Every dashboard must individually adopt the UniConnect design language.

The following dashboards must be reviewed and redesigned independently:

#### Student Dashboard
- Attendance metrics
- Expense summary
- Upcoming tutorials
- Referral opportunities
- Calendar
- Recent activity

#### Tutor Dashboard
- Upcoming sessions
- Earnings overview
- Student activity
- Schedule calendar
- Recent bookings

#### Attendance Dashboard
- Attendance KPIs
- Student status summaries
- Recent attendance logs
- Analytics widgets

#### Expenses Dashboard
- Budget overview
- Spending donut chart
- Category breakdown
- Upcoming bills
- Transaction activity

#### Referrals Dashboard
- Opportunities
- Applications
- Referral status
- Alumni interactions
- Activity feed

#### Alumni Dashboard
- Candidate pipeline
- Referral performance
- Active postings
- Applications received
- Recent activity

#### Unified Dashboard
- Serves as the master visual reference for all dashboard modules.

REQUIREMENT

Every dashboard must:

- Use the same card system
- Use the same KPI layout language
- Use the same spacing rhythm
- Use the same visual hierarchy
- Use the same typography scale
- Use the same glassmorphism treatment
- Use the same radius system
- Use the same shadow system

Users should feel they are inside a single product ecosystem.

Switching between modules must feel like changing features, not changing applications.

### 5. Table & Form Primitives
- **[table.jsx](file:///c:/Users/Dell/Desktop/StudentNeeds/Frontend/src/components/ui/table.jsx)**:
  - Enforce rounded container margins (\`16px\` card border-radius), border separations, zebra striping, and clean row transitions.
- **Inputs & Selects**:
  - Align all page inputs (standard heights and focus rings).

---

## Verification Plan

### Automated Tests
- Build test: \`npm run build\` inside the \`Frontend/\` folder to confirm zero TypeScript, React compilation, or layout errors.

### Visual Comparison Verification

For every major dashboard:

- Unified Dashboard
- Student Dashboard
- Tutor Dashboard
- Attendance Dashboard
- Expenses Dashboard
- Referrals Dashboard

Perform a side-by-side comparison against the UniConnect reference.

Verify:

- card hierarchy
- spacing
- dashboard composition
- visual density
- widget placement
- typography scale
- responsiveness

The goal is visual parity, not merely token consistency.

### Manual Verification
- Render check: Verify light/dark theme compliance and responsive alignments across major screen breakpoints.

## FINAL ACCEPTANCE CRITERIA

The task is NOT complete until:

✓ Every dashboard has been redesigned.

✓ Every dashboard visually resembles the UniConnect design language.

✓ Dashboard layouts have been modernized where necessary.

✓ Shared components have been standardized.

✓ Light mode matches the reference design language.

✓ Dark mode matches the reference design language.

✓ Responsive layouts remain functional.

✓ Existing business logic remains unchanged.

✓ Build passes successfully.

✓ Visual comparison against the reference screenshots has been completed.
`;

fs.writeFileSync('C:\\Users\\Dell\\.gemini\\antigravity-ide\\brain\\aaca086d-bd0f-45f1-b6a2-5d9ead86fcf0\\implementation_plan.md', planContent, 'utf8');
console.log('Implementation plan updated successfully.');

