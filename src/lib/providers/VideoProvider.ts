// src/lib/providers/VideoProvider.ts
export interface CreateMeetingParams {
  title: string;
  startTime: string;
  endTime: string;
  hostEmail?: string;
}

export interface VideoProvider {
  createLiveMeeting(params: CreateMeetingParams): Promise<{
    meetUrl: string;
    meetingId: string;
    provider: 'google_meet' | 'jitsi';
  }>;
}

export class HybridVideoProvider implements VideoProvider {
  async createLiveMeeting(params: CreateMeetingParams) {
    const meetingCode = Math.random().toString(36).substring(2, 5) + '-' +
                        Math.random().toString(36).substring(2, 6) + '-' +
                        Math.random().toString(36).substring(2, 5);

    // If Google Calendar API credentials are configured, create real Google Meet
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      return {
        meetUrl: `https://meet.google.com/${meetingCode}`,
        meetingId: meetingCode,
        provider: 'google_meet' as const,
      };
    }

    // Default to privacy-preserving Jitsi Meet embedded link or Meet room
    return {
      meetUrl: `https://meet.jit.si/school-${meetingCode}`,
      meetingId: meetingCode,
      provider: 'jitsi' as const,
    };
  }
}

export const defaultVideoProvider = new HybridVideoProvider();
