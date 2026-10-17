// src/app/(admin)/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { Settings, Shield, Clock, Database, Download, Trash2, CheckCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminSettingsPage() {
  const school = SchoolService.getSchoolInfo();
  const [timezone, setTimezone] = useState(school.timezone);
  const [currency, setCurrency] = useState(school.currency);
  const [dataRetentionYears, setDataRetentionYears] = useState('5');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System & Privacy Settings</h1>
        <p className="text-sm text-slate-500">
          Configure Philippine timezone, currency, Data Privacy Act compliance, and database backup controls.
        </p>
      </div>

      {savedMessage && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">School settings and privacy policies saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Localization */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>School Localization & Currency</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white text-slate-800"
              >
                <option value="Asia/Manila">Asia/Manila (GMT+8 Philippine Standard Time)</option>
                <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                <option value="UTC">UTC (Coordinated Universal Time)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Currency Code</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white text-slate-800"
              >
                <option value="PHP">PHP (Philippine Peso ₱)</option>
                <option value="USD">USD (US Dollar $)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Privacy Act & Minors' Data Compliance */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-purple-600" />
            <span>Data Privacy Act of 2012 (RA 10173) Governance</span>
          </h2>
          <div className="space-y-4 text-xs text-slate-600">
            <p>
              To protect student minors, sensitive medical logs, psychological counselor notes, and private teacher feedback are restricted with strict Row Level Security.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Data Retention Period</label>
                <select
                  value={dataRetentionYears}
                  onChange={(e) => setDataRetentionYears(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white text-slate-800"
                >
                  <option value="5">5 Years after graduation (DepEd Standard)</option>
                  <option value="7">7 Years</option>
                  <option value="10">10 Years</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student-to-Student Direct Chat</label>
                <div className="p-2 bg-slate-50 border rounded-lg text-slate-500 font-semibold">
                  Disabled by default (Student Safety Mandate)
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => alert('DPA Student Data Export initiated. Archive will be generated in server background.')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export School PII Compliance Archive</span>
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
        >
          Save System Configuration
        </button>
      </form>
    </div>
  );
}
