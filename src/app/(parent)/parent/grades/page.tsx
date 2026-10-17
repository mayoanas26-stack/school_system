// src/app/(parent)/grades/page.tsx
'use client';

import React, { useState } from 'react';
import { Award, FileDown, Users } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function ParentGradesPage() {
  const children = SchoolService.getLinkedChildren('usr_parent_1');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.student_id || 'stu_gabriel'
  );

  const activeStudent = SchoolService.getStudentById(selectedChildId);

  const subjectsData = [
    { code: 'MATH-10', name: 'Mathematics 10', q1: 94, q2: 96, remarks: 'Passed - With High Honors' },
    { code: 'SCI-10', name: 'Science 10', q1: 91, q2: 93, remarks: 'Passed' },
    { code: 'ENG-10', name: 'English 10', q1: 95, q2: 95, remarks: 'Passed - With High Honors' },
    { code: 'FIL-10', name: 'Filipino 10', q1: 93, q2: 92, remarks: 'Passed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Monitoring</h1>
          <p className="text-sm text-slate-500">
            Official quarterly grades, teacher remarks, and Form 138 report card previews for your children.
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

      {/* Grade Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <span className="font-bold text-slate-900 text-sm">
              {activeStudent?.user?.first_name} {activeStudent?.user?.last_name}
            </span>
            <span className="text-xs text-slate-500 ml-2 font-mono">LRN: {activeStudent?.lrn}</span>
          </div>

          <a
            href={`/api/pdf/report-card?student_id=${selectedChildId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FileDown className="h-3.5 w-3.5" />
            <span>Download Form 138 (PDF)</span>
          </a>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3 text-center">1st Quarter</th>
              <th className="px-4 py-3 text-center">2nd Quarter</th>
              <th className="px-4 py-3 text-center">Average</th>
              <th className="px-4 py-3 text-right">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjectsData.map((sub) => {
              const avg = (sub.q1 + sub.q2) / 2;
              return (
                <tr key={sub.code} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-700">{sub.q1}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-blue-700">{sub.q2}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-emerald-600">
                    {avg.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5">
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
