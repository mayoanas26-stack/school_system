-- 20260101000001_attendance_grading_fees.sql
-- Migration: Attendance, Grading Engine, Fee Ledgers, Payments, and Audit Triggers

-- 1. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  class_id UUID, -- NULL for homeroom daily attendance, populated if subject-based
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'late', 'absent', 'excused')),
  remarks TEXT,
  recorded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  check_in_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_attendance_unique_entry 
ON attendance_records (student_id, date, COALESCE(class_id, '00000000-0000-0000-0000-000000000000'::uuid));

-- 2. GRADING COMPONENTS (Weighted Categories)
CREATE TABLE IF NOT EXISTS grading_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Written Work", "Performance Tasks", "Quarterly Assessment"
  weight_percentage NUMERIC(5,2) NOT NULL, -- e.g. 30.00, 50.00, 20.00
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SMS GRADEBOOK ENTRIES
CREATE TABLE IF NOT EXISTS sms_gradebook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  grading_period_id UUID NOT NULL REFERENCES grading_periods(id) ON DELETE CASCADE,
  component_id UUID REFERENCES grading_components(id) ON DELETE SET NULL,
  raw_score NUMERIC(6,2),
  max_score NUMERIC(6,2),
  percentage_score NUMERIC(5,2),
  transmuted_grade NUMERIC(5,2), -- Final computed grade (60.00 - 100.00)
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  remarks TEXT,
  encoded_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, subject_id, grading_period_id, component_id)
);

-- 4. FEE STRUCTURES
CREATE TABLE IF NOT EXISTS fee_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  grade_level_id UUID NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tuition_amount NUMERIC(10,2) NOT NULL,
  misc_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10,2) NOT NULL,
  installment_options JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. STUDENT LEDGERS (Financial Statement of Account)
CREATE TABLE IF NOT EXISTS student_ledgers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  fee_structure_id UUID REFERENCES fee_structures(id) ON DELETE SET NULL,
  total_assessed NUMERIC(10,2) NOT NULL,
  total_discount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_paid NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  remaining_balance NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'fully_paid', 'overdue')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, academic_year_id)
);

-- 6. PAYMENTS & OFFICIAL RECEIPTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_ledger_id UUID NOT NULL REFERENCES student_ledgers(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  receipt_number TEXT UNIQUE NOT NULL, -- e.g. "OR-2026-00001"
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe_card', 'stripe_gcash', 'cash', 'bank_deposit', 'e_wallet_manual')),
  transaction_reference TEXT, -- Stripe PI / Cashier ref
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  received_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Null if online webhook
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('absence', 'late_work', 'fee_reminder', 'grade_posted', 'announcement')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. AUDIT LOG TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION trigger_audit_log_record()
RETURNS TRIGGER AS $$
DECLARE
  current_school UUID;
  current_user UUID;
  rec_id UUID;
  old_val JSONB := NULL;
  new_val JSONB := NULL;
BEGIN
  IF TG_OP = 'DELETE' THEN
    current_school := OLD.school_id;
    rec_id := OLD.id;
    old_val := to_jsonb(OLD);
  ELSE
    current_school := NEW.school_id;
    rec_id := NEW.id;
    new_val := to_jsonb(NEW);
    IF TG_OP = 'UPDATE' THEN
      old_val := to_jsonb(OLD);
    END IF;
  END IF;

  BEGIN
    current_user := (NULLIF(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')::uuid;
  EXCEPTION WHEN OTHERS THEN
    current_user := NULL;
  END;

  INSERT INTO audit_logs (
    school_id,
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_by_user_id
  ) VALUES (
    current_school,
    TG_TABLE_NAME,
    rec_id,
    TG_OP,
    old_val,
    new_val,
    current_user
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply Audit Triggers to Sensitive Tables
DROP TRIGGER IF EXISTS trg_audit_gradebook ON sms_gradebook_entries;
CREATE TRIGGER trg_audit_gradebook AFTER INSERT OR UPDATE OR DELETE ON sms_gradebook_entries
FOR EACH ROW EXECUTE FUNCTION trigger_audit_log_record();

DROP TRIGGER IF EXISTS trg_audit_payments ON payments;
CREATE TRIGGER trg_audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
FOR EACH ROW EXECUTE FUNCTION trigger_audit_log_record();

DROP TRIGGER IF EXISTS trg_audit_enrollments ON enrollments;
CREATE TRIGGER trg_audit_enrollments AFTER INSERT OR UPDATE OR DELETE ON enrollments
FOR EACH ROW EXECUTE FUNCTION trigger_audit_log_record();

DROP TRIGGER IF EXISTS trg_audit_admin_permissions ON admin_permissions;
CREATE TRIGGER trg_audit_admin_permissions AFTER INSERT OR UPDATE OR DELETE ON admin_permissions
FOR EACH ROW EXECUTE FUNCTION trigger_audit_log_record();
