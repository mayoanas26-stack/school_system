// src/app/api/cron/guardian-digests/route.ts
import { NextResponse } from 'next/server';
import { defaultEmailProvider } from '@/lib/providers/EmailProvider';
import { SchoolService } from '@/lib/services/schoolService';

export async function GET(request: Request) {
  console.log('[Cron:GuardianDigests] Running weekly guardian academic digest job...');

  const student = SchoolService.getStudentById('stu_gabriel');

  await defaultEmailProvider.sendGuardianWeeklySummary({
    guardianEmail: 'parent@school.edu.ph',
    studentName: `${student?.user?.first_name} ${student?.user?.last_name}`,
    missingAssignments: 0,
    upcomingDeadlines: [
      { title: 'Problem Set 5: Circle Theorems', due: 'Oct 25, 2026' },
      { title: 'Science Lab Reflection Report', due: 'Oct 28, 2026' },
    ],
    attendanceSummary: {
      present: 4,
      late: 1,
      absent: 0,
    },
  });

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    digestsDispatched: 1,
  });
}
