# Design System & UI/UX Guidelines

## 1. Design Philosophy
The School Management System and Classroom Platform employs a **calm, clean, high-contrast, and school-friendly visual style**. Educational interfaces are high-frequency workspaces used by teachers grading late at night, students browsing on smartphones under varying lighting conditions, and parents quickly reviewing notices on the go.

The visual direction avoids clutter and aggressive hyper-saturated palettes in favor of:
- **High Readability**: Crisp typographic scale, high-contrast text ratios exceeding WCAG AA standards.
- **Focus & Calm**: Soft neutral backgrounds (warm zinc/slate) accented by purposeful semantic colors.
- **Immediate State Clarity**: Unambiguous visual indicators for submission statuses (Assigned, Turned In, Missing, Late, Returned, Graded).
- **Responsive Symmetry**: Effortless transition between full desktop dual-pane workstations and mobile-first touch screens.

---

## 2. Color Palette & Semantic Tokens

| Token | Hex / HSL | Semantic Role |
| :--- | :--- | :--- |
| `--background` | `hsl(210 20% 98%)` | Crisp light background canvas |
| `--surface` | `hsl(0 0% 100%)` | Pure white card surfaces and elevated panels |
| `--surface-muted` | `hsl(210 20% 95%)` | Table headers, secondary toolbars, badge backdrops |
| `--primary` | `hsl(222 47% 18%)` | Deep Academic Navy (buttons, active navigation, titles) |
| `--primary-accent` | `hsl(217 91% 60%)` | Vivid Blue for interactive links, focus rings, primary highlights |
| `--secondary` | `hsl(215 25% 27%)` | Secondary text, subtle borders, metadata labels |
| `--success` | `hsl(142 71% 45%)` | Emerald Green: Passed grades, present attendance, paid balances |
| `--warning` | `hsl(38 92% 50%)` | Amber: Late submissions, approaching deadlines, upcoming installments |
| `--destructive` | `hsl(0 84% 60%)` | Rose Red: Unexcused absences, missing assignments, overdue fees, grade lock |
| `--info` | `hsl(199 89% 48%)` | Sky Blue: System announcements, info tooltips, timetable tags |

---

## 3. Typography & Hierarchy

The interface utilizes a modern sans-serif typography stack (`Inter` or `Plus Jakarta Sans`, falling back to `system-ui`).

- **Display Header (`text-3xl font-bold tracking-tight`)**: Portal dashboards and primary view titles.
- **Section Heading (`text-xl font-semibold text-slate-900`)**: Card section headers, table grouping titles.
- **Card Title (`text-base font-semibold text-slate-800`)**: Assignment cards, subject titles, fee items.
- **Body Text (`text-sm text-slate-700 leading-relaxed`)**: Stream announcements, submission instructions, descriptions.
- **Metadata & Subtext (`text-xs text-slate-500 font-medium`)**: Timestamps, due dates, breadcrumbs, student LRN.
- **Numeric Badges (`font-mono text-xs font-semibold`)**: Grade percentages, currency amounts (₱), room numbers.

---

## 4. Navigation Architecture

### 4.1 Desktop Viewport ($\ge 1024\text{px}$)
- **Left Collapsible Sidebar (Width: 260px)**:
  - School branding header with school logo and current Academic Year badge.
  - Role-specific navigation links with Lucide icons and active indicators.
  - Quick-action buttons (e.g. "+ Create Class", "+ Encode Attendance", "+ New Assignment").
  - Footer with user profile dropdown, multi-child switcher (for Parents), and theme/sign-out buttons.
- **Top Header Bar**:
  - Global breadcrumb trail.
  - Global search bar (Cmd/Ctrl + K) for rapid student, class, and fee lookup.
  - Notification bell with unread badge counter.
  - Current Philippine Standard Time (`Asia/Manila`) indicator.

### 4.2 Mobile Viewport ($< 1024\text{px}$)
- **Bottom Navigation Bar (Height: 64px)**:
  - Fixed dock featuring 4 to 5 high-frequency routes based on role:
    - **Teacher**: Home, Classes, Attendance, Gradebook, Profile.
    - **Student**: Today, Classwork, Grades, Fees, Profile.
    - **Parent**: Overview, Children, Balances, Attendance, More.
    - **Admin**: Dashboard, Admissions, Finance, Academics, Menu.
- **Mobile Drawer Menu**: Triggered via hamburger icon for lower-frequency operational items (Settings, Reports, Audit Logs).

---

## 5. Component Patterns & UX Standards

### 5.1 Tables & Lists
- Every table is accompanied by:
  - Debounced search filter input.
  - Filter chips (e.g. Grade Level, Section, Status, Quarter).
  - Clear pagination controls with items-per-page selector.
  - Sorting headers on sortable columns.
  - **Empty State**: Friendly illustration/icon, descriptive title, and direct primary action button.
  - **Loading State**: Animated skeleton rows that preserve column widths to prevent layout shifts.

### 5.2 Forms & Validation
- Built with `react-hook-form` and `zod` schemas.
- Interactive form fields with clear floating labels or top labels.
- Live validation feedback with accessible ARIA error messages (`text-rose-600 text-xs mt-1`).
- Submit buttons automatically transition to loading state with spinner on execution (`isSubmitting`).

### 5.3 Google Classroom-Style Stream & Classwork Cards
- **Stream Announcements**: Rich expandable cards with avatar, author name, timestamp, rich text body, and thumbnail previews for attachments.
- **Classwork Items**: Grouped hierarchically by Topic / Quarter with status pill badges:
  - `Assigned` (Neutral grey pill)
  - `Turned In` (Sky blue pill)
  - `Late` (Amber pill)
  - `Missing` (Rose red pill)
  - `Graded` (Emerald green pill with score `/ 100`)

### 5.4 Progressive Web App (PWA) Offline UX
- Top persistent offline badge when network connectivity drops: *"Working offline. Changes will sync automatically when connected."*
- Offline attendance queue status indicator showing pending synchronized counts.
