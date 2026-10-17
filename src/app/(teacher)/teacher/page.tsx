// src/app/(teacher)/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarCheck,
  Award,
  Video,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ClipboardList,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function TeacherConsolePage() {
  const classes = SchoolService.getClasses();
  const school = SchoolService.getSchoolInfo();

  return (
    <div className="space-y-6">
      {/* Teacher Welcome Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                Faculty Workspace
              </span>
              <span className="text-xs text-slate-500 font-medium">Prof. Juan Dela Cruz • Department of Mathematics</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, Prof. Juan!
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              You have 2 active classes today. 1 submission is waiting for your grading review.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/teacher/attendance"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>Mark Today&apos;s Attendance</span>
            </Link>
            <Link
              href="/teacher/gradebook"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Open SMS Gradebook</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">My Teaching Classes</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{classes.length} Classes</div>
          <div className="mt-1 text-xs text-slate-500">Grade 10 Rizal (Math & Science)</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Review</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <ClipboardList className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">1 Submission</div>
          <div className="mt-1 text-xs text-amber-600 font-medium">Ready for scoring & feedback</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Next Scheduled Class</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">08:00 AM</div>
          <div className="mt-1 text-xs text-slate-500">Math 10 (Room 201)</div>
        </div>
      </div>

      {/* Active Classes Stream Launcher */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">My Google Classroom-Style Subjects</h2>
          <Link href="/teacher/classes" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            View All Classes &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="rounded-xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 font-mono">
                    Code: {cls.class_code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{cls.room}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">{cls.schedule_text}</p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <Link
                  href={`/teacher/classes/${cls.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Open Stream & Classwork</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <a
                  href="https://meet.google.com/new"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                >
                  <Video className="h-3 w-3" />
                  <span>Start Live Meet</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
