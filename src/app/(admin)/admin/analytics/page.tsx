// src/app/(admin)/analytics/page.tsx
'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminAnalyticsPage() {
  const school = SchoolService.getSchoolInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutional Analytics & At-Risk Alerts</h1>
          <p className="text-sm text-slate-500">
            Real-time enrollment trends, attendance rates, finance collections, and early intervention alerts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/export/analytics"
            download="PSAA_School_Analytics_2026.xlsx"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export to Excel (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Early Warning / At-Risk Alerts */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 shadow-xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm mb-2">
          <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
          <span>At-Risk Student Early Intervention Triggers</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          Students flagged due to consecutive absences, missing assignments, or grades falling below 75%.
        </p>

        <div className="rounded-lg bg-white border border-rose-200 divide-y text-xs">
          <div className="p-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Marco Silang</span>
              <span className="text-slate-500 ml-2">Grade 10 - Bonifacio</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-rose-100 text-rose-800 px-2 py-0.5 font-semibold">
                3 Consecutive Absences
              </span>
              <button
                type="button"
                onClick={() => alert('Parent notification SMS and Counselor referral dispatched.')}
                className="rounded border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Notify Guardian
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics KPI Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Performance Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-500" />
            <span>Academic Grade Distribution (Q1 & Q2)</span>
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>With Highest Honors (98 - 100%)</span>
                <span className="text-emerald-700">8.5% (24 students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '8.5%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>With High Honors (95 - 97%)</span>
                <span className="text-blue-700">28.4% (80 students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '28.4%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>With Honors (90 - 94%)</span>
                <span className="text-indigo-700">42.1% (118 students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '42.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Passing Regular (75 - 89%)</span>
                <span className="text-slate-700">19.2% (54 students)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-600 h-full rounded-full" style={{ width: '19.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tuition Collection Efficiency */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            <span>Tuition Revenue & Payment Channels</span>
          </h2>
          <div className="space-y-4 text-xs font-mono">
            <div className="rounded-lg bg-slate-50 border p-4 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Total Assessed Receivables:</span>
                <span className="font-bold text-slate-900">₱ 12,650,000</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Total Collected to Date:</span>
                <span>₱ 8,450,000 (66.8%)</span>
              </div>
              <div className="flex justify-between text-rose-700 font-bold border-t pt-2">
                <span>Outstanding Balance (Q3 & Q4 Dues):</span>
                <span>₱ 4,200,000 (33.2%)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="text-sm font-bold text-slate-900">₱ 5,120,000</div>
                <div className="text-[11px] text-slate-500 font-sans">Stripe Online Checkout</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <div className="text-sm font-bold text-slate-900">₱ 3,330,000</div>
                <div className="text-[11px] text-slate-500 font-sans">Cashier OTC & Bank Deposit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
