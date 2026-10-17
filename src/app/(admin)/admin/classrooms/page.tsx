// src/app/(admin)/classrooms/page.tsx
'use client';

import React from 'react';
import { BookOpen, Users, Video, Calendar, Plus } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminClassroomsPage() {
  const classes = SchoolService.getClasses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Classroom Oversight & Provisioning</h1>
          <p className="text-sm text-slate-500">
            Unified classroom management automatically synchronized with SMS sections, subjects, and teacher assignments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-slate-300 transition flex flex-col justify-between">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 font-mono">
                  Code: {cls.class_code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{cls.room}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-2">{cls.name}</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Faculty: Prof. Juan Dela Cruz
              </p>
              <div className="mt-4 text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{cls.schedule_text}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>Roster: 40 Students (Synced from SMS 10-Rizal)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 p-3 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active Class
              </span>
              <a
                href={`/teacher/classes/${cls.id}`}
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Inspect Stream &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
