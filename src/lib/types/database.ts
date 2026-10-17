// src/lib/types/database.ts
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface School {
  id: string;
  name: string;
  code: string;
  logo_url?: string | null;
  timezone: string;
  currency: string;
  address?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  id: string;
  school_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradingPeriod {
  id: string;
  school_id: string;
  academic_year_id: string;
  name: string;
  code: string;
  sequence: number;
  start_date: string;
  end_date: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface GradeLevel {
  id: string;
  school_id: string;
  name: string;
  level_number: number;
  department: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  school_id: string;
  name: string;
  building?: string | null;
  capacity?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: string;
  school_id: string;
  academic_year_id: string;
  grade_level_id: string;
  name: string;
  room_id?: string | null;
  adviser_id?: string | null;
  capacity: number;
  created_at: string;
  updated_at: string;
  grade_level?: GradeLevel;
  room?: Room;
}

export interface Subject {
  id: string;
  school_id: string;
  grade_level_id?: string | null;
  code: string;
  name: string;
  units: number;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  school_id: string;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AdminPermissions {
  user_id: string;
  school_id: string;
  is_super_admin: boolean;
  can_manage_academics: boolean;
  can_manage_admissions: boolean;
  can_manage_finance: boolean;
}

export interface StudentProfile {
  id: string;
  school_id: string;
  user_id: string;
  lrn?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  birth_date?: string | null;
  address?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  blood_type?: string | null;
  allergies?: string | null;
  medical_notes?: string | null;
  user?: UserProfile;
}

export interface GuardianStudentLink {
  id: string;
  school_id: string;
  guardian_user_id: string;
  student_id: string;
  relationship: string;
  is_primary: boolean;
  can_view_grades: boolean;
  can_view_billing: boolean;
  student?: StudentProfile;
}

export interface Enrollment {
  id: string;
  school_id: string;
  student_id: string;
  academic_year_id: string;
  section_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'dropped' | 'transferred' | 'graduated';
  section?: Section;
  student?: StudentProfile;
}

export interface AttendanceRecord {
  id: string;
  school_id: string;
  student_id: string;
  section_id: string;
  class_id?: string | null;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  remarks?: string | null;
  check_in_time?: string | null;
  student?: StudentProfile;
}

export interface GradingComponent {
  id: string;
  school_id: string;
  subject_id: string;
  academic_year_id: string;
  name: string;
  weight_percentage: number;
}

export interface SmsGradebookEntry {
  id: string;
  school_id: string;
  student_id: string;
  subject_id: string;
  grading_period_id: string;
  component_id?: string | null;
  raw_score?: number | null;
  max_score?: number | null;
  percentage_score?: number | null;
  transmuted_grade?: number | null;
  is_locked: boolean;
  remarks?: string | null;
  student?: StudentProfile;
}

export interface FeeStructure {
  id: string;
  school_id: string;
  academic_year_id: string;
  grade_level_id: string;
  name: string;
  tuition_amount: number;
  misc_amount: number;
  total_amount: number;
  installment_options: Array<{
    name: string;
    dues: Array<{ label: string; amount: number; due_date: string }>;
  }>;
}

export interface StudentLedger {
  id: string;
  school_id: string;
  student_id: string;
  academic_year_id: string;
  fee_structure_id?: string | null;
  total_assessed: number;
  total_discount: number;
  total_paid: number;
  remaining_balance: number;
  status: 'unpaid' | 'partially_paid' | 'fully_paid' | 'overdue';
  student?: StudentProfile;
  fee_structure?: FeeStructure;
}

export interface Payment {
  id: string;
  school_id: string;
  student_ledger_id: string;
  student_id: string;
  receipt_number: string;
  amount: number;
  payment_method: 'stripe_card' | 'stripe_gcash' | 'cash' | 'bank_deposit' | 'e_wallet_manual';
  transaction_reference?: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  received_by_user_id?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface ClassEntity {
  id: string;
  school_id: string;
  academic_year_id: string;
  section_id: string;
  subject_id: string;
  primary_teacher_id: string;
  name: string;
  class_code?: string | null;
  room?: string | null;
  schedule_text?: string | null;
  is_archived: boolean;
  subject?: Subject;
  section?: Section;
  primary_teacher?: UserProfile;
}

export interface Topic {
  id: string;
  class_id: string;
  school_id: string;
  name: string;
  sequence: number;
}

export interface StreamPost {
  id: string;
  school_id: string;
  class_id: string;
  author_id: string;
  title?: string | null;
  content: string;
  attachments: Array<{ name: string; url: string; type?: string }>;
  is_pinned: boolean;
  created_at: string;
  author?: UserProfile;
}

export interface Assignment {
  id: string;
  school_id: string;
  class_id: string;
  topic_id?: string | null;
  rubric_id?: string | null;
  grading_component_id?: string | null;
  grading_period_id?: string | null;
  title: string;
  description?: string | null;
  points: number;
  due_date?: string | null;
  attachments: Array<{ name: string; url: string; type?: string }>;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  created_at: string;
}

export interface Submission {
  id: string;
  school_id: string;
  assignment_id: string;
  student_id: string;
  status: 'assigned' | 'turned_in' | 'missing' | 'late' | 'returned' | 'graded';
  submitted_at?: string | null;
  score?: number | null;
  rubric_scores?: Record<string, number>;
  feedback?: string | null;
  graded_at?: string | null;
  student?: StudentProfile;
  attachments?: Array<{ id: string; file_name: string; file_url: string }>;
}

export interface AuditLog {
  id: string;
  school_id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  changed_by_user_id?: string | null;
  created_at: string;
}
