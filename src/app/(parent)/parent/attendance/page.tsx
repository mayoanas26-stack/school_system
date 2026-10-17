// src/app/(parent)/attendance/page.tsx
'use client';

import React, { useState } from 'react';
import { CalendarCheck, AlertTriangle, Users, CheckCircle, Clock } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function ParentAttendancePage() {
  const children = SchoolService.getLinkedChildren('usr_parent_1');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.student_id || 'stu_gabriel'
  );

  const activeStudent = SchoolService.getStudentById(selectedChildId);
  const attendanceRecords = SchoolService.getAttendance(selectedChildId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance History & Alerts</h1>
          <p className="text-sm text-slate-500">
            Real-time daily attendance timestamps, gate check-in alerts, and absence history.
          </p>
        </div>

        {/* Multi-Child Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {children.map((child) => {
            const isSelected = child.student_id === selectedChildId;
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.student_id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  isSelected ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{child.student?.user?.first_name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Instant Notification Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600 shrink-0" />
          <span>
            Instant SMS alerts are dispatched to your registered mobile number (+63 920 888 9999) whenever an unexcused absence is recorded.
          </span>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 font-bold text-slate-800 text-xs">
          Daily Log for {activeStudent?.user?.first_name} {activeStudent?.user?.last_name}
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time Checked In</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Remarks / Excuse</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendanceRecords.map((att) => (
              <tr key={att.id} className="hover:bg-slate-50/50 transition">
                <td className="px-4 py-3 font-mono font-semibold text-slate-800 text-xs">
                  {att.date}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {att.check_in_time
                    ? new Date(att.check_in_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      att.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.status === 'late'
                        ? 'bg-amber-100 text-amber-800'
                        : att.status === 'absent'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {att.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{att.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
