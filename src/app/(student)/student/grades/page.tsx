// src/app/(student)/grades/page.tsx
'use client';

import React from 'react';
import { Award, FileDown, CheckCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function StudentGradesPage() {
  const student = SchoolService.getStudentById('stu_gabriel');
  const grades = SchoolService.getGradesForStudent('stu_gabriel');

  const subjectsData = [
    { code: 'MATH-10', name: 'Mathematics 10', q1: 94, q2: 96, remarks: 'Passed - With High Honors' },
    { code: 'SCI-10', name: 'Science 10', q1: 91, q2: 93, remarks: 'Passed' },
    { code: 'ENG-10', name: 'English 10', q1: 95, q2: 95, remarks: 'Passed - With High Honors' },
    { code: 'FIL-10', name: 'Filipino 10', q1: 93, q2: 92, remarks: 'Passed' },
  ];

  const overallGpa =
    subjectsData.reduce((acc, curr) => acc + (curr.q1 + curr.q2) / 2, 0) / subjectsData.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Standing & Grades</h1>
          <p className="text-sm text-slate-500">
            S.Y. 2025-2026 • Grade 10 - Rizal • DepEd K-12 Transmuted Rating Scale
          </p>
        </div>

        <div>
          <a
            href="/api/pdf/report-card?student_id=stu_gabriel"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FileDown className="h-4 w-4" />
            <span>Download Official Form 138 (PDF)</span>
          </a>
        </div>
      </div>

      {/* GPA & Honors Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Current Academic Honor Standing
            </div>
            <div className="text-xl font-black text-slate-900">With High Honors (94.25%)</div>
          </div>
        </div>

        <div className="rounded-lg bg-white border border-amber-200 px-4 py-2 text-right">
          <div className="text-xs text-slate-400">Quarter General Average</div>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {overallGpa.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3 text-center">1st Quarter</th>
              <th className="px-4 py-3 text-center">2nd Quarter (Current)</th>
              <th className="px-4 py-3 text-center">Running Average</th>
              <th className="px-4 py-3 text-right">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjectsData.map((sub) => {
              const avg = (sub.q1 + sub.q2) / 2;
              return (
                <tr key={sub.code} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{sub.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{sub.code}</div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">
                    {sub.q1}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-blue-700">
                    {sub.q2}
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">
                    {avg.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5">
                      {sub.remarks}
                    </span>
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
