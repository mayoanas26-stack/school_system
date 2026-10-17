# Philippine Science & Arts Academy (PSAA)
## Unified School Management System (SMS) + Google Classroom-Style Learning Platform

A production-grade, full-stack educational platform built with Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, Clerk Auth, Stripe Payments, and Resend.

---

## 🌟 Key Capabilities

### 1. Four Role-Based Portals Under One Codebase
- **Admin Portal (`/admin`)**: Full school governance, admissions approval pipeline, cashier manual payment recording, DepEd Form 138 report card generation, grade locking with appeal overrides, and database trigger audit logs.
- **Teacher Portal (`/teacher`)**: Google Classroom-style stream, assignments creation, rubric scoring, private student dialogue, attendance sheet with instant parent absence alerts, and SMS gradebook encoding with DepEd weights (30% WW, 50% PT, 20% QA).
- **Student Portal (`/student`)**: Agenda dashboard, homework turn-in & unsubmit workflow, to-do list, report card download, live video lesson launcher (Google Meet), and fee ledger.
- **Parent / Guardian Portal (`/parent`)**: Multi-child switching (one login for siblings across different grade levels), real-time attendance logs with absence SMS alerts, tuition balance review, Stripe online payment (Credit/Debit/GCash), and weekly digests.

### 2. Zero Redundant Data Flow
- Academic sections and teacher assignments automatically provision Google Classroom-style courses and sync student rosters.
- Graded assignments in the classroom automatically sync scores to the SMS gradebook table.
- Over-the-counter cashier payments and online Stripe checkouts update the same student ledger and generate sequential official receipts.

### 3. Philippine Context & Compliance
- **Localization**: Default timezone `Asia/Manila` (PHT, GMT+8) and currency `PHP (₱)`.
- **DepEd Standards**: Official K-12 Transmuted Rating Scale (60-100), DepEd Form 138-A Progress Report Card PDF issuance, and 12-digit Learner Reference Numbers (LRN).
- **Data Privacy Act of 2012 (RA 10173)**: Strict Row Level Security, private teacher-student comments, disabled direct student-to-student messaging by default, and restricted clinic/counselor records.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal launchpad.

---

## 🧪 Demo Test Accounts

The platform includes seed data and a quick role switcher in the top navigation bar:

| Role | Name | Email | Focus Areas |
| :--- | :--- | :--- | :--- |
| **Admin** | Dr. Maria Santos | `admin@school.edu.ph` | Full oversight, admissions, cashier, grade lock |
| **Teacher** | Prof. Juan Dela Cruz | `teacher@school.edu.ph` | Math 10 & Science 10, attendance sheet, grading queue |
| **Student** | Gabriel Dela Cruz | `student@school.edu.ph` | Grade 10 - Rizal, turn in assignments, Form 138 |
| **Parent** | Mrs. Corazon Dela Cruz | `parent@school.edu.ph` | Multi-child (Gabriel Gr. 10 & Sofia Gr. 7), Stripe checkout |

---

## 📂 Documentation Deliverables

- [Architecture Overview & System Flow](file:///docs/ARCHITECTURE.md)
- [Design System & UI Guidelines](file:///docs/DESIGN.md)
- [Product Requirements Document (PRD)](file:///docs/PRD.md)
- [Coding & Security Rules](file:///docs/RULES.md)
- [PostgreSQL Database Schema & Data Dictionary](file:///docs/SCHEMA.md)
- [Security & Row Level Security (RLS) Model](file:///docs/SECURITY.md)
- [Deployment & Supabase/Clerk Guide](file:///docs/DEPLOYMENT.md)
- [Module Implementation Progress Checklist](file:///docs/PROGRESS.md)

---

## 🧪 Running Tests

### Unit & RLS Isolation Tests (Vitest)
```bash
npx vitest run
```
Tests cover:
- DepEd grade transmutation and weighted formulas
- Fee ledger balancing and discount deductions
- Stripe webhook signature validation & idempotency
- Postgres RLS multi-tenant, student, teacher, and parent scoping

### End-to-End Tests (Playwright)
```bash
npx playwright test
```
Tests cover:
- Role navigation across all 4 portals
- Admissions applicant review and section allocation
- Teacher daily attendance marking and alert dispatch
- Classroom homework submission, rubric scoring, and SMS gradebook sync
- Tuition payment and official receipt issuance
