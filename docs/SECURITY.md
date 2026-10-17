# Security Architecture & Data Privacy Model

## 1. Overview
The platform safeguards student, family, and faculty records with defense-in-depth principles:
1. **Database Row Level Security (RLS)** is the authoritative security boundary. UI views and server actions strictly operate under RLS constraints.
2. **Philippine Data Privacy Act of 2012 (Republic Act No. 10173)** principles are enforced across all services dealing with minors' educational and medical records.
3. **Clerk Native Supabase JWT Integration**: Authenticated requests forward verified JWT tokens containing `sub`, `school_id`, and `role` claims to PostgreSQL.

---

## 2. Row Level Security (RLS) Policy Model

Every table in the PostgreSQL database carries `school_id UUID NOT NULL REFERENCES schools(id)`.

### 2.1 Multi-Tenancy Scoping
- The SQL function `auth_school_id()` extracts the school identifier directly from the decrypted JWT payload:
  ```sql
  (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'school_id')::uuid
  ```
- Any query attempting to access or modify rows where `school_id != auth_school_id()` is rejected at the Postgres kernel level, preventing cross-tenant data leaks.

### 2.2 Parent-Student Relationship Scoping
- Parents and guardians can **only** inspect records of students linked in `guardian_students`:
  ```sql
  student_id IN (
    SELECT student_id FROM guardian_students 
    WHERE guardian_user_id = current_user_id()
  )
  ```
- Sibling switching is managed within the same guardian user session without token mutation.
- Unlinked students or other families' financial balances are invisible.

### 2.3 Student Isolation
- Students are strictly isolated to their own `user_id` and assigned `student_profile.id`.
- Peer assignment submissions, grade details, and personal statement of accounts are blocked.

### 2.4 Faculty / Teacher Scoping
- Teachers can only view and manage rosters, attendance records, and gradebook scores for their **assigned sections and subjects** (`primary_teacher_id = current_user_id()` or co-teacher links).
- Teachers cannot view or alter financial ledgers or unassigned grade levels.

---

## 3. Grade Locking Mechanism
- Each academic quarter (`grading_periods`) features an `is_locked` boolean flag.
- When `is_locked = TRUE`, database RLS policies immediately reject `INSERT`, `UPDATE`, and `DELETE` on `sms_gradebook_entries` for non-admin roles:
  ```sql
  CREATE POLICY "Teachers encode grades when period is not locked"
  ON sms_gradebook_entries FOR ALL
  USING (
    school_id = auth_school_id()
    AND (auth_user_role() = 'admin' OR (auth_user_role() = 'teacher' AND is_locked = FALSE))
  );
  ```
- Unlocking for formal student grade appeals requires Administrator authorization, which logs an immutable audit trail entry.

---

## 4. Minors' Data Privacy (Philippine DPA 2012)

1. **Student Safety & Messaging**:
   - Direct student-to-student private messaging is disabled by default.
   - Assignment comments are private and scoped strictly between the teacher and the submitting student.
   - Class stream announcements and discussion comments can be muted or moderated by faculty.

2. **Sensitive Health & Psychological Records**:
   - Student clinic visits, medical allergies, and counselor notes are guarded under restricted RLS policies accessible only to licensed school nurses, counselors, and principals.

3. **Database Audit Logging**:
   - The PostgreSQL trigger `trigger_audit_log_record()` intercepts every mutation across grades, payments, enrollments, and user roles.
   - Captured logs include `old_data`, `new_data`, `changed_by_user_id`, and `created_at`.
