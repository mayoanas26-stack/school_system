// src/lib/providers/EmailProvider.ts
export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
  sendAbsenceAlert(params: {
    guardianEmail: string;
    studentName: string;
    date: string;
    schoolName: string;
  }): Promise<boolean>;
  sendPaymentReceipt(params: {
    recipientEmail: string;
    studentName: string;
    receiptNumber: string;
    amount: number;
    currency: string;
    date: string;
  }): Promise<boolean>;
  sendGuardianWeeklySummary(params: {
    guardianEmail: string;
    studentName: string;
    missingAssignments: number;
    upcomingDeadlines: Array<{ title: string; due: string }>;
    attendanceSummary: { present: number; absent: number; late: number };
  }): Promise<boolean>;
}

export class ResendEmailProvider implements EmailProvider {
  private resendApiKey: string;
  private fromEmail: string;

  constructor() {
    this.resendApiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@school.edu.ph';
  }

  async sendEmail(params: SendEmailParams) {
    if (!this.resendApiKey) {
      console.log(`[EmailProvider] [MOCK LOG] To: ${params.to} | Subject: ${params.subject}`);
      return { success: true, messageId: `mock_email_${Date.now()}` };
    }

    try {
      const { Resend } = await import('resend');
      const resend = new Resend(this.resendApiKey);

      const res = await resend.emails.send({
        from: this.fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.html || params.text || '',
      });

      return { success: true, messageId: res.data?.id };
    } catch (err: any) {
      console.error('[EmailProvider] Error sending email:', err.message);
      return { success: false, error: err.message };
    }
  }

  async sendAbsenceAlert(params: {
    guardianEmail: string;
    studentName: string;
    date: string;
    schoolName: string;
  }) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #e11d48;">Attendance Notice: Unexcused Absence</h2>
        <p>Dear Guardian,</p>
        <p>This is to inform you that your child <strong>${params.studentName}</strong> was marked <strong>ABSENT</strong> on <strong>${params.date}</strong> at <strong>${params.schoolName}</strong>.</p>
        <p>If this was due to illness or an emergency, please submit an excuse letter through the Parent Portal.</p>
        <p style="margin-top: 30px; font-size: 12px; color: #64748b;">This is an automated notification from ${params.schoolName}.</p>
      </div>
    `;

    const res = await this.sendEmail({
      to: params.guardianEmail,
      subject: `Absence Notice: ${params.studentName} (${params.date})`,
      html,
    });
    return res.success;
  }

  async sendPaymentReceipt(params: {
    recipientEmail: string;
    studentName: string;
    receiptNumber: string;
    amount: number;
    currency: string;
    date: string;
  }) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #059669;">Official Payment Receipt</h2>
        <p>Receipt Number: <strong>${params.receiptNumber}</strong></p>
        <p>Student: <strong>${params.studentName}</strong></p>
        <p>Amount Paid: <strong>${params.currency} ${params.amount.toLocaleString()}</strong></p>
        <p>Date: <strong>${params.date}</strong></p>
        <p>Thank you for your payment. Your student ledger has been updated.</p>
      </div>
    `;

    const res = await this.sendEmail({
      to: params.recipientEmail,
      subject: `Official Receipt [${params.receiptNumber}] - ${params.studentName}`,
      html,
    });
    return res.success;
  }

  async sendGuardianWeeklySummary(params: {
    guardianEmail: string;
    studentName: string;
    missingAssignments: number;
    upcomingDeadlines: Array<{ title: string; due: string }>;
    attendanceSummary: { present: number; absent: number; late: number };
  }) {
    const deadlinesHtml = params.upcomingDeadlines.length > 0
      ? params.upcomingDeadlines.map(d => `<li>${d.title} (Due: ${d.due})</li>`).join('')
      : '<li>No upcoming deadlines this week.</li>';

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2>Weekly Guardian Digest for ${params.studentName}</h2>
        <p>Here is your weekly academic summary:</p>
        <h3>Attendance</h3>
        <p>Present: ${params.attendanceSummary.present} | Late: ${params.attendanceSummary.late} | Absent: ${params.attendanceSummary.absent}</p>
        <h3>Assignments</h3>
        <p>Missing Work: <strong style="color: ${params.missingAssignments > 0 ? '#e11d48' : '#059669'}">${params.missingAssignments}</strong></p>
        <h4>Upcoming Deadlines</h4>
        <ul>${deadlinesHtml}</ul>
      </div>
    `;

    const res = await this.sendEmail({
      to: params.guardianEmail,
      subject: `Weekly Summary: ${params.studentName}`,
      html,
    });
    return res.success;
  }
}

export const defaultEmailProvider = new ResendEmailProvider();
