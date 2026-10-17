# Architecture & Engineering Specifications

This document outlines the architecture, data flow, and design specifications for the unified School Management System & Google Classroom-style Learning Platform.

Refer to the primary architecture document:
- [Implementation Plan, ERD & RLS Matrix](file:///C:/Users/Al-SaniMinalang/.gemini/antigravity-ide/brain/56509cd6-f304-4f7e-813c-65490f3bfb79/architecture_and_plan.md)

## Core Architectural Decisions

### 1. Unified Relational Foundation (Supabase PostgreSQL)
Unlike legacy setups where the Learning Management System (LMS) and Student Information System (SIS) are loosely paired via nightly CSV imports, this platform connects them in real-time on PostgreSQL.
- A **Class** in the classroom corresponds directly to an academic **Section** + **Subject** + **Academic Year**.
- When a student is enrolled into a section via the Registrar workflow, the student is instantly a member of that section's classroom roster.
- When a teacher records grades on an assignment or quiz, the score is directly syncable to the SMS Gradebook table with weighted categories (e.g. 30% Written Work, 50% Performance Task, 20% Quarterly Exam).

### 2. Next.js 15 App Router & Route Groups
We use Next.js route groups to separate the four distinct user experiences while sharing a unified design token system:
- `/(admin)`: Administrative consoles, admissions pipeline, fee billing, system logs, academic configuration.
- `/(teacher)`: Teaching workspace, roster management, attendance sheet, assignment creation, submission review queue, gradebook encoding.
- `/(student)`: Agenda dashboard, to-do list, classroom stream, submission upload, personal grade cards, fee balance.
- `/(parent)`: Multi-child family dashboard, attendance alerts, payment portal, progress reports, consent slips.
- `/(auth)`: Sign in, sign up, callback, and role-selection routing.

### 3. Provider Abstraction Architecture
All third-party services are wrapped behind clean TypeScript interfaces located in `src/lib/providers/`:
- `PaymentProvider`: Stripe checkout session creation, webhook signature verification, manual cashier payment recording.
- `EmailProvider`: Resend integration with fallback logging for local development.
- `SmsProvider`: Semaphore / Twilio compatible interface with structured console logging for dev.
- `VideoProvider`: Google Meet link generation and embedded live video room creation.
- `OriginalityProvider`: Plagiarism/similarity check interface.

### 4. Row-Level Security (RLS) & Multi-Tenancy
Every table has `school_id UUID NOT NULL REFERENCES schools(id)`.
All queries are guarded by Postgres Row-Level Security using session claims passed through Clerk's native Supabase JWT integration (`request.jwt.claims->>'sub'` and `request.jwt.claims->>'school_id'`).

### 5. Automated Audit Logging via PostgreSQL Triggers
An immutable `audit_logs` table records every `INSERT`, `UPDATE`, and `DELETE` on sensitive tables (Grades, Payments, Enrollments, Roles). It captures `old_data`, `new_data`, `changed_by_user_id`, `ip_address`, and `timestamp`.
