// src/lib/providers/SmsProvider.ts
export interface SendSmsParams {
  to: string;
  message: string;
  schoolId?: string;
}

export interface SmsProvider {
  sendSms(params: SendSmsParams): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
  sendAbsenceSms(params: {
    guardianPhone: string;
    studentName: string;
    date: string;
    schoolName: string;
  }): Promise<boolean>;
}

export class LoggingSmsProvider implements SmsProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
  }

  async sendSms(params: SendSmsParams) {
    if (!this.apiKey) {
      console.log(`[SmsProvider:LOG] Phone: ${params.to} | Message: "${params.message}"`);
      return { success: true, messageId: `mock_sms_${Date.now()}` };
    }

    try {
      // In production, integrate with Semaphore (PH) or Twilio
      console.log(`[SmsProvider:DISPATCH] Phone: ${params.to} | Length: ${params.message.length}`);
      return { success: true, messageId: `sms_disp_${Date.now()}` };
    } catch (err: any) {
      console.error('[SmsProvider] Failed to dispatch SMS:', err.message);
      return { success: false, error: err.message };
    }
  }

  async sendAbsenceSms(params: {
    guardianPhone: string;
    studentName: string;
    date: string;
    schoolName: string;
  }) {
    const text = `[${params.schoolName}] NOTICE: Your child ${params.studentName} was marked ABSENT today (${params.date}). Please check the parent portal.`;
    const res = await this.sendSms({
      to: params.guardianPhone,
      message: text,
    });
    return res.success;
  }
}

export const defaultSmsProvider = new LoggingSmsProvider();
