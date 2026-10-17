// src/app/(admin)/audit/page.tsx
'use client';

import React from 'react';
import { ShieldAlert, Database, Calendar } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminAuditPage() {
  const auditLogs = SchoolService.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Audit Trail</h1>
          <p className="text-sm text-slate-500">
            Immutable PostgreSQL database trigger logs capturing all sensitive mutations (grades, payments, enrollments, and permissions).
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <ShieldAlert className="h-4 w-4 text-purple-600" />
            <span>Trigger Audit Log Entries ({auditLogs.length})</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50/50 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                      log.action === 'INSERT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.action === 'UPDATE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-900">{log.table_name}</span>
                  <span className="text-slate-400 font-mono text-xs">Record: {log.record_id}</span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {new Date(log.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                </div>
              </div>

              {(log.old_data || log.new_data) && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  {log.old_data && (
                    <div className="rounded-md bg-rose-50/50 border border-rose-100 p-2.5 text-rose-900 overflow-x-auto">
                      <div className="font-bold text-[10px] uppercase text-rose-600 mb-1">Before Mutation</div>
                      <pre>{JSON.stringify(log.old_data, null, 2)}</pre>
                    </div>
                  )}
                  {log.new_data && (
                    <div className="rounded-md bg-emerald-50/50 border border-emerald-100 p-2.5 text-emerald-900 overflow-x-auto">
                      <div className="font-bold text-[10px] uppercase text-emerald-600 mb-1">After Mutation</div>
                      <pre>{JSON.stringify(log.new_data, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
