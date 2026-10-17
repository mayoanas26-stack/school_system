// src/lib/pwa/offlineQueue.ts
export interface QueuedAttendanceEntry {
  studentId: string;
  sectionId: string;
  date: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  remarks?: string;
  queuedAt: string;
}

const STORAGE_KEY = 'psaa_offline_attendance_queue';

export class OfflineAttendanceQueue {
  static getQueue(): QueuedAttendanceEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static enqueue(entry: Omit<QueuedAttendanceEntry, 'queuedAt'>) {
    if (typeof window === 'undefined') return;
    const current = this.getQueue();
    const item: QueuedAttendanceEntry = {
      ...entry,
      queuedAt: new Date().toISOString(),
    };
    current.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    console.log(`[OfflineQueue] Enqueued offline attendance entry for student ${entry.studentId}`);
  }

  static clearQueue() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  static async syncQueue(syncHandler: (entries: QueuedAttendanceEntry[]) => Promise<boolean>) {
    const queue = this.getQueue();
    if (queue.length === 0) return true;

    console.log(`[OfflineQueue] Attempting to sync ${queue.length} pending offline entries...`);
    try {
      const success = await syncHandler(queue);
      if (success) {
        this.clearQueue();
        console.log('[OfflineQueue] Successfully synchronized offline attendance entries.');
        return true;
      }
      return false;
    } catch (err) {
      console.error('[OfflineQueue] Sync failed:', err);
      return false;
    }
  }
}
