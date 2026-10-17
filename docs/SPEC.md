# Comprehensive Product Specification: School Management & Classroom Platform

## 1. Executive Summary & Purpose
This platform is a unified, production-grade **School Management System (SMS)** and **Google Classroom-style Learning Management Platform**. Designed for modern primary, secondary, and K-12/higher-ed schools (defaulted to Philippine timezone `Asia/Manila` and Philippine Peso `PHP`, configurable per school).

By unifying SMS and Classroom into a single relational database schema with Next.js App Router and Postgres Row-Level Security (RLS):
1. **Rosters, timetables, and teacher assignments** automatically synchronize to create and populate active classrooms.
2. **Assignments, quizzes, and live class attendance** in the classroom synchronize directly into SMS gradebooks and daily attendance logs.
3. **Parents and Guardians** have multi-child switching to track attendance, balances, report cards, and weekly guardian summaries under one unified login.
4. **Admins and Staff** have fine-grained sub-permissions (`registrar`, `cashier`, `principal`) to govern admissions, fee collection (both Stripe online and manual cashier payments), academic grading lock/unlock, and school-wide audit trails.

---

## 2. Technology Stack & Integrations

- **Web Framework**: Next.js 15+ (App Router), TypeScript in strict mode, React 19, Tailwind CSS, shadcn/ui design tokens.
- **Authentication**: Clerk Authentication integrated with Supabase RLS using native Clerk JWT template (`supabase` claims with `sub`, `email`, `role`, and `school_id`).
- **Database & Storage**: Supabase (PostgreSQL 15+ with pg_cron, Row Level Security, Realtime, Storage buckets for documents/submissions).
- **Payment Providers**: `PaymentProvider` interface supporting Stripe Checkout + Webhook verification (PHP currency), with built-in manual cashier payment recording (Cash, Bank Deposit, GCash/Maya reference).
- **Email & Communications**: `EmailProvider` interface powered by Resend + React Email templates.
- **SMS Gateway**: `SmsProvider` interface with a structured logging and SMS mock/live adapter (e.g., Semaphore / Twilio).
- **Video & Live Lessons**: `VideoProvider` interface generating Google Meet links and embedded room providers (e.g. Jitsi / LiveKit).
- **Originality / Similarity**: `OriginalityProvider` interface with similarity report generation stub.
- **Document Generation**: `@react-pdf/renderer` for Report Cards (Form 137 style), Official Receipts, and Printable School IDs; `ExcelJS` for bulk spreadsheets and grade/fee exports.
- **Offline / PWA**: Web Manifest, Service Worker caching for schedule/grades/materials, and offline queue for attendance sync.
- **Testing**: Vitest for unit & business logic (weighted grades, ledger balancing, webhook idempotency, RLS mock), Playwright for end-to-end flows.

---

## 3. Four Role-Based Portals & Sub-Permissions

### 3.1 Admin Portal (`/admin`)
- **System Administration & Settings**: Academic years, terms/quarters, grade levels, sections, subjects, classrooms, grading scales, and privacy/retention settings.
- **Sub-Permissions (Flags in `admin_permissions`)**:
  - `is_super_admin`: Full access to school config, role assignments, and audit logs.
  - `can_manage_academics` (Principal / Academic Head): Section assignments, teacher allocations, grade lock/unlock, curriculum, honor rolls.
  - `can_manage_admissions` (Registrar): Online applications, document verification, enrollment approvals, Form 137/transcripts.
  - `can_manage_finance` (Cashier / Finance): Fee structures, manual receipts, online billing, ledger balances, refunds.
- **Analytics & Reports**: Visual charts for student enrollment, attendance rates, tuition collection, and academic risk. Exportable to PDF and Excel.
- **Audit Viewer**: Real-time view of trigger-logged mutations (grades, enrollments, payments, role changes).

### 3.2 Teacher Portal (`/teacher`)
- **My Classes & Timetable**: Dynamic view of assigned sections, subjects, room assignments, and student rosters.
- **Classroom Stream & Classwork**: Create announcements, materials, topics, assignments, and auto-graded quizzes.
- **Grading Workspace**: Submission review queue, rubric scoring, private teacher-student comments, returned work, and 1-click sync to SMS gradebook.
- **Attendance Encoding**: Daily homeroom or subject-based attendance marking (Present, Late, Absent, Excused) with automated parent alert dispatch.
- **SMS Gradebook**: Weighted component grades (Written Work, Performance Tasks, Quarterly Assessments) with automatic quarterly grade computation and lock verification.
- **Advisory & Student Insights**: Homeroom student performance, at-risk flags, behavioral incident logging, and guidance referral.

### 3.3 Student Portal (`/student`)
- **Dashboard & To-Do List**: Real-time agenda of upcoming due dates, today's timetable, announcements, and unsubmitted classwork.
- **My Classes**: Google Classroom-style stream, assignments, learning materials, classmates, and live lesson links (Google Meet).
- **Submissions**: Direct file upload to Supabase Storage, Google Drive attachments, turn-in, unsubmit, and private teacher comments.
- **Grades & Report Card**: Real-time view of computed grades, teacher feedback, and downloadable PDF report cards.
- **Fees & Ledger**: Transparent statement of account, upcoming installment dues, and payment history.
- **Library & Timetable**: Book catalog search, borrowed books tracking, and personal weekly schedule.

### 3.4 Parent / Guardian Portal (`/parent`)
- **Multi-Child Switching**: Switch seamlessly between linked children without logging out.
- **Academic Monitoring**: View real-time grades, teacher feedback, quarterly report card previews, and honor roll status.
- **Instant Attendance Alerts**: Daily status and immediate notifications when a child is marked absent or tardy.
- **Tuition & Online Payments**: View student balance, installment breakdown, pay securely via Stripe (card, e-wallets), and download official payment receipts.
- **Guardian Summaries**: Automated weekly digest preview of upcoming assignments, missing tasks, and school announcements.
- **Consent & Permission Slips**: Digital approval for school trips, health consent, and event RSVPs.

---

## 4. Cross-Portal Access Matrix

| Feature / Domain | Admin (Super/Principal/Registrar/Cashier) | Teacher | Student | Parent / Guardian |
| :--- | :--- | :--- | :--- | :--- |
| **User & Role Management** | Full (filtered by role flag) | None | None | None |
| **School Setup & Timetables** | Full Manage | View Assigned | View Schedule | View Child Schedule |
| **Student Profiles & Medical** | Full Manage (Restricted Medical) | View Assigned Class | Own Profile | Linked Child Only |
| **Admissions & Enrollment** | Full Manage (Registrar) | View Roster | Self-Apply / View | Child Enrollment |
| **Attendance** | Monitor & School-wide Reports | Encode & Edit (Assigned) | View Own | View Child (Alerts) |
| **Gradebook & Computations** | Lock / Unlock / Release | Encode & Calculate | View Own | View Child |
| **Tuition & Payments** | Structure & Manual Entry (Cashier) | None | View Own Ledger | View & Pay Online |
| **Classrooms & Stream** | Oversight & Archive | Manage Class Stream | Participate / Post | Read-Only Feed |
| **Assignments & Quizzes** | Audit & Template Library | Create, Grade, Return | Complete & Submit | View Child Status |
| **Private Comments** | None (Privacy Enforced) | Teacher $\leftrightarrow$ Student | Student $\leftrightarrow$ Teacher | None |
| **Live Classes** | Oversight | Host / Start Session | Join Meeting | None |
| **Guardian Summaries** | Schedule & Template Config | Trigger / View Notes | None | Receive Email / Feed |
| **Behavior & Health Records** | Full / Guidance Restricted | Log & View Homeroom | None | View Child Behavior |

---

## 5. Phased Delivery Plan

### Tier A: Core Foundations (Immediate Priority)
1. **Architecture & Foundation**: Next.js App Router, Supabase client & admin client, Clerk auth webhook, unified schema with multi-tenancy `school_id`, RLS policies, audit triggers, and design system.
2. **School Setup & Academic Hierarchy**: Academic years, quarters, grade levels, sections, subjects, classrooms, and teacher assignments.
3. **Student Information & Admissions**: Student profiles, guardian links, documents, online admissions review & section allocation.
4. **Attendance Engine**: Daily & per-subject attendance, QR check-in option, absence thresholds, parent notifications.
5. **Grading & Report Cards**: Weighted grade categories (DepEd/standard weights), score encoding, automated GPA/quarter computation, grade locking, and `@react-pdf/renderer` Form 137 / Report Card generation.
6. **Tuition & Fees**: Fee structures, student ledgers, Stripe online checkout + webhook, cashier manual payment recording, receipt generation.
7. **Classroom Core**: Automatic class generation from sections, stream announcements, assignments with attachments, submission workflow (turn in/unsubmit), grading workspace, and auto-sync to gradebook.
8. **Portals & Notification System**: Complete Admin, Teacher, Student, and Parent dashboards with real database integration, alerts, and guardian summary digests.

### Tier B: Learning & Communication Layer
1. **Auto-Graded Quizzes**: Multiple choice, short answer, question bank, countdown timer.
2. **Rubrics**: Structured criterion and levels with 1-click grade calculations.
3. **Live Classes & Google Integrations**: VideoProvider (Meet / Jitsi), live attendance capture, and Google Drive picker integration.
4. **Teacher Tools & Scheduling**: Lesson planning, homeroom advisory reports, timetable conflict detection.
5. **Discipline, Health & Guidance**: Restricted counseling logs, clinic visits, vaccination tracking.
6. **Analytics**: Real-time charts for enrollment, attendance, financial recovery, and at-risk students with Excel exports.

### Tier C: Operations & Extensions
1. **Staff & HR**: Teacher profiles, workload management, and leave requests.
2. **Campus Operations**: Library catalog and loans, asset tracking, transport bus routes, hostel rooms.
3. **Document Engine**: Printable Student ID cards and Certificates of Enrollment.
4. **PWA & Offline Capability**: Service Worker caching of timetables and grades, with offline attendance queue.
