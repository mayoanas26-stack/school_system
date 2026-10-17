// src/app/(parent)/summaries/page.tsx
'use client';

import React, { useState } from 'react';
import { FileCheck, Mail, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function ParentSummariesPage() {
  const children = SchoolService.getLinkedChildren('usr_parent_1');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.student_id || 'stu_gabriel'
  );
  const [sentDigest, setSentDigest] = useState(false);

  const activeStudent = SchoolService.getStudentById(selectedChildId);

  const handleSendDigestEmail = () => {
    setSentDigest(true);
    setTimeout(() => setSentDigest(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Guardian Weekly Summaries</h1>
          <p className="text-sm text-slate-500">
            Automated digests delivered to parent email: upcoming deadlines, missing assignments, and attendance logs.
          </p>
        </div>

        {/* Multi-Child Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChildId(child.student_id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedChildId === child.student_id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {child.student?.user?.first_name}
            </button>
          ))}
        </div>
      </div>

      {sentDigest && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">Weekly academic digest sent to parent@school.edu.ph!</span>
        </div>
      )}

      {/* Summary Digest Card Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 max-w-3xl">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Weekly Digest Preview: {activeStudent?.user?.first_name} {activeStudent?.user?.last_name}
            </h2>
            <p className="text-xs text-slate-500">For the period Oct 12 – Oct 18, 2026</p>
          </div>
          <button
            type="button"
            onClick={handleSendDigestEmail}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Send Email Digest Now</span>
          </button>
        </div>

        {/* Attendance Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Attendance This Week
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center">
              <div className="text-xl font-bold text-emerald-700">4</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Days Present</div>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-center">
              <div className="text-xl font-bold text-amber-700">1</div>
              <div className="text-[11px] text-amber-600 font-semibold">Day Late (Traffic)</div>
            </div>
            <div className="rounded-lg bg-rose-50 border border-rose-100 p-3 text-center">
              <div className="text-xl font-bold text-rose-700">0</div>
              <div className="text-[11px] text-rose-600 font-semibold">Unexcused Absences</div>
            </div>
          </div>
        </div>

        {/* Missing & Upcoming Coursework */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Classwork & Upcoming Deadlines
          </h3>
          <div className="rounded-lg border border-slate-200 divide-y text-xs">
            <div className="p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Problem Set 5: Circle Theorems</span>
                <span className="text-slate-500 ml-2">(Mathematics 10)</span>
              </div>
              <span className="text-amber-700 font-semibold">Due: Oct 25, 2026</span>
            </div>
            <div className="p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Science Lab Reflection Report</span>
                <span className="text-slate-500 ml-2">(Science 10)</span>
              </div>
              <span className="text-amber-700 font-semibold">Due: Oct 28, 2026</span>
            </div>
          </div>
        </div>

        {/* Latest Announcements */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            School Announcements
          </h3>
          <div className="rounded-lg bg-slate-50 p-4 border text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">Quarter 2 Midterm PTC Schedule</div>
            <p>
              Parent-Teacher Conferences will be held virtually via Google Meet on Friday, November 7, 2026. Scheduling links will be opened next Monday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
