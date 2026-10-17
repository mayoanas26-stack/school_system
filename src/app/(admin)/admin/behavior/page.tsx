// src/app/(admin)/behavior/page.tsx
'use client';

import React, { useState } from 'react';
import { HeartPulse, ShieldAlert, UserCheck, Plus, CheckCircle, Lock } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminBehaviorHealthPage() {
  const [activeTab, setActiveTab] = useState<'behavior' | 'clinic' | 'guidance'>('behavior');

  const behaviorLogs = [
    {
      id: 'beh_1',
      student: 'Gabriel Dela Cruz (Grade 10 - Rizal)',
      incidentDate: '2026-10-14',
      type: 'Commendation',
      severity: 'Minor',
      description: 'Awarded 1st place in Regional Inter-School Mathematics Olympiad.',
      action: 'Certificated in Flag Ceremony; recorded in permanent file.',
      visibleToParent: true,
    },
    {
      id: 'beh_2',
      student: 'Marco Silang (Grade 10 - Bonifacio)',
      incidentDate: '2026-10-15',
      type: 'Attendance Concern',
      severity: 'Moderate',
      description: 'Three unexcused absences without parent notification.',
      action: 'Referred to homeroom adviser for parent conference.',
      visibleToParent: true,
    },
  ];

  const clinicVisits = [
    {
      id: 'cli_1',
      student: 'Gabriel Dela Cruz',
      date: '2026-10-16 09:30 AM',
      complaint: 'Mild headache and eye strain during laboratory exam.',
      treatment: 'Rest for 30 minutes, vital signs checked (BP 110/70, Temp 36.5C). Given water and paracetamol.',
      nurse: 'Nurse Joy Reyes, RN',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Behavior, Guidance & Clinic Records</h1>
          <p className="text-sm text-slate-500">
            Confidential student wellbeing logs with restricted Row Level Security (Principal, Guidance, and Clinic).
          </p>
        </div>
      </div>

      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('behavior')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'behavior'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Discipline & Commendation Logs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('clinic')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'clinic'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          School Clinic Visits
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('guidance')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'guidance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Guidance Counselor Notes (Restricted)
        </button>
      </div>

      {activeTab === 'behavior' && (
        <div className="space-y-4">
          {behaviorLogs.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{log.student}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    log.type === 'Commendation'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {log.type}
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-2">{log.description}</p>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Action: <strong className="text-slate-700">{log.action}</strong></span>
                <span className="font-mono">{log.incidentDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'clinic' && (
        <div className="space-y-4">
          {clinicVisits.map((v) => (
            <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{v.student}</span>
                <span className="text-xs font-mono text-slate-400">{v.date}</span>
              </div>
              <div className="mt-2 text-xs text-slate-700 space-y-1">
                <div>Complaint: <strong>{v.complaint}</strong></div>
                <div>Treatment: <span className="text-slate-600">{v.treatment}</span></div>
                <div className="text-[11px] text-slate-400 mt-2">Attending: {v.nurse}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'guidance' && (
        <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-6 text-xs text-purple-900 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-purple-950">
            <Lock className="h-4 w-4 text-purple-700" />
            <span>Restricted Guidance Counselor Vault</span>
          </div>
          <p>
            Consultation notes and psychological records are strictly classified under Data Privacy Act rules. Access is limited to licensed guidance counselors and school principals.
          </p>
          <div className="rounded-lg bg-white border border-purple-200 p-4 space-y-2">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Counseling Session: Routine Academic Mentoring</span>
              <span className="font-mono text-slate-400">Oct 10, 2026</span>
            </div>
            <p className="text-slate-600">
              Student Gabriel Dela Cruz consulted regarding STEM college admissions test preparation and scholarship options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
