// src/app/api/cron/fee-reminders/route.ts
import { NextResponse } from 'next/server';
import { defaultEmailProvider } from '@/lib/providers/EmailProvider';
import { SchoolService } from '@/lib/services/schoolService';

export async function GET(request: Request) {
  // In production, verify auth header: request.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
  console.log('[Cron:FeeReminders] Running daily fee balance reminder job...');

  const student = SchoolService.getStudentById('stu_gabriel');
  const ledger = SchoolService.getLedger('stu_gabriel');

  if (ledger && ledger.remaining_balance > 0) {
    await defaultEmailProvider.sendEmail({
      to: 'parent@school.edu.ph',
      subject: `Upcoming Tuition Due Reminder - ${student?.user?.first_name} ${student?.user?.last_name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>School Fee Reminder</h2>
          <p>Dear Guardian,</p>
          <p>This is a reminder that the remaining balance of <strong>PHP ${ledger.remaining_balance.toLocaleString()}</strong> for ${student?.user?.first_name} is due on October 25, 2026.</p>
          <p>You may pay securely online through the Parent Portal.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    remindersDispatched: 1,
  });
}
