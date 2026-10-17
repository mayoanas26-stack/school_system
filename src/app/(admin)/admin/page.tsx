// src/app/(admin)/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowUpRight,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminOverviewPage() {
  const school = SchoolService.getSchoolInfo();
  const students = SchoolService.getStudents();
  const sections = SchoolService.getSections();
  const gradingPeriods = SchoolService.getGradingPeriods();
  const [periods, setPeriods] = useState(gradingPeriods);
  const auditLogs = SchoolService.getAuditLogs();

  const handleToggleLock = (periodId: string, currentLocked: boolean) => {
    SchoolService.toggleGradeLock(periodId, !currentLocked);
    setPeriods([...SchoolService.getGradingPeriods()]);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-purple-50 px-2 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
                Super Admin Console
              </span>
              <span className="text-xs text-slate-500 font-medium">Manila Standard Time</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {school.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Academic Year 2025-2026 • 2nd Quarter Active • {school.address}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/admissions"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Review Admissions</span>
            </Link>
            <Link
              href="/admin/finance"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Cashier Terminal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Enrolled</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{students.length * 150}</div>
          <div className="mt-1 flex items-center text-xs text-emerald-600 font-medium">
            <span>+12.4% vs last academic year</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sections Active</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{sections.length * 12}</div>
          <div className="mt-1 text-xs text-slate-500">Across Grades 7 to 12</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today Attendance</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">96.8%</div>
          <div className="mt-1 flex items-center text-xs text-slate-500">
            <span>2 excused absences logged</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tuition Collected</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">₱2,845,000</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            <span>Stripe + Cashier manual synced</span>
          </div>
        </div>
      </div>

      {/* Grade Period Locking Control (Core Tier A Security Requirement) */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              <span>Quarterly Grade Locking & Security Control</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Locking a period prevents teachers from modifying grades. Administrators can unlock for official appeals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {periods.map((period) => (
            <div
              key={period.id}
              className={`rounded-lg border p-4 transition-all ${
                period.is_locked
                  ? 'border-rose-200 bg-rose-50/50'
                  : 'border-emerald-200 bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{period.name}</span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    period.is_locked
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {period.is_locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  {period.is_locked ? 'Locked' : 'Open'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 font-mono">
                {period.start_date} to {period.end_date}
              </p>
              <button
                type="button"
                onClick={() => handleToggleLock(period.id, period.is_locked)}
                className={`mt-4 w-full rounded-md px-2.5 py-1.5 text-xs font-semibold shadow-xs transition ${
                  period.is_locked
                    ? 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-100'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {period.is_locked ? 'Unlock for Appeals' : 'Lock Quarter Grades'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trigger Audit Logs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Database Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Immutable changes to grades, payments, and enrollments recorded by database triggers.
            </p>
          </div>
          <Link
            href="/admin/audit"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Logs</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 border rounded-lg overflow-hidden">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3.5 flex items-center justify-between text-xs bg-white hover:bg-slate-50 transition">
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded-md font-mono font-bold ${
                    log.action === 'INSERT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : log.action === 'UPDATE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {log.action}
                </span>
                <div>
                  <span className="font-semibold text-slate-800 font-mono">{log.table_name}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="text-slate-500">ID: {log.record_id.slice(0, 12)}...</span>
                </div>
              </div>
              <div className="text-slate-400 font-mono">
                {new Date(log.created_at).toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila' })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
