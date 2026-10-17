# Database Schema & Data Dictionary

This document defines the complete PostgreSQL database schema for the unified School Management System & Classroom Platform. All tables reside in PostgreSQL with Row Level Security (RLS) enabled and mandatory `school_id` multi-tenancy keys.

---

## 1. Schema Conventions
- **Identifiers**: `snake_case` for tables and columns.
- **Primary Keys**: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
- **Multi-Tenancy**: Every entity includes `school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE`.
- **Timestamps**: Every table has `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
- **Enums & Types**: Controlled types via Postgres `TEXT` check constraints or `CREATE TYPE` for ease of schema evolution.

---

## 2. Core SMS Tables

### 2.1 Multi-Tenancy & School Setup
- **`schools`**:
  - `id` (UUID, PK)
  - `name` (TEXT NOT NULL)
  - `code` (TEXT UNIQUE NOT NULL)
  - `logo_url` (TEXT)
  - `timezone` (TEXT NOT NULL DEFAULT 'Asia/Manila')
  - `currency` (TEXT NOT NULL DEFAULT 'PHP')
  - `address` (TEXT)
  - `contact_email` (TEXT)
  - `contact_phone` (TEXT)
  - `is_active` (BOOLEAN DEFAULT TRUE)

- **`academic_years`**:
  - `id` (UUID, PK), `school_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "S.Y. 2025-2026"
  - `start_date` (DATE NOT NULL)
  - `end_date` (DATE NOT NULL)
  - `is_active` (BOOLEAN DEFAULT FALSE) — Exactly one active per school

- **`grading_periods`** (Quarters / Semesters):
  - `id` (UUID, PK), `school_id` (UUID, FK), `academic_year_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Q1", "Q2", "Q3", "Q4"
  - `code` (TEXT NOT NULL) — e.g. "Q1"
  - `sequence` (INT NOT NULL) — 1, 2, 3, 4
  - `start_date` (DATE NOT NULL)
  - `end_date` (DATE NOT NULL)
  - `is_locked` (BOOLEAN DEFAULT FALSE) — Admin lock on grade submission

- **`grade_levels`**:
  - `id` (UUID, PK), `school_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Grade 7", "Grade 10", "Grade 12"
  - `level_number` (INT NOT NULL) — e.g. 7, 10, 12
  - `department` (TEXT NOT NULL DEFAULT 'Junior High') — e.g. 'Elementary', 'Junior High', 'Senior High'

- **`sections`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `academic_year_id` (UUID, FK), `grade_level_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Rizal", "Bonifacio", "Einstein"
  - `room_id` (UUID, FK)
  - `adviser_id` (UUID, FK to users) — Homeroom teacher
  - `capacity` (INT NOT NULL DEFAULT 40)

- **`subjects`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `grade_level_id` (UUID, FK)
  - `code` (TEXT NOT NULL) — e.g. "MATH-10"
  - `name` (TEXT NOT NULL) — e.g. "Advanced Mathematics"
  - `units` (NUMERIC(3,1) DEFAULT 1.0)
  - `description` (TEXT)

- **`rooms`**:
  - `id` (UUID, PK), `school_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Room 302", "Science Lab 1"
  - `building` (TEXT)
  - `capacity` (INT DEFAULT 45)

---

### 2.2 Users & Identity Scoping
- **`users`**:
  - `id` (UUID, PK) — References Clerk user ID / internal UUID
  - `clerk_id` (TEXT UNIQUE NOT NULL)
  - `school_id` (UUID, FK)
  - `email` (TEXT NOT NULL)
  - `first_name` (TEXT NOT NULL)
  - `last_name` (TEXT NOT NULL)
  - `phone` (TEXT)
  - `avatar_url` (TEXT)
  - `role` (TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student', 'parent')))
  - `status` (TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')))

- **`admin_permissions`**:
  - `user_id` (UUID, PK, FK to users)
  - `school_id` (UUID, FK)
  - `is_super_admin` (BOOLEAN DEFAULT FALSE)
  - `can_manage_academics` (BOOLEAN DEFAULT FALSE) — Principal / Academic Head
  - `can_manage_admissions` (BOOLEAN DEFAULT FALSE) — Registrar
  - `can_manage_finance` (BOOLEAN DEFAULT FALSE) — Cashier

- **`student_profiles`**:
  - `id` (UUID, PK), `user_id` (UUID, UNIQUE FK to users), `school_id` (UUID, FK)
  - `lrn` (TEXT UNIQUE) — Learner Reference Number (12 digits in Philippines)
  - `gender` (TEXT CHECK (gender IN ('male', 'female', 'other')))
  - `birth_date` (DATE)
  - `address` (TEXT)
  - `emergency_contact_name` (TEXT)
  - `emergency_contact_phone` (TEXT)
  - `blood_type` (TEXT)
  - `allergies` (TEXT)
  - `medical_notes` (TEXT) — Restricted access

- **`guardian_students`** (Parent-to-Student Multi-Child Link):
  - `id` (UUID, PK), `school_id` (UUID, FK)
  - `guardian_user_id` (UUID, FK to users with role 'parent')
  - `student_id` (UUID, FK to student_profiles)
  - `relationship` (TEXT NOT NULL DEFAULT 'Parent') — 'Mother', 'Father', 'Guardian'
  - `is_primary` (BOOLEAN DEFAULT TRUE)
  - `can_view_grades` (BOOLEAN DEFAULT TRUE)
  - `can_view_billing` (BOOLEAN DEFAULT TRUE)

---

### 2.3 Admissions, Enrollments & Attendance
- **`admissions_applications`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `academic_year_id` (UUID, FK), `grade_level_id` (UUID, FK)
  - `application_no` (TEXT UNIQUE NOT NULL)
  - `first_name` (TEXT NOT NULL), `last_name` (TEXT NOT NULL), `email` (TEXT NOT NULL), `phone` (TEXT)
  - `birth_date` (DATE), `gender` (TEXT), `previous_school` (TEXT)
  - `guardian_name` (TEXT), `guardian_email` (TEXT), `guardian_phone` (TEXT)
  - `documents` (JSONB DEFAULT '[]'::jsonb) — URLs to birth certificate, Form 138, etc.
  - `status` (TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'exam_scheduled', 'approved', 'rejected', 'enrolled')))
  - `review_notes` (TEXT)

- **`enrollments`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `student_id` (UUID, FK), `academic_year_id` (UUID, FK), `section_id` (UUID, FK)
  - `enrollment_date` (DATE NOT NULL DEFAULT CURRENT_DATE)
  - `status` (TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'transferred', 'graduated')))

- **`attendance_records`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `student_id` (UUID, FK), `section_id` (UUID, FK), `class_id` (UUID, FK NULLABLE)
  - `date` (DATE NOT NULL)
  - `status` (TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'excused')))
  - `remarks` (TEXT)
  - `recorded_by_user_id` (UUID, FK to users)
  - `check_in_time` (TIMESTAMPTZ)
  - UNIQUE(`student_id`, `section_id`, `class_id`, `date`)

---

### 2.4 Grading Engine & SMS Gradebook
- **`grading_components`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `subject_id` (UUID, FK), `academic_year_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Written Work", "Performance Tasks", "Quarterly Assessment"
  - `weight_percentage` (NUMERIC(5,2) NOT NULL) — e.g. 30.00, 50.00, 20.00 (must sum to 100%)

- **`sms_gradebook_entries`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `student_id` (UUID, FK), `class_id` (UUID, FK), `grading_period_id` (UUID, FK)
  - `component_id` (UUID, FK to grading_components NULLABLE)
  - `raw_score` (NUMERIC(6,2))
  - `max_score` (NUMERIC(6,2))
  - `percentage_score` (NUMERIC(5,2))
  - `transmuted_grade` (NUMERIC(5,2)) — DepEd transmuted rating (60-100)
  - `is_final` (BOOLEAN DEFAULT FALSE)
  - `remarks` (TEXT) — e.g. "Passed", "Failed"

---

### 2.5 Fees, Billing & Payments
- **`fee_structures`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `academic_year_id` (UUID, FK), `grade_level_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Grade 10 Standard Annual Tuition"
  - `tuition_amount` (NUMERIC(10,2) NOT NULL)
  - `misc_amount` (NUMERIC(10,2) NOT NULL DEFAULT 0.00)
  - `total_amount` (NUMERIC(10,2) NOT NULL)
  - `installment_options` (JSONB) — Breakdown for annual, semi-annual, quarterly, monthly plans

- **`student_ledgers`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `student_id` (UUID, FK), `academic_year_id` (UUID, FK)
  - `fee_structure_id` (UUID, FK)
  - `total_assessed` (NUMERIC(10,2) NOT NULL)
  - `total_discount` (NUMERIC(10,2) NOT NULL DEFAULT 0.00)
  - `total_paid` (NUMERIC(10,2) NOT NULL DEFAULT 0.00)
  - `remaining_balance` (NUMERIC(10,2) NOT NULL)
  - `status` (TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'fully_paid', 'overdue')))

- **`payments`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `student_ledger_id` (UUID, FK), `student_id` (UUID, FK)
  - `receipt_number` (TEXT UNIQUE NOT NULL) — e.g. "OR-2026-0001"
  - `amount` (NUMERIC(10,2) NOT NULL)
  - `payment_method` (TEXT NOT NULL CHECK (payment_method IN ('stripe_card', 'stripe_gcash', 'cash', 'bank_deposit', 'e_wallet_manual')))
  - `transaction_reference` (TEXT) — Stripe PaymentIntent ID or Cashier Ref
  - `status` (TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')))
  - `received_by_user_id` (UUID, FK to users) — Cashier user or system
  - `notes` (TEXT)

---

## 3. Classroom (Learning) Tables

- **`classes`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `academic_year_id` (UUID, FK), `section_id` (UUID, FK), `subject_id` (UUID, FK)
  - `primary_teacher_id` (UUID, FK to users)
  - `name` (TEXT NOT NULL) — e.g. "Grade 10 Mathematics - Rizal"
  - `class_code` (TEXT UNIQUE) — 6-7 char alphanumeric invite code
  - `room` (TEXT)
  - `schedule_text` (TEXT) — e.g. "MWF 08:00 - 09:30 AM"
  - `is_archived` (BOOLEAN DEFAULT FALSE)

- **`class_teachers`** (Co-Teachers & Assistants):
  - `class_id` (UUID, FK), `user_id` (UUID, FK to users), `role` (TEXT DEFAULT 'co_teacher')
  - PRIMARY KEY(`class_id`, `user_id`)

- **`class_rosters`**:
  - `class_id` (UUID, FK), `student_id` (UUID, FK to student_profiles), `joined_at` (TIMESTAMPTZ DEFAULT NOW())
  - PRIMARY KEY(`class_id`, `student_id`)

- **`topics`**:
  - `id` (UUID, PK), `class_id` (UUID, FK), `school_id` (UUID, FK)
  - `name` (TEXT NOT NULL) — e.g. "Quarter 1: Polynomials"
  - `sequence` (INT NOT NULL DEFAULT 0)

- **`stream_posts`** (Announcements & Discussions):
  - `id` (UUID, PK), `class_id` (UUID, FK), `school_id` (UUID, FK), `author_id` (UUID, FK to users)
  - `title` (TEXT)
  - `content` (TEXT NOT NULL)
  - `attachments` (JSONB DEFAULT '[]'::jsonb)
  - `is_pinned` (BOOLEAN DEFAULT FALSE)

- **`stream_comments`**:
  - `id` (UUID, PK), `post_id` (UUID, FK), `school_id` (UUID, FK), `author_id` (UUID, FK to users)
  - `content` (TEXT NOT NULL)
  - `is_moderated` (BOOLEAN DEFAULT FALSE)

- **`assignments`**:
  - `id` (UUID, PK), `class_id` (UUID, FK), `topic_id` (UUID, FK NULLABLE), `school_id` (UUID, FK)
  - `title` (TEXT NOT NULL)
  - `description` (TEXT)
  - `points` (INT NOT NULL DEFAULT 100)
  - `due_date` (TIMESTAMPTZ)
  - `grading_component_id` (UUID, FK to grading_components)
  - `grading_period_id` (UUID, FK to grading_periods)
  - `attachments` (JSONB DEFAULT '[]'::jsonb)
  - `status` (TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')))

- **`submissions`**:
  - `id` (UUID, PK), `assignment_id` (UUID, FK), `student_id` (UUID, FK), `school_id` (UUID, FK)
  - `status` (TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'turned_in', 'missing', 'late', 'returned', 'graded')))
  - `submitted_at` (TIMESTAMPTZ)
  - `score` (NUMERIC(5,2))
  - `graded_by_user_id` (UUID, FK to users)
  - `graded_at` (TIMESTAMPTZ)
  - `feedback` (TEXT)
  - UNIQUE(`assignment_id`, `student_id`)

- **`submission_attachments`**:
  - `id` (UUID, PK), `submission_id` (UUID, FK), `school_id` (UUID, FK)
  - `file_name` (TEXT NOT NULL)
  - `file_url` (TEXT NOT NULL)
  - `file_size` (INT)
  - `mime_type` (TEXT)

- **`submission_comments`** (Private Teacher-Student Dialogue):
  - `id` (UUID, PK), `submission_id` (UUID, FK), `school_id` (UUID, FK), `author_id` (UUID, FK to users)
  - `content` (TEXT NOT NULL)

---

## 4. Operational & Audit Tables

- **`audit_logs`**:
  - `id` (UUID, PK), `school_id` (UUID, FK)
  - `table_name` (TEXT NOT NULL)
  - `record_id` (UUID NOT NULL)
  - `action` (TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')))
  - `old_data` (JSONB)
  - `new_data` (JSONB)
  - `changed_by_user_id` (UUID, FK to users)
  - `ip_address` (TEXT)
  - `created_at` (TIMESTAMPTZ NOT NULL DEFAULT NOW())

- **`notifications`**:
  - `id` (UUID, PK), `school_id` (UUID, FK), `recipient_user_id` (UUID, FK to users)
  - `title` (TEXT NOT NULL)
  - `message` (TEXT NOT NULL)
  - `type` (TEXT NOT NULL CHECK (type IN ('absence', 'late_work', 'fee_reminder', 'grade_posted', 'announcement')))
  - `read` (BOOLEAN DEFAULT FALSE)
  - `link_url` (TEXT)
