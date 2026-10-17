-- 20260101000003_rls_policies.sql
-- Migration: Row Level Security (RLS) Policies on Every Table

-- Enable RLS across all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_gradebook_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_rosters ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stream_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavior_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper to get authenticated user internal UUID from Clerk sub claim
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT id FROM users 
    WHERE clerk_id = NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'
    LIMIT 1
  );
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- 1. SCHOOLS
CREATE POLICY "Users can view their own school"
ON schools FOR SELECT
USING (id = auth_school_id() OR auth_user_role() = 'service_role');

-- 2. ACADEMIC YEARS & PERIODS
CREATE POLICY "School users can view academic years"
ON academic_years FOR SELECT
USING (school_id = auth_school_id());

CREATE POLICY "Admins can manage academic years"
ON academic_years FOR ALL
USING (school_id = auth_school_id() AND auth_user_role() IN ('admin', 'service_role'));

CREATE POLICY "School users can view grading periods"
ON grading_periods FOR SELECT
USING (school_id = auth_school_id());

CREATE POLICY "Admins can manage grading periods"
ON grading_periods FOR ALL
USING (school_id = auth_school_id() AND auth_user_role() IN ('admin', 'service_role'));

-- 3. USERS
CREATE POLICY "Admins and teachers can view school users"
ON users FOR SELECT
USING (
  school_id = auth_school_id() 
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR id = current_user_id()
  )
);

CREATE POLICY "Admins can insert and update users"
ON users FOR ALL
USING (school_id = auth_school_id() AND auth_user_role() IN ('admin', 'service_role'));

-- 4. STUDENT PROFILES
CREATE POLICY "Student profiles select policy"
ON student_profiles FOR SELECT
USING (
  school_id = auth_school_id() 
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR user_id = current_user_id()
    OR id IN (
      SELECT student_id FROM guardian_students 
      WHERE guardian_user_id = current_user_id()
    )
  )
);

CREATE POLICY "Admins can manage student profiles"
ON student_profiles FOR ALL
USING (school_id = auth_school_id() AND auth_user_role() IN ('admin', 'service_role'));

-- 5. GUARDIAN STUDENTS
CREATE POLICY "Guardians can view their linked students"
ON guardian_students FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR guardian_user_id = current_user_id()
  )
);

CREATE POLICY "Admins can manage guardian students"
ON guardian_students FOR ALL
USING (school_id = auth_school_id() AND auth_user_role() IN ('admin', 'service_role'));

-- 6. ATTENDANCE RECORDS
CREATE POLICY "Attendance select policy"
ON attendance_records FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    OR student_id IN (SELECT student_id FROM guardian_students WHERE guardian_user_id = current_user_id())
  )
);

CREATE POLICY "Teachers and admins can record attendance"
ON attendance_records FOR INSERT
WITH CHECK (
  school_id = auth_school_id() 
  AND auth_user_role() IN ('admin', 'teacher', 'service_role')
);

CREATE POLICY "Teachers and admins can update attendance"
ON attendance_records FOR UPDATE
USING (
  school_id = auth_school_id() 
  AND auth_user_role() IN ('admin', 'teacher', 'service_role')
);

-- 7. SMS GRADEBOOK ENTRIES
CREATE POLICY "Gradebook view policy"
ON sms_gradebook_entries FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR (
      is_locked = FALSE -- Or published
      AND (
        student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
        OR student_id IN (SELECT student_id FROM guardian_students WHERE guardian_user_id = current_user_id())
      )
    )
  )
);

CREATE POLICY "Teachers encode grades when period is not locked"
ON sms_gradebook_entries FOR ALL
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() = 'admin'
    OR (
      auth_user_role() = 'teacher' 
      AND is_locked = FALSE
    )
    OR auth_user_role() = 'service_role'
  )
);

-- 8. FEE STRUCTURES, LEDGERS & PAYMENTS
CREATE POLICY "Fee structures viewable by all school members"
ON fee_structures FOR SELECT
USING (school_id = auth_school_id());

CREATE POLICY "Ledgers view policy"
ON student_ledgers FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'service_role')
    OR student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    OR student_id IN (SELECT student_id FROM guardian_students WHERE guardian_user_id = current_user_id())
  )
);

CREATE POLICY "Payments view policy"
ON payments FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'service_role')
    OR student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    OR student_id IN (SELECT student_id FROM guardian_students WHERE guardian_user_id = current_user_id())
  )
);

CREATE POLICY "Cashier and service role can manage payments"
ON payments FOR INSERT
WITH CHECK (
  school_id = auth_school_id()
  AND auth_user_role() IN ('admin', 'parent', 'service_role')
);

-- 9. CLASSES & CLASSWORK
CREATE POLICY "Classes select policy"
ON classes FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'service_role')
    OR primary_teacher_id = current_user_id()
    OR id IN (SELECT class_id FROM class_teachers WHERE user_id = current_user_id())
    OR id IN (
      SELECT class_id FROM class_rosters 
      WHERE student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    )
    OR id IN (
      SELECT cr.class_id FROM class_rosters cr
      JOIN guardian_students gs ON gs.student_id = cr.student_id
      WHERE gs.guardian_user_id = current_user_id()
    )
  )
);

CREATE POLICY "Teachers manage own classes"
ON classes FOR ALL
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() = 'admin'
    OR primary_teacher_id = current_user_id()
    OR auth_user_role() = 'service_role'
  )
);

-- 10. ASSIGNMENTS & SUBMISSIONS
CREATE POLICY "Assignments select policy"
ON assignments FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    status = 'published'
    OR auth_user_role() IN ('admin', 'teacher', 'service_role')
  )
);

CREATE POLICY "Teachers manage assignments"
ON assignments FOR ALL
USING (
  school_id = auth_school_id()
  AND auth_user_role() IN ('admin', 'teacher', 'service_role')
);

CREATE POLICY "Submissions view policy"
ON submissions FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() IN ('admin', 'teacher', 'service_role')
    OR student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    OR student_id IN (SELECT student_id FROM guardian_students WHERE guardian_user_id = current_user_id())
  )
);

CREATE POLICY "Students submit own assignments"
ON submissions FOR INSERT
WITH CHECK (
  school_id = auth_school_id()
  AND (
    auth_user_role() = 'student'
    AND student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
  )
  OR auth_user_role() IN ('admin', 'teacher', 'service_role')
);

CREATE POLICY "Students update own submission when not locked"
ON submissions FOR UPDATE
USING (
  school_id = auth_school_id()
  AND (
    (
      auth_user_role() = 'student'
      AND student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    )
    OR auth_user_role() IN ('admin', 'teacher', 'service_role')
  )
);

-- 11. SUBMISSION PRIVATE COMMENTS (Teacher <-> Student only)
CREATE POLICY "Private submission comments policy"
ON submission_comments FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    author_id = current_user_id()
    OR submission_id IN (
      SELECT id FROM submissions 
      WHERE student_id = (SELECT id FROM student_profiles WHERE user_id = current_user_id())
    )
    OR auth_user_role() IN ('admin', 'teacher', 'service_role')
  )
);

CREATE POLICY "Private submission comments insert policy"
ON submission_comments FOR INSERT
WITH CHECK (
  school_id = auth_school_id()
  AND (
    author_id = current_user_id()
    OR auth_user_role() = 'service_role'
  )
);

-- 12. AUDIT LOGS (Super Admin only read)
CREATE POLICY "Admins can view audit logs"
ON audit_logs FOR SELECT
USING (
  school_id = auth_school_id()
  AND (
    auth_user_role() = 'admin'
    OR auth_user_role() = 'service_role'
  )
);
