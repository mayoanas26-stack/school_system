// src/app/(parent)/billing/page.tsx
'use client';

import React, { useState } from 'react';
import { CreditCard, Receipt, ArrowDownToLine, ShieldCheck, CheckCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function ParentBillingPage() {
  const children = SchoolService.getLinkedChildren('usr_parent_1');
  const [selectedChildId, setSelectedChildId] = useState<string>(
    children[0]?.student_id || 'stu_gabriel'
  );
  const [payAmount, setPayAmount] = useState('11000');
  const [isProcessingStripe, setIsProcessingStripe] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  const activeStudent = SchoolService.getStudentById(selectedChildId);
  const ledger = SchoolService.getLedger(selectedChildId);
  const payments = SchoolService.getPayments(selectedChildId);

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledger) return;

    setIsProcessingStripe(true);
    try {
      // Simulate/trigger Stripe online checkout session
      const recorded = await SchoolService.recordPayment({
        ledgerId: ledger.id,
        studentId: selectedChildId,
        amount: parseFloat(payAmount),
        paymentMethod: 'stripe_card',
        transactionReference: `pi_${Date.now()}`,
        notes: 'Online Tuition Payment via Stripe Checkout',
      });

      setPaymentSuccess(
        `Payment successful! Official Receipt ${recorded.receipt_number} generated and emailed to parent@school.edu.ph.`
      );
      setTimeout(() => setPaymentSuccess(null), 6000);
    } finally {
      setIsProcessingStripe(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tuition & Online Payments</h1>
          <p className="text-sm text-slate-500">
            Pay balances securely via Stripe (Credit/Debit Card, GCash, Maya) and download official receipts.
          </p>
        </div>

        {/* Child Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChildId(child.student_id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedChildId === child.student_id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {child.student?.user?.first_name}
            </button>
          ))}
        </div>
      </div>

      {paymentSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{paymentSuccess}</span>
        </div>
      )}

      {ledger && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Breakdown & Online Checkout */}
          <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-3 mb-4">
                <span className="font-bold text-slate-900 text-sm">Account Overview</span>
                <span className="text-xs font-mono text-slate-500">S.Y. 2025-2026</span>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Assessed Fees:</span>
                  <span className="font-bold text-slate-900">₱{ledger.total_assessed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scholarship Discount:</span>
                  <span className="text-emerald-600 font-bold">-₱{ledger.total_discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payments Made:</span>
                  <span className="text-emerald-700 font-bold">₱{ledger.total_paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold text-rose-700">
                  <span>Balance Due:</span>
                  <span>₱{ledger.remaining_balance.toLocaleString()}</span>
                </div>
              </div>

              {ledger.remaining_balance > 0 && (
                <form onSubmit={handleStripeCheckout} className="mt-6 pt-4 border-t space-y-3">
                  <label className="block text-xs font-semibold text-slate-700">
                    Amount to Pay (₱ PHP)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={ledger.remaining_balance}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold font-mono text-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={isProcessingStripe}
                    className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition disabled:opacity-50 shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>
                      {isProcessingStripe ? 'Opening Stripe...' : `Pay ₱${parseFloat(payAmount || '0').toLocaleString()} Online`}
                    </span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span>Secured with Stripe 256-bit SSL Encryption</span>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Official Receipts Table */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-600" />
                <span>Payment Receipts on File ({payments.length})</span>
              </span>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Receipt No.</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Amount Paid</th>
                  <th className="px-4 py-3 text-right">Receipt PDF</th>
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
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
