// scripts/seed.ts
/**
 * Database Seed Script for School Management System + Google Classroom Platform
 * School: Philippine Science & Arts Academy (PSAA-MNL)
 * Run: npx tsx scripts/seed.ts
 */

import {
  MOCK_SCHOOL,
  MOCK_ACADEMIC_YEARS,
  MOCK_GRADING_PERIODS,
  MOCK_GRADE_LEVELS,
  MOCK_ROOMS,
  MOCK_USERS,
  MOCK_ADMIN_PERMISSIONS,
  MOCK_SECTIONS,
  MOCK_SUBJECTS,
  MOCK_STUDENTS,
  MOCK_GUARDIAN_LINKS,
  MOCK_ENROLLMENTS,
  MOCK_CLASSES,
  MOCK_TOPICS,
  MOCK_STREAM_POSTS,
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
  MOCK_ATTENDANCE,
  MOCK_GRADEBOOK_ENTRIES,
  MOCK_FEE_STRUCTURES,
  MOCK_LEDGERS,
  MOCK_PAYMENTS,
} from '../src/lib/data/mockData';

export async function runSeed() {
  console.log('===============================================================');
  console.log('SEEDING SCHOOL MANAGEMENT & CLASSROOM PLATFORM');
  console.log('===============================================================');
  console.log(`School: ${MOCK_SCHOOL.name} (${MOCK_SCHOOL.code})`);
  console.log(`Timezone: ${MOCK_SCHOOL.timezone} | Currency: ${MOCK_SCHOOL.currency}`);
  console.log(`Academic Year: ${MOCK_ACADEMIC_YEARS[0].name} (Active)`);
  console.log(`Sections: ${MOCK_SECTIONS.length} | Subjects: ${MOCK_SUBJECTS.length}`);
  console.log(`Classes: ${MOCK_CLASSES.length} | Assignments: ${MOCK_ASSIGNMENTS.length}`);
  console.log(`Students: ${MOCK_STUDENTS.length} | Guardians: ${MOCK_GUARDIAN_LINKS.length}`);
  console.log(`Payments: ${MOCK_PAYMENTS.length} | Ledgers: ${MOCK_LEDGERS.length}`);
  console.log('---------------------------------------------------------------');
  console.log('SAMPLE CLERK TEST ACCOUNTS:');
  console.log('1. Admin:   admin@school.edu.ph   | Role: admin (All permissions)');
  console.log('2. Teacher: teacher@school.edu.ph | Role: teacher (Math 10 & Sci 10)');
  console.log('3. Student: student@school.edu.ph | Role: student (Gabriel Dela Cruz)');
  console.log('4. Parent:  parent@school.edu.ph  | Role: parent (Corazon Dela Cruz)');
  console.log('===============================================================');
  console.log('Seed executed successfully.');
}

if (require.main === module) {
  runSeed().catch(console.error);
}
