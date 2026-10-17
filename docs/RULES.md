# Engineering Rules & Architectural Constraints

This document defines the strict, non-negotiable coding and security standards for this codebase.

---

## 1. Architectural Boundaries & Code Organization

1. **Separation of Concerns**:
   - **UI Components (`src/components/`)**: Pure presentation, layout, accessible interactions, and form inputs. No direct database queries or raw Stripe/Resend API calls inside UI components.
   - **Server Actions & Route Handlers (`src/app/actions/` & `src/app/api/`)**: Handle HTTP requests, authenticate callers, validate payloads with Zod schemas, invoke service domain methods, and return serialized responses.
   - **Domain Services (`src/lib/services/`)**: Business logic (grade computations, attendance calculations, fee balancing, report card formatting).
   - **Provider Interfaces (`src/lib/providers/`)**: Strictly typed interfaces for external infrastructure (`PaymentProvider`, `EmailProvider`, `SmsProvider`, `VideoProvider`, `OriginalityProvider`). Never hardcode third-party API clients directly in page code.

2. **Route Groups & Roles**:
   - Every portal lives in its isolated route group: `(admin)`, `(teacher)`, `(student)`, `(parent)`.
   - Shared layouts provide role-specific sidebars and mobile bottom navigation.
   - Route protection middleware performs initial role routing, but Postgres Row-Level Security (RLS) remains the authoritative security boundary.

---

## 2. Database & Row-Level Security (RLS) Mandates

1. **Mandatory Columns**:
   - Every table must have a primary key `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`.
   - Every table must contain `school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE`.
   - Every table must contain `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.

2. **RLS on Every Table**:
   - `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;` is required on every created table without exception.
   - Policies must check `school_id = (auth.jwt() ->> 'school_id')::uuid`.
   - Policies enforce the cross-portal access matrix:
     - Admin access filtered by `admin_permissions` flags.
     - Teacher access restricted to assigned sections, subjects, and classes.
     - Student access restricted to their own `student_id`.
     - Parent access restricted strictly to their verified linked children in `guardian_students`.

3. **Supabase CLI & Migrations**:
   - Schema modifications are executed exclusively through sequential SQL migration files in `/supabase/migrations`.
   - No direct out-of-band schema edits.
   - Use idempotent statements (`CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`).

4. **Audit Logging**:
   - Changes to grades (`sms_gradebook_entries`), enrollments (`enrollments`), payments (`payments`), and user roles must invoke the central `record_audit_log()` PostgreSQL trigger.

---

## 3. Security, Authentication & Data Privacy (Philippine DPA 2012)

1. **Service Role Key Hygiene**:
   - The Supabase `SERVICE_ROLE_KEY` is strictly server-side. It must never be prefixed with `NEXT_PUBLIC_` or bundled into client code.
   - Use the service role client exclusively for background webhook processing, cron runners, and administrative user bootstrapping.

2. **Role Assignment Security**:
   - User roles can only be granted by administrators with `is_super_admin` or explicit management permissions.
   - Users can never assign, promote, or alter their own roles during sign-up or profile update.

3. **Student Privacy & Communication**:
   - No direct student-to-student private messaging is permitted by default.
   - Private assignment comments are scoped strictly between the assigned teacher and the submitting student.
   - Sensitive medical and psychological counseling notes are isolated with restricted RLS policies and never exposed to general staff.

4. **File Storage Security**:
   - Student submissions, medical documents, and payment receipts must reside in protected private Supabase Storage buckets.
   - Files are served strictly via short-lived signed URLs generated on the server.
   - File uploads validate MIME types and enforce file size caps (max 25MB for submissions, max 5MB for images/PDFs).

---

## 4. Financial & Payment Processing Rules

1. **Stripe & Webhook Idempotency**:
   - All Stripe webhook events must verify the cryptographic signature (`stripe-signature`).
   - Payment event processing must be idempotent: duplicate event deliveries must never result in duplicate credits on the student ledger.
   - Every payment records a unique `transaction_reference`.

2. **Dual Payment Channels**:
   - Online payments go through Stripe (PHP currency).
   - Manual payments (cash over the counter, bank deposit, GCash/Maya mobile wallet reference) must be supported for Cashiers.
   - Official receipt numbers must follow an immutable sequential format (e.g. `OR-2026-00001`).

---

## 5. Coding & TypeScript Standards

1. **Strict Type Safety**:
   - TypeScript `strict: true` must be enabled in `tsconfig.json`.
   - Explicit types for function signatures and API responses.
   - No `any` type annotations; use `unknown` with type guards or Zod schemas.

2. **Form & Data Validation**:
   - All user inputs must be parsed with Zod schemas before database insertion.
   - Error messages must be descriptive and user-friendly.

3. **Timezone & Locale Standards**:
   - All server operations and database records store timestamps in UTC (`TIMESTAMPTZ`).
   - UI formatting defaults to `Asia/Manila` (UTC+8) using standard date formatting utilities.
   - Currency formatting defaults to Philippine Peso (`₱` / `PHP`).
