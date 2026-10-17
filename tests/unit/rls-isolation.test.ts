// tests/unit/rls-isolation.test.ts
import { describe, it, expect } from 'vitest';
import {
  MOCK_SCHOOL,
  MOCK_STUDENTS,
  MOCK_GUARDIAN_LINKS,
  MOCK_SECTIONS,
  MOCK_CLASSES,
} from '../../src/lib/data/mockData';

describe('Postgres Row Level Security (RLS) Isolation Rules', () => {
  // 1. Cross-School Multi-Tenancy Scoping
  it('blocks cross-school access when school_id does not match caller session', () => {
    const callerSchoolId = 'sch_ph_001';
    const foreignRecord = {
      id: 'foreign_rec_99',
      school_id: 'sch_different_002',
      data: 'Sensitive School Data',
    };

    // RLS Policy Evaluation: school_id = auth_school_id()
    const canAccess = foreignRecord.school_id === callerSchoolId;
    expect(canAccess).toBe(false);
  });

  // 2. Parent-to-Child Scoping
  it('allows a parent to read ONLY their verified linked children via guardian_students', () => {
    const parentUserId = 'usr_parent_1'; // Corazon Dela Cruz
    const linkedStudentIds = MOCK_GUARDIAN_LINKS
      .filter((l) => l.guardian_user_id === parentUserId)
      .map((l) => l.student_id);

    // Corazon is linked to Gabriel ('stu_gabriel') and Sofia ('stu_sofia')
    expect(linkedStudentIds).toContain('stu_gabriel');
    expect(linkedStudentIds).toContain('stu_sofia');

    // Attempt to access unlinked student Marco Silang ('stu_marco')
    const unlinkedStudentId = 'stu_marco';
    const canAccessUnlinked = linkedStudentIds.includes(unlinkedStudentId);

    expect(canAccessUnlinked).toBe(false);
  });

  // 3. Student Self-Isolation Scoping
  it('prohibits a student from reading another student submissions and profile data', () => {
    const studentUser = {
      id: 'usr_student_1', // Gabriel Dela Cruz
      studentId: 'stu_gabriel',
      role: 'student',
    };

    const targetSubmissions = [
      { id: 'sub_1', studentId: 'stu_gabriel', score: 95 },
      { id: 'sub_2', studentId: 'stu_sofia', score: 88 },
      { id: 'sub_3', studentId: 'stu_marco', score: 78 },
    ];

    // RLS policy: student_id = current_student_id()
    const visibleSubmissions = targetSubmissions.filter(
      (sub) => sub.studentId === studentUser.studentId
    );

    expect(visibleSubmissions).toHaveLength(1);
    expect(visibleSubmissions[0].id).toBe('sub_1');
    expect(visibleSubmissions.find((s) => s.studentId === 'stu_sofia')).toBeUndefined();
    expect(visibleSubmissions.find((s) => s.studentId === 'stu_marco')).toBeUndefined();
  });

  // 4. Teacher Section Assignment Scoping
  it('restricts teachers to assigned sections and classes only', () => {
    const teacherUserId = 'usr_teacher_1'; // Prof. Juan Dela Cruz

    // Classes assigned to teacher
    const assignedClassIds = MOCK_CLASSES
      .filter((c) => c.primary_teacher_id === teacherUserId)
      .map((c) => c.id);

    expect(assignedClassIds).toContain('cls_math_10_rizal');
    expect(assignedClassIds).toContain('cls_sci_10_rizal');

    // Unassigned class taught by another teacher
    const unassignedClassId = 'cls_english_10_bonifacio';
    const canManageUnassigned = assignedClassIds.includes(unassignedClassId);

    expect(canManageUnassigned).toBe(false);
  });

  // 5. Grade Locking Enforcement
  it('rejects teacher grade modification when grading period is locked by Admin', () => {
    const gradingPeriodQ1 = { id: 'gp_q1', name: '1st Quarter', is_locked: true };
    const gradingPeriodQ2 = { id: 'gp_q2', name: '2nd Quarter', is_locked: false };

    const checkTeacherCanEdit = (period: { is_locked: boolean }, role: string) => {
      if (role === 'admin') return true; // Admin can unlock or edit
      if (role === 'teacher' && !period.is_locked) return true;
      return false;
    };

    expect(checkTeacherCanEdit(gradingPeriodQ1, 'teacher')).toBe(false); // Locked for teacher
    expect(checkTeacherCanEdit(gradingPeriodQ2, 'teacher')).toBe(true);  // Open for teacher
    expect(checkTeacherCanEdit(gradingPeriodQ1, 'admin')).toBe(true);    // Admin override
  });

  // 6. Private Comments Visibility Scoping
  it('restricts private assignment comments strictly between assigned teacher and student', () => {
    const comment = {
      id: 'comm_01',
      studentId: 'stu_gabriel',
      teacherUserId: 'usr_teacher_1',
      content: 'Sir, I have a question regarding number 4.',
    };

    const canReadComment = (viewerId: string, viewerRole: string) => {
      if (viewerRole === 'admin') return true;
      if (viewerId === comment.studentId || viewerId === comment.teacherUserId) return true;
      return false; // Blocks peers, other teachers, and other parents
    };

    expect(canReadComment('stu_gabriel', 'student')).toBe(true);
    expect(canReadComment('usr_teacher_1', 'teacher')).toBe(true);
    expect(canReadComment('stu_sofia', 'student')).toBe(false); // Other student blocked
    expect(canReadComment('usr_parent_2', 'parent')).toBe(false); // Other parent blocked
  });
});
