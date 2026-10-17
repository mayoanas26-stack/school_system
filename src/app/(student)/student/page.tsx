// src/app/(student)/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  ClipboardList,
  Clock,
  Video,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function StudentDashboardPage() {
  const student = SchoolService.getStudentById('stu_gabriel');
  const classes = SchoolService.getClasses();
  const assignments = SchoolService.getAssignments('cls_math_10_rizal');
  const grades = SchoolService.getGradesForStudent('stu_gabriel');
  const ledger = SchoolService.getLedger('stu_gabriel');

  return (
    <div className="space-y-6">
      {/* Student Welcome Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Student Self-Service Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">LRN: {student?.lrn}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {student?.user?.first_name}!
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Grade 10 - Section Rizal • Homeroom: Prof. Juan Dela Cruz
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/student/todo"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>View My To-Do List</span>
            </Link>
            <Link
              href="/student/grades"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>Report Card</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">My General Average</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">94.0%</div>
          <div className="mt-1 text-xs text-amber-700 font-semibold">With High Honors Standing</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Upcoming Deadlines</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">1 Due Soon</div>
          <div className="mt-1 text-xs text-slate-500">PS5: Circle Theorems</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attendance Rate</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">97.5%</div>
          <div className="mt-1 text-xs text-slate-500">1 medical excuse on file</div>
        </div>
      </div>

      {/* Today's Schedule & Live Video Launcher */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>Today&apos;s Class Schedule & Video Lesson Link</span>
        </h2>

        <div className="divide-y divide-slate-100 border rounded-lg overflow-hidden">
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <span className="font-mono text-xs font-bold text-blue-700">08:00 AM - 09:30 AM</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Mathematics 10 • Grade 10 Rizal</h3>
              <p className="text-xs text-slate-500">Prof. Juan Dela Cruz • Room 201</p>
            </div>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs self-start sm:self-auto"
            >
              <Video className="h-3.5 w-3.5" />
              <span>Join Google Meet</span>
            </a>
          </div>

          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs font-bold text-slate-500">10:00 AM - 12:00 PM</span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">Science 10 • Laboratory Practice</h3>
              <p className="text-xs text-slate-500">Prof. Juan Dela Cruz • Science Lab 1</p>
            </div>
            <span className="text-xs font-medium text-slate-400">In-person session</span>
          </div>
        </div>
      </div>

      {/* Enrolled Classes Stream */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">My Google Classroom Courses</h2>
          <Link href="/student/classes" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
            View All Courses &rarr;
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
                  <span className="text-xs font-semibold text-slate-500">{cls.room}</span>
                  <span className="font-mono text-xs font-bold text-blue-700">{cls.class_code}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2">{cls.name}</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">{cls.schedule_text}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/student/classes/${cls.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Open Classwork</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
