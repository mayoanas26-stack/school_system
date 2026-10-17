// src/app/(teacher)/attendance/page.tsx
'use client';

import React, { useState } from 'react';
import { CalendarCheck, Save, CheckCircle, UserCheck, AlertTriangle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function TeacherAttendanceSheetPage() {
  const students = SchoolService.getStudents();
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, 'present' | 'late' | 'absent' | 'excused'>
  >({
    stu_gabriel: 'present',
    stu_sofia: 'present',
  });
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({
    stu_gabriel: '',
    stu_sofia: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleStatusChange = (
    studentId: string,
    status: 'present' | 'late' | 'absent' | 'excused'
  ) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, 'present'> = {};
    students.forEach((s) => (updated[s.id] = 'present'));
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s.id,
        sectionId: 'sec_10_rizal',
        date: selectedDate,
        status: attendanceMap[s.id] || 'present',
        remarks: remarksMap[s.id] || '',
      }));

      await SchoolService.recordAttendance(records);
      setStatusMessage('Attendance recorded successfully! Absence notices sent to guardians.');
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Sheet</h1>
          <p className="text-sm text-slate-500">
            Homeroom Section: Grade 10 - Rizal • Mark daily attendance and dispatch instant notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-50 shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save & Dispatch Alerts'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Date Picker Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-600">Attendance Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          Total Students in Roster: {students.length}
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">LRN</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Remarks / Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const currentStatus = attendanceMap[student.id] || 'present';
              return (
                <tr key={student.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">
                    {student.lrn}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {student.user?.first_name} {student.user?.last_name}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {(['present', 'late', 'absent', 'excused'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(student.id, st)}
                          className={`rounded px-2.5 py-1 text-xs font-bold capitalize transition ${
                            currentStatus === st
                              ? st === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : st === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : st === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      placeholder="Optional remarks (e.g. Traffic, Clinic)"
                      value={remarksMap[student.id] || ''}
                      onChange={(e) =>
                        setRemarksMap({ ...remarksMap, [student.id]: e.target.value })
                      }
                      className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
