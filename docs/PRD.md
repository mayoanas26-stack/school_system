# Product Requirements Document (PRD)
## Unified School Management System (SMS) + Google Classroom-Style Learning Platform

---

## 1. Product Vision & Goals
Modern educational institutions (especially in the Philippines and Southeast Asia) suffer from fragmentation: their administrative and student information records (SIS/SMS) are isolated from their day-to-day digital learning environments (LMS). As a result:
- Teachers duplicate work: entering class rosters manually, calculating grades in external spreadsheets, and re-encoding final scores into SMS gradebooks.
- Parents receive delayed, disjointed notifications about attendance, missing homework, and financial account balances.
- School administrators lack real-time visibility into academic performance, attendance trends, and tuition collection.

**The Solution:** A unified web platform and installable PWA that fuses core School Management with a Google Classroom-style learning layer. Rosters, schedules, grades, and attendance flow automatically across the entire ecosystem.

---

## 2. Target Personas & Core Workflows

### 2.1 School Administrators & Staff
- **Super Administrator**: Overall system configuration, term rollovers, backup policies, user management, and audit log inspection.
- **Registrar (`can_manage_admissions`)**: Online admissions application processing, student credential validation, section assignment, Form 137 / transcript issuance.
- **Cashier (`can_manage_finance`)**: Fee structure creation, tuition payment collection (Stripe online + manual cash/bank/e-wallet), receipt printing, student ledger balancing.
- **Principal / Academic Head (`can_manage_academics`)**: Curriculum planning, teacher section allocation, grade locking/unlocking, honor roll approvals.

### 2.2 Teachers
- View assigned sections, class lists, and personal schedules.
- Post class announcements, organize topics, and publish assignments with attachments and due dates.
- Review submitted student work, grade with reusable rubrics, return work with private teacher-student feedback, and 1-click sync scores directly to the SMS gradebook.
- Record daily or per-subject attendance (Present, Late, Absent, Excused) with automatic absence alerts sent to parents.
- Host one-click live lessons (Google Meet / embedded video) with automated attendance capture.

### 2.3 Students
- Agenda dashboard showing today's timetable, deadlines, announcements, and unsubmitted classwork.
- Google Classroom-style stream for enrolled subjects with attachments, discussion comments, and teacher instructions.
- File upload for homework submissions, turn in, unsubmit, and private feedback dialogue with teachers.
- Live view of computed grades, teacher evaluations, and downloadable PDF report cards.
- View tuition balances, installment due dates, and school library catalog.

### 2.4 Parents & Guardians
- Single login with seamless multi-child switcher across multiple siblings enrolled in the school.
- Real-time attendance monitoring with instant alerts on absence or tardiness.
- View real-time grades, report cards, and weekly guardian summaries (missing work, upcoming tasks, class notices).
- Secure tuition fee balance inspection and 1-click Stripe checkout (credit/debit cards, e-wallets) with downloadable official receipts.
- Digital consent and permission slips for school trips and activities.

---

## 3. Product Scope & Priority Tiers

### Tier A: Core Foundations (Immediate Priority)
1. **Authentication & Identity**: Clerk authentication with native Supabase JWT synchronization; strict role-based routing and database-level RLS.
2. **School Setup**: Academic years, quarters/semesters, grade levels, sections, subjects, classrooms, and teacher allocation.
3. **Student Information**: Profiles, LRN, emergency contacts, guardian links, document storage with signed expiring URLs.
4. **Admissions & Enrollment**: Online application pipeline, review/approval, section placement.
5. **Attendance Engine**: Daily and per-subject attendance, QR check-in option, absence triggers, parent notification alerts.
6. **Grading & Report Cards**: Weighted DepEd/standard grading (Written Work, Performance Tasks, Quarterly Exam), automated computation, grade locking with admin unlock, and `@react-pdf/renderer` Form 137 / Report Card generation.
7. **Tuition & Billing**: Fee structures, student ledgers, Stripe online checkout + idempotent webhook, manual cashier payment recording, official PDF receipts.
8. **Classroom Core**: Auto-created classes from SMS sections, class stream, topics, assignments, submissions, grading workspace, and 1-click gradebook sync.
9. **Role Portals**: Complete `/admin`, `/teacher`, `/student`, and `/parent` interfaces.

### Tier B: Learning & Communication
- Auto-graded quizzes and question banks (multiple choice, short answer, timers).
- Reusable rubrics with matrix-based scoring.
- Live classes (`VideoProvider` interface: Google Meet link generation & embedded video rooms) with attendance capture.
- Google Drive picker integration and Calendar due-date sync.
- Timetable builder with room and teacher conflict detection.
- Behavioral incident logs, restricted guidance notes, clinic visits, vaccination tracking.
- Visual analytics dashboards for enrollment, attendance, finances, and academic at-risk flags with Excel export.

### Tier C: Operations & System Extensions
- Staff/HR management: teacher profiles, workload summaries, leave approvals.
- Library catalog, book borrowing/return, due dates, and fines.
- Campus asset & inventory tracking.
- Transport bus routes, driver assignments, and pickup lists.
- Hostel/dormitory room allocation and visitor logs.
- Document generator: Printable student ID cards and official Certificates of Enrollment.
- PWA offline caching of schedules, grades, and materials, with an offline queue for teacher attendance.

---

## 4. Non-Functional & Regulatory Requirements
- **Data Privacy Act of 2012 (Republic Act No. 10173)**: Minimal minor PII collected, consent logs, no plain secrets, audit trails on sensitive data modifications, data retention policies, and account erasure tooling.
- **Performance**: Edge Middleware routing, Supabase database indexes on foreign keys and compound lookups, direct browser-to-storage signed file uploads to bypass serverless payload limits.
- **Localization**: Default timezone `Asia/Manila` (UTC+8), default currency `PHP (₱)`, internationalization ready with structured English and Filipino string files.
- **Accessibility & Responsiveness**: Mobile-first responsive design, WCAG AA contrast ratio, full keyboard navigation, accessible forms with Zod validation.
