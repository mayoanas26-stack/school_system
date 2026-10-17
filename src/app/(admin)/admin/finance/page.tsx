// src/app/(admin)/finance/page.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, Plus, Receipt, Search, CheckCircle, ArrowDownToLine, Banknote } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';
import { Payment } from '@/lib/types/database';

export default function AdminFinancePage() {
  const students = SchoolService.getStudents();
  const [payments, setPayments] = useState<Payment[]>(SchoolService.getPayments());
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState('11000');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_deposit' | 'e_wallet_manual'>('cash');
  const [refNumber, setRefNumber] = useState('');
  const [notes, setNotes] = useState('Quarter 2 Installment');
  const [isRecording, setIsRecording] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const ledger = SchoolService.getLedger(selectedStudentId);

  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledger) return;

    setIsRecording(true);
    try {
      const recorded = await SchoolService.recordPayment({
        ledgerId: ledger.id,
        studentId: selectedStudentId,
        amount: parseFloat(paymentAmount),
        paymentMethod,
        transactionReference: refNumber || `CSH-${Date.now().toString().slice(-6)}`,
        notes,
      });

      setPayments([...SchoolService.getPayments()]);
      setSuccessMessage(
        `Official Receipt ${recorded.receipt_number} issued for ₱${recorded.amount.toLocaleString()}!`
      );
      setRefNumber('');
      setTimeout(() => setSuccessMessage(null), 6000);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & Cashier Terminal</h1>
          <p className="text-sm text-slate-500">
            Cashier console: record over-the-counter payments (Cash, Bank Deposit, GCash/Maya), issue official receipts, and audit balances.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cashier Payment Form */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Banknote className="h-5 w-5 text-emerald-600" />
            <span>Record Manual Payment</span>
          </h2>

          <form onSubmit={handleRecordManualPayment} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Student</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium text-slate-800 bg-white"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.user?.first_name} {s.user?.last_name} (LRN: {s.lrn})
                  </option>
                ))}
              </select>
            </div>

            {ledger && (
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-1 text-slate-600 font-mono">
                <div className="flex justify-between">
                  <span>Assessed Tuition:</span>
                  <span className="font-bold text-slate-900">₱{ledger.total_assessed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Paid:</span>
                  <span className="text-emerald-700 font-bold">₱{ledger.total_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold text-rose-700">
                  <span>Remaining Due:</span>
                  <span>₱{ledger.remaining_balance.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Amount (₱ PHP)</label>
              <input
                type="number"
                min="1"
                step="any"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800 bg-white"
              >
                <option value="cash">Cash (Over the counter)</option>
                <option value="bank_deposit">Bank Deposit / Transfer (BDO, BPI, Metrobank)</option>
                <option value="e_wallet_manual">GCash / Maya (Manual Reference)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reference / Check No.</label>
              <input
                type="text"
                placeholder="e.g. GCash Ref #10293849"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Particulars / Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isRecording}
              className="w-full rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50 shadow-xs"
            >
              {isRecording ? 'Processing Receipt...' : 'Record Payment & Issue Official Receipt'}
            </button>
          </form>
        </div>

        {/* Payment History & Receipts */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Receipt className="h-4 w-4 text-blue-600" />
              <span>Issued Official Receipts ({payments.length})</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Receipt No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Ref Code</th>
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
                    <td className="px-4 py-3">
                      <span className="capitalize text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {p.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      ₱{p.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">{p.transaction_reference}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/api/pdf/receipt?payment_id=${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <ArrowDownToLine className="h-3 w-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
