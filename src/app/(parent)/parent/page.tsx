// src/app/(parent)/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function ParentDashboardPage() {
  const children = SchoolService.getLinkedChildren('usr_parent_1');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.student_id || 'stu_gabriel'
  );

  const activeLink = children.find((c) => c.student_id === selectedChildId) || children[0];
  const activeStudent = activeLink?.student;

  const ledger = SchoolService.getLedger(selectedChildId);
  const attendance = SchoolService.getAttendance(selectedChildId);
  const grades = SchoolService.getGradesForStudent(selectedChildId);

  return (
    <div className="space-y-6">
      {/* Multi-Child Selector Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                Guardian Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Mrs. Corazon Dela Cruz</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Family Academic Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Switch between your enrolled children to review academic standings, attendance, and tuition accounts.
            </p>
          </div>

          {/* Child Switcher Pills */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {children.map((child) => {
              const isSelected = child.student_id === selectedChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.student_id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>
                    {child.student?.user?.first_name} ({child.student?.id === 'stu_gabriel' ? 'Gr. 10' : 'Gr. 7'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Child Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Current Standing</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">With High Honors</div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold font-mono">94.0% General Average</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Attendance Status</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CalendarCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">Present Today</div>
          <div className="mt-1 text-xs text-slate-500 font-mono">Checked in 07:45 AM</div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tuition Balance</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 font-mono">
            ₱{ledger?.remaining_balance.toLocaleString() || '0'}
          </div>
          <div className="mt-1 text-xs text-slate-500">Next installment due: Oct 25</div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity for Child */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-900">
                {activeStudent?.user?.first_name}&apos;s Academic Progress
              </h2>
              <span className="text-xs text-slate-400 font-mono">LRN: {activeStudent?.lrn}</span>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              All Quarter 1 and Quarter 2 ratings are currently in passing standing.
            </p>
            <div className="rounded-lg bg-slate-50 border p-3 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span>Mathematics 10:</span>
                <span className="font-bold text-emerald-700">96.0 (Passed)</span>
              </div>
              <div className="flex justify-between">
                <span>Science 10:</span>
                <span className="font-bold text-emerald-700">93.0 (Passed)</span>
              </div>
              <div className="flex justify-between">
                <span>English 10:</span>
                <span className="font-bold text-emerald-700">95.0 (Passed)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/parent/grades"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>View Full Report Card</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Tuition Online Payment Quick Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-1">Tuition & Online Billing</h2>
            <p className="text-xs text-slate-500 mb-4">
              Securely pay balance online via Stripe Checkout (Credit/Debit cards, GCash, Maya).
            </p>

            <div className="rounded-lg bg-slate-50 border p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Annual Assessment:</span>
                <span className="font-mono font-bold">₱{ledger?.total_assessed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Paid to Date:</span>
                <span className="font-mono font-bold">₱{ledger?.total_paid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-bold text-rose-700">
                <span>Remaining Balance:</span>
                <span className="font-mono">₱{ledger?.remaining_balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/parent/billing"
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
            >
              Pay Balance Online via Stripe &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
