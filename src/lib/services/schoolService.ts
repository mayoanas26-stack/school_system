// src/lib/services/schoolService.ts
import {
  MOCK_SCHOOL,
  MOCK_ACADEMIC_YEARS,
  MOCK_GRADING_PERIODS,
  MOCK_SECTIONS,
  MOCK_SUBJECTS,
  MOCK_STUDENTS,
  MOCK_GUARDIAN_LINKS,
  MOCK_ENROLLMENTS,
  MOCK_CLASSES,
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
  MOCK_ATTENDANCE,
  MOCK_GRADEBOOK_ENTRIES,
  MOCK_LEDGERS,
  MOCK_PAYMENTS,
  MOCK_AUDIT_LOGS,
  MOCK_STREAM_POSTS,
} from '@/lib/data/mockData';
import {
  AttendanceRecord,
  SmsGradebookEntry,
  Payment,
  Submission,
  Assignment,
  StudentLedger,
  StreamPost,
} from '@/lib/types/database';
import { defaultEmailProvider } from '@/lib/providers/EmailProvider';
import { defaultSmsProvider } from '@/lib/providers/SmsProvider';

// DepEd Official Grade Transmutation Function (Philippine Standard K-12)
export function computeTransmutedGrade(percentage: number): number {
  if (percentage >= 100) return 100;
  if (percentage >= 98.4) return 99;
  if (percentage >= 96.8) return 98;
  if (percentage >= 95.2) return 97;
  if (percentage >= 93.6) return 96;
  if (percentage >= 92.0) return 95;
  if (percentage >= 90.4) return 94;
  if (percentage >= 88.8) return 93;
  if (percentage >= 87.2) return 92;
  if (percentage >= 85.6) return 91;
  if (percentage >= 84.0) return 90;
  if (percentage >= 82.4) return 89;
  if (percentage >= 80.8) return 88;
  if (percentage >= 79.2) return 87;
  if (percentage >= 77.6) return 86;
  if (percentage >= 76.0) return 85;
  if (percentage >= 74.4) return 84;
  if (percentage >= 72.8) return 83;
  if (percentage >= 71.2) return 82;
  if (percentage >= 69.6) return 81;
  if (percentage >= 68.0) return 80;
  if (percentage >= 66.4) return 79;
  if (percentage >= 64.8) return 78;
  if (percentage >= 63.2) return 77;
  if (percentage >= 61.6) return 76;
  if (percentage >= 60.0) return 75; // Passing grade
  return Math.max(60, Math.round(55 + (percentage / 60) * 19));
}

// In-Memory Mutables for Local Development Runtime
let attendanceState = [...MOCK_ATTENDANCE];
let gradebookState = [...MOCK_GRADEBOOK_ENTRIES];
let paymentsState = [...MOCK_PAYMENTS];
let ledgersState = [...MOCK_LEDGERS];
let submissionsState = [...MOCK_SUBMISSIONS];
let assignmentsState = [...MOCK_ASSIGNMENTS];
let gradingPeriodsState = [...MOCK_GRADING_PERIODS];
let streamPostsState = [...MOCK_STREAM_POSTS];
let auditLogsState = [...MOCK_AUDIT_LOGS];

export const SchoolService = {
  // General School & Hierarchy
  getSchoolInfo() {
    return MOCK_SCHOOL;
  },

  getAcademicYears() {
    return MOCK_ACADEMIC_YEARS;
  },

  getGradingPeriods() {
    return gradingPeriodsState;
  },

  toggleGradeLock(periodId: string, isLocked: boolean) {
    gradingPeriodsState = gradingPeriodsState.map((gp) =>
      gp.id === periodId ? { ...gp, is_locked: isLocked } : gp
    );
    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      table_name: 'grading_periods',
      record_id: periodId,
      action: 'UPDATE',
      new_data: { is_locked: isLocked },
      changed_by_user_id: 'usr_admin_1',
      created_at: new Date().toISOString(),
    });
    return gradingPeriodsState.find((gp) => gp.id === periodId);
  },

  getSections() {
    return MOCK_SECTIONS;
  },

  getSubjects() {
    return MOCK_SUBJECTS;
  },

  getStudents() {
    return MOCK_STUDENTS;
  },

  getStudentById(id: string) {
    return MOCK_STUDENTS.find((s) => s.id === id);
  },

  // Guardian multi-child resolution
  getLinkedChildren(guardianUserId: string) {
    const links = MOCK_GUARDIAN_LINKS.filter((l) => l.guardian_user_id === guardianUserId);
    return links.map((l) => {
      const student = MOCK_STUDENTS.find((s) => s.id === l.student_id);
      return {
        ...l,
        student,
      };
    });
  },

  // Attendance Module
  getAttendance(studentId?: string, sectionId?: string, date?: string) {
    return attendanceState.filter((a) => {
      if (studentId && a.student_id !== studentId) return false;
      if (sectionId && a.section_id !== sectionId) return false;
      if (date && a.date !== date) return false;
      return true;
    });
  },

  async recordAttendance(
    entries: Array<{
      studentId: string;
      sectionId: string;
      date: string;
      status: 'present' | 'late' | 'absent' | 'excused';
      remarks?: string;
    }>
  ) {
    for (const entry of entries) {
      const existingIdx = attendanceState.findIndex(
        (a) => a.student_id === entry.studentId && a.date === entry.date
      );

      const record: AttendanceRecord = {
        id: existingIdx >= 0 ? attendanceState[existingIdx].id : `att_${Date.now()}_${Math.random()}`,
        school_id: MOCK_SCHOOL.id,
        student_id: entry.studentId,
        section_id: entry.sectionId,
        date: entry.date,
        status: entry.status,
        remarks: entry.remarks || (entry.status === 'present' ? 'On time' : ''),
        check_in_time: entry.status === 'present' || entry.status === 'late' ? new Date().toISOString() : null,
        student: MOCK_STUDENTS.find((s) => s.id === entry.studentId),
      };

      if (existingIdx >= 0) {
        attendanceState[existingIdx] = record;
      } else {
        attendanceState.unshift(record);
      }

      // If absent, dispatch parent alerts
      if (entry.status === 'absent') {
        const student = MOCK_STUDENTS.find((s) => s.id === entry.studentId);
        if (student) {
          await defaultEmailProvider.sendAbsenceAlert({
            guardianEmail: 'parent@school.edu.ph',
            studentName: `${student.user?.first_name} ${student.user?.last_name}`,
            date: entry.date,
            schoolName: MOCK_SCHOOL.name,
          });
          if (student.emergency_contact_phone) {
            await defaultSmsProvider.sendAbsenceSms({
              guardianPhone: student.emergency_contact_phone,
              studentName: `${student.user?.first_name} ${student.user?.last_name}`,
              date: entry.date,
              schoolName: MOCK_SCHOOL.name,
            });
          }
        }
      }
    }
    return attendanceState;
  },

  // Grading Module
  getGradesForStudent(studentId: string) {
    return gradebookState.filter((g) => g.student_id === studentId);
  },

  getGradesForSubject(subjectId: string, periodId?: string) {
    return gradebookState.filter(
      (g) => g.subject_id === subjectId && (!periodId || g.grading_period_id === periodId)
    );
  },

  encodeGrade(entry: {
    studentId: string;
    subjectId: string;
    gradingPeriodId: string;
    rawScore: number;
    maxScore: number;
    componentId?: string;
  }) {
    const percentage = (entry.rawScore / entry.maxScore) * 100;
    const transmuted = computeTransmutedGrade(percentage);

    const existingIdx = gradebookState.findIndex(
      (g) =>
        g.student_id === entry.studentId &&
        g.subject_id === entry.subjectId &&
        g.grading_period_id === entry.gradingPeriodId
    );

    const period = gradingPeriodsState.find((p) => p.id === entry.gradingPeriodId);
    if (period?.is_locked) {
      throw new Error('Grading for this quarter has been locked by the Administrator.');
    }

    const newGrade: SmsGradebookEntry = {
      id: existingIdx >= 0 ? gradebookState[existingIdx].id : `gb_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      student_id: entry.studentId,
      subject_id: entry.subjectId,
      grading_period_id: entry.gradingPeriodId,
      component_id: entry.componentId || null,
      raw_score: entry.rawScore,
      max_score: entry.maxScore,
      percentage_score: Math.round(percentage * 10) / 10,
      transmuted_grade: transmuted,
      is_locked: false,
      remarks: transmuted >= 75 ? 'Passed' : 'Needs Remediation',
      student: MOCK_STUDENTS.find((s) => s.id === entry.studentId),
    };

    if (existingIdx >= 0) {
      gradebookState[existingIdx] = newGrade;
    } else {
      gradebookState.unshift(newGrade);
    }

    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      table_name: 'sms_gradebook_entries',
      record_id: newGrade.id,
      action: existingIdx >= 0 ? 'UPDATE' : 'INSERT',
      new_data: newGrade as any,
      changed_by_user_id: 'usr_teacher_1',
      created_at: new Date().toISOString(),
    });

    return newGrade;
  },

  // Fees & Ledgers
  getLedger(studentId: string): StudentLedger | undefined {
    return ledgersState.find((l) => l.student_id === studentId);
  },

  getPayments(studentId?: string): Payment[] {
    if (studentId) {
      return paymentsState.filter((p) => p.student_id === studentId);
    }
    return paymentsState;
  },

  async recordPayment(params: {
    ledgerId: string;
    studentId: string;
    amount: number;
    paymentMethod: 'stripe_card' | 'stripe_gcash' | 'cash' | 'bank_deposit' | 'e_wallet_manual';
    transactionReference?: string;
    notes?: string;
  }) {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `OR-${dateStr}-${randSuffix}`;

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      student_ledger_id: params.ledgerId,
      student_id: params.studentId,
      receipt_number: receiptNumber,
      amount: params.amount,
      payment_method: params.paymentMethod,
      transaction_reference: params.transactionReference || `TX-${Date.now()}`,
      status: 'completed',
      notes: params.notes || 'Recorded payment',
      created_at: new Date().toISOString(),
    };

    paymentsState.unshift(newPayment);

    // Update Student Ledger Balance
    const ledgerIdx = ledgersState.findIndex((l) => l.id === params.ledgerId);
    if (ledgerIdx >= 0) {
      const current = ledgersState[ledgerIdx];
      const newPaid = current.total_paid + params.amount;
      const newRemaining = Math.max(0, current.total_assessed - current.total_discount - newPaid);
      ledgersState[ledgerIdx] = {
        ...current,
        total_paid: newPaid,
        remaining_balance: newRemaining,
        status: newRemaining === 0 ? 'fully_paid' : 'partially_paid',
      };
    }

    auditLogsState.unshift({
      id: `aud_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      table_name: 'payments',
      record_id: newPayment.id,
      action: 'INSERT',
      new_data: newPayment as any,
      created_at: new Date().toISOString(),
    });

    const student = MOCK_STUDENTS.find((s) => s.id === params.studentId);
    await defaultEmailProvider.sendPaymentReceipt({
      recipientEmail: 'parent@school.edu.ph',
      studentName: student ? `${student.user?.first_name} ${student.user?.last_name}` : 'Student',
      receiptNumber: newPayment.receipt_number,
      amount: newPayment.amount,
      currency: 'PHP',
      date: new Date().toLocaleDateString('en-PH'),
    });

    return newPayment;
  },

  // Classroom & Stream
  getClasses() {
    return MOCK_CLASSES;
  },

  getClassById(classId: string) {
    return MOCK_CLASSES.find((c) => c.id === classId);
  },

  getStreamPosts(classId: string) {
    return streamPostsState.filter((p) => p.class_id === classId);
  },

  createStreamPost(post: { classId: string; authorId: string; content: string; title?: string }) {
    const newPost: StreamPost = {
      id: `post_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      class_id: post.classId,
      author_id: post.authorId,
      title: post.title || null,
      content: post.content,
      attachments: [],
      is_pinned: false,
      created_at: new Date().toISOString(),
    };
    streamPostsState.unshift(newPost);
    return newPost;
  },

  getAssignments(classId: string) {
    return assignmentsState.filter((a) => a.class_id === classId);
  },

  createAssignment(data: {
    classId: string;
    title: string;
    description: string;
    points: number;
    dueDate?: string;
  }) {
    const newAsg: Assignment = {
      id: `asg_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      class_id: data.classId,
      title: data.title,
      description: data.description,
      points: data.points,
      due_date: data.dueDate || null,
      attachments: [],
      status: 'published',
      created_at: new Date().toISOString(),
    };
    assignmentsState.unshift(newAsg);
    return newAsg;
  },

  getSubmissions(assignmentId: string) {
    return submissionsState.filter((s) => s.assignment_id === assignmentId);
  },

  getSubmissionForStudent(assignmentId: string, studentId: string) {
    return submissionsState.find(
      (s) => s.assignment_id === assignmentId && s.student_id === studentId
    );
  },

  submitWork(params: {
    assignmentId: string;
    studentId: string;
    fileName?: string;
    fileUrl?: string;
  }) {
    const existingIdx = submissionsState.findIndex(
      (s) => s.assignment_id === params.assignmentId && s.student_id === params.studentId
    );

    const sub: Submission = {
      id: existingIdx >= 0 ? submissionsState[existingIdx].id : `sub_${Date.now()}`,
      school_id: MOCK_SCHOOL.id,
      assignment_id: params.assignmentId,
      student_id: params.studentId,
      status: 'turned_in',
      submitted_at: new Date().toISOString(),
      student: MOCK_STUDENTS.find((s) => s.id === params.studentId),
      attachments: params.fileName
        ? [{ id: `att_${Date.now()}`, file_name: params.fileName, file_url: params.fileUrl || '/file.pdf' }]
        : [],
    };

    if (existingIdx >= 0) {
      submissionsState[existingIdx] = sub;
    } else {
      submissionsState.unshift(sub);
    }
    return sub;
  },

  gradeSubmission(submissionId: string, score: number, feedback: string) {
    const subIdx = submissionsState.findIndex((s) => s.id === submissionId);
    if (subIdx < 0) throw new Error('Submission not found');

    submissionsState[subIdx] = {
      ...submissionsState[subIdx],
      score,
      feedback,
      status: 'graded',
      graded_at: new Date().toISOString(),
    };

    // Auto-sync score to SMS Gradebook
    const sub = submissionsState[subIdx];
    const asg = assignmentsState.find((a) => a.id === sub.assignment_id);
    const cls = asg ? MOCK_CLASSES.find((c) => c.id === asg.class_id) : undefined;

    if (asg && cls) {
      SchoolService.encodeGrade({
        studentId: sub.student_id,
        subjectId: cls.subject_id,
        gradingPeriodId: 'gp_q2',
        rawScore: score,
        maxScore: asg.points,
      });
    }

    return submissionsState[subIdx];
  },

  getAuditLogs() {
    return auditLogsState;
  },
};
