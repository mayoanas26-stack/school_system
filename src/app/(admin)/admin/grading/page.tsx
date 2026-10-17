// src/app/(admin)/grading/page.tsx
'use client';

import React, { useState } from 'react';
import { Award, Lock, Unlock, FileDown, CheckCircle, ShieldCheck } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminGradingPage() {
  const gradingPeriods = SchoolService.getGradingPeriods();
  const [periods, setPeriods] = useState(gradingPeriods);
  const students = SchoolService.getStudents();
  const subjects = SchoolService.getSubjects();

  const handleToggleLock = (periodId: string, currentLocked: boolean) => {
    SchoolService.toggleGradeLock(periodId, !currentLocked);
    setPeriods([...SchoolService.getGradingPeriods()]);
  };

  // Sample student grades summary
  const gabrielGrades = SchoolService.getGradesForStudent('stu_gabriel');
  const avgGrade =
    gabrielGrades.reduce((sum, g) => sum + (g.transmuted_grade || 0), 0) /
    (gabrielGrades.length || 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Grading Policies & Report Cards</h1>
          <p className="text-sm text-slate-500">
            Enforce grade submission deadlines, lock/unlock grading quarters, and generate official DepEd Form 138/137 transcripts.
          </p>
        </div>
      </div>

      {/* Period Locking Cards */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <span>Quarterly Grade Submission Status</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className={`rounded-lg border p-4 transition ${
                period.is_locked ? 'bg-rose-50/40 border-rose-200' : 'bg-emerald-50/40 border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{period.name}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    period.is_locked ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {period.is_locked ? 'LOCKED' : 'OPEN'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {period.start_date} to {period.end_date}
              </p>
              <button
                type="button"
                onClick={() => handleToggleLock(period.id, period.is_locked)}
                className={`mt-4 w-full rounded-md py-1.5 text-xs font-semibold transition ${
                  period.is_locked
                    ? 'border border-rose-300 bg-white text-rose-700 hover:bg-rose-50'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {period.is_locked ? 'Unlock for Faculty' : 'Lock Quarter Grades'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Honor Roll & Official Report Card Generator */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Academic Standings & Report Cards (S.Y. 2025-2026)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Computed general averages and downloadable official Form 138 PDF cards.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border rounded-lg overflow-hidden">
          {students.map((student) => (
            <div key={student.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {student.user?.first_name} {student.user?.last_name}
                  </span>
                  <span className="text-xs font-mono text-slate-500">LRN: {student.lrn}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Grade 10 - Rizal • Homeroom: Prof. Juan Dela Cruz
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Quarter General Average</div>
                  <div className="text-lg font-bold text-emerald-600 font-mono">
                    {avgGrade.toFixed(2)}%
                  </div>
                </div>

                <div className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                  With High Honors
                </div>

                <a
                  href={`/api/pdf/report-card?student_id=${student.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                >
                  <FileDown className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download Form 138 (PDF)</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
