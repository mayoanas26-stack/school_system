// src/app/(teacher)/classes/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Video, Calendar, ArrowRight } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function TeacherClassesPage() {
  const classes = SchoolService.getClasses();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Teaching Classes</h1>
          <p className="text-sm text-slate-500">
            Access class streams, post announcements, publish assignments, and launch live video sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 font-mono">
                  Code: {cls.class_code}
                </span>
                <span className="text-xs text-slate-500 font-medium">{cls.room}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-3">{cls.name}</h2>
              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{cls.schedule_text}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>40 Students (Synced from SMS 10-Rizal)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/teacher/classes/${cls.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <span>Enter Google Classroom View</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
