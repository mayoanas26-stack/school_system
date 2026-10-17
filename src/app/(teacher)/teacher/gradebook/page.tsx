// src/app/(teacher)/gradebook/page.tsx
'use client';

import React, { useState } from 'react';
import { Award, Lock, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { SchoolService, computeTransmutedGrade } from '@/lib/services/schoolService';

export default function TeacherGradebookPage() {
  const students = SchoolService.getStudents();
  const gradingPeriods = SchoolService.getGradingPeriods();
  const [selectedPeriodId, setSelectedPeriodId] = useState('gp_q2');

  const activePeriod = gradingPeriods.find((p) => p.id === selectedPeriodId) || gradingPeriods[1];
  const isLocked = activePeriod?.is_locked;

  // Grade scores state: [studentId]: { ww: number, pt: number, qa: number }
  const [scores, setScores] = useState<
    Record<string, { ww: number; pt: number; qa: number }>
  >({
    stu_gabriel: { ww: 94, pt: 96, qa: 92 },
    stu_sofia: { ww: 88, pt: 90, qa: 85 },
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const calculateFinal = (studentId: string) => {
    const s = scores[studentId] || { ww: 0, pt: 0, qa: 0 };
    // DepEd weights: 30% WW + 50% PT + 20% QA
    const weightedPct = s.ww * 0.3 + s.pt * 0.5 + s.qa * 0.2;
    const transmuted = computeTransmutedGrade(weightedPct);
    return { weightedPct: Math.round(weightedPct * 10) / 10, transmuted };
  };

  const handleScoreChange = (
    studentId: string,
    field: 'ww' | 'pt' | 'qa',
    val: string
  ) => {
    if (isLocked) return;
    const num = Math.min(100, Math.max(0, parseFloat(val) || 0));
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { ww: 0, pt: 0, qa: 0 }),
        [field]: num,
      },
    }));
  };

  const handleSaveGrades = () => {
    if (isLocked) return;
    students.forEach((s) => {
      const { transmuted } = calculateFinal(s.id);
      SchoolService.encodeGrade({
        studentId: s.id,
        subjectId: 'subj_math_10',
        gradingPeriodId: selectedPeriodId,
        rawScore: transmuted,
        maxScore: 100,
      });
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">SMS Gradebook Encoding</h1>
          <p className="text-sm text-slate-500">
            Subject: Mathematics 10 • Section: 10 - Rizal • DepEd Standard Weights (30% WW, 50% PT, 20% QA)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriodId}
            onChange={(e) => setSelectedPeriodId(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-800 bg-white"
          >
            {gradingPeriods.map((gp) => (
              <option key={gp.id} value={gp.id}>
                {gp.name} {gp.is_locked ? '(LOCKED)' : '(OPEN)'}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSaveGrades}
            disabled={isLocked}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 transition shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save to SMS Gradebook</span>
          </button>
        </div>
      </div>

      {isLocked && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800 flex items-center gap-2">
          <Lock className="h-5 w-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold">Grading Period Locked:</span> This quarter has been locked by the Administrator. Grade modifications require administrative appeal.
          </div>
        </div>
      )}

      {savedSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Grades calculated and synced to official SMS records!</span>
        </div>
      )}

      {/* Gradebook Grid */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Student Name</th>
              <th className="px-4 py-3 text-center">Written Work (30%)</th>
              <th className="px-4 py-3 text-center">Performance Tasks (50%)</th>
              <th className="px-4 py-3 text-center">Quarterly Exam (20%)</th>
              <th className="px-4 py-3 text-center font-bold">Weighted Score</th>
              <th className="px-4 py-3 text-center font-bold text-blue-700">Transmuted Grade</th>
              <th className="px-4 py-3 text-center">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const s = scores[student.id] || { ww: 0, pt: 0, qa: 0 };
              const { weightedPct, transmuted } = calculateFinal(student.id);
              const isPassing = transmuted >= 75;

              return (
                <tr key={student.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">
                      {student.user?.first_name} {student.user?.last_name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">LRN: {student.lrn}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.ww}
                      disabled={isLocked}
                      onChange={(e) => handleScoreChange(student.id, 'ww', e.target.value)}
                      className="w-16 rounded border border-slate-300 p-1 text-center font-mono text-xs font-bold bg-white disabled:bg-slate-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.pt}
                      disabled={isLocked}
                      onChange={(e) => handleScoreChange(student.id, 'pt', e.target.value)}
                      className="w-16 rounded border border-slate-300 p-1 text-center font-mono text-xs font-bold bg-white disabled:bg-slate-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.qa}
                      disabled={isLocked}
                      onChange={(e) => handleScoreChange(student.id, 'qa', e.target.value)}
                      className="w-16 rounded border border-slate-300 p-1 text-center font-mono text-xs font-bold bg-white disabled:bg-slate-100"
                    />
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-xs font-semibold text-slate-700">
                    {weightedPct}%
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-mono text-base font-bold text-blue-700">
                      {transmuted}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isPassing
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isPassing ? 'Passed' : 'Needs Remediation'}
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
