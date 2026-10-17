// src/app/(admin)/attendance/page.tsx
'use client';

import React, { useState } from 'react';
import { CalendarCheck, QrCode, Search, UserCheck, AlertCircle, Clock } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminAttendancePage() {
  const sections = SchoolService.getSections();
  const students = SchoolService.getStudents();
  const [selectedSection, setSelectedSection] = useState('sec_10_rizal');
  const [selectedDate, setSelectedDate] = useState('2026-10-17');
  const [qrSimulationMessage, setQrSimulationMessage] = useState<string | null>(null);

  const attendanceRecords = SchoolService.getAttendance();

  const handleSimulateQrScan = async (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    await SchoolService.recordAttendance([
      {
        studentId,
        sectionId: selectedSection,
        date: selectedDate,
        status: 'present',
        remarks: 'QR Gate Terminal Scan',
      },
    ]);
    setQrSimulationMessage(
      `QR Verified: ${student?.user?.first_name} ${student?.user?.last_name} marked PRESENT at ${new Date().toLocaleTimeString('en-PH')}`
    );
    setTimeout(() => setQrSimulationMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Monitoring & QR Gate</h1>
          <p className="text-sm text-slate-500">
            Real-time campus-wide attendance logs, QR/RFID gate check-in status, and instant absence alerts.
          </p>
        </div>
      </div>

      {qrSimulationMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{qrSimulationMessage}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name} ({sec.grade_level?.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white"
            >
            </input>
          </div>
        </div>

        {/* QR Gate Scanner Simulator Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSimulateQrScan('stu_gabriel')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            <QrCode className="h-4 w-4 text-blue-400" />
            <span>Simulate Student QR Tap</span>
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Student LRN</th>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time Checked In</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {attendanceRecords.map((att) => (
              <tr key={att.id} className="hover:bg-slate-50/50 transition">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-700">
                  {att.student?.lrn || '109283746512'}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {att.student?.user?.first_name} {att.student?.user?.last_name}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{att.date}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                  {att.check_in_time
                    ? new Date(att.check_in_time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
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
                <td className="px-4 py-3 text-xs text-slate-500">{att.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
