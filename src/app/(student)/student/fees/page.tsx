// src/app/(student)/fees/page.tsx
'use client';

import React from 'react';
import { CreditCard, Receipt, Calendar, ArrowDownToLine } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function StudentFeesPage() {
  const ledger = SchoolService.getLedger('stu_gabriel');
  const payments = SchoolService.getPayments('stu_gabriel');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Statement of Account</h1>
        <p className="text-sm text-slate-500">
          Tuition fee assessments, installment schedules, and official receipt payment records.
        </p>
      </div>

      {ledger && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Assessed Tuition & Misc</span>
            <div className="mt-2 text-2xl font-bold text-slate-900 font-mono">
              ₱{ledger.total_assessed.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-400">Annual Academic Year 2025-2026</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-medium text-slate-500">Total Payments Recorded</span>
            <div className="mt-2 text-2xl font-bold text-emerald-600 font-mono">
              ₱{ledger.total_paid.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-emerald-700 font-semibold">Includes ₱2,000 scholarship discount</div>
          </div>

          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs">
            <span className="text-xs font-medium text-rose-700 font-bold uppercase tracking-wider">
              Remaining Balance Due
            </span>
            <div className="mt-2 text-2xl font-bold text-rose-700 font-mono">
              ₱{ledger.remaining_balance.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">Parent online payment available</div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <Receipt className="h-4 w-4 text-blue-600" />
            <span>Official Receipts on File ({payments.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Receipt No.</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{p.receipt_number}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                    {new Date(p.created_at).toLocaleDateString('en-PH')}
                  </td>
                  <td className="px-4 py-3 capitalize text-xs text-slate-700">
                    {p.payment_method.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    ₱{p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/api/pdf/receipt?payment_id=${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      <ArrowDownToLine className="h-3 w-3" />
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
