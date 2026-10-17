// src/app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Shield,
  BookOpen,
  Users,
  CreditCard,
  Award,
  Video,
  CheckCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function LandingHomePage() {
  const school = SchoolService.getSchoolInfo();

  const portals = [
    {
      role: 'Admin',
      href: '/admin',
      title: 'Administrator Console',
      badge: 'Super Admin, Registrar, Cashier, Principal',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      description:
        'School setup, admissions approval, fee structures, cashier manual payments, grade locking, and audit logs.',
      icon: Shield,
      accent: 'border-purple-200 hover:border-purple-400 group-hover:bg-purple-50/30',
      features: ['DepEd Form 138/137 Issuance', 'Quarterly Grade Lock', 'Cashier Manual Receipting', 'Database Audit Viewer'],
    },
    {
      role: 'Teacher',
      href: '/teacher',
      title: 'Faculty Workspace',
      badge: 'Subject Teachers & Advisers',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      description:
        'Rosters synced from SMS, Google Classroom stream & assignments, live Meet lessons, and weighted gradebook encoding.',
      icon: BookOpen,
      accent: 'border-blue-200 hover:border-blue-400 group-hover:bg-blue-50/30',
      features: ['Stream Announcements', '1-Click Grade Sync', 'Daily Attendance Sheet', 'Google Meet Classroom'],
    },
    {
      role: 'Student',
      href: '/student',
      title: 'Student Portal',
      badge: 'Self-Service & Learning',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description:
        'Personal timetable, homework submissions, to-do list, teacher private feedback, report card, and fee statement.',
      icon: Users,
      accent: 'border-emerald-200 hover:border-emerald-400 group-hover:bg-emerald-50/30',
      features: ['To-Do Deadlines', 'Online Homework Turn-In', 'Quarterly Grade View', 'Statement of Account'],
    },
    {
      role: 'Parent',
      href: '/parent',
      title: 'Parent & Guardian Portal',
      badge: 'Multi-Child Family Monitor',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      description:
        'Multi-child switcher, instant absence alerts, academic monitoring, Stripe online tuition payments, and weekly digests.',
      icon: CreditCard,
      accent: 'border-amber-200 hover:border-amber-400 group-hover:bg-amber-50/30',
      features: ['Multi-Child Switching', 'Instant Attendance SMS', 'Stripe Online Checkout', 'Weekly Email Summaries'],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/95 px-6 py-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <GraduationCap className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 leading-tight">
                {school.name}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Integrated SMS & Google Classroom Platform
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Asia/Manila (GMT+8) • Philippine Peso (₱)</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Unified School Management + Classroom Experience</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            One Platform. Four Portals. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900">
              Zero Redundant Data Entry.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Rosters, schedules, grades, and attendance flow automatically between school administration and Google Classroom-style learning.
          </p>
        </div>

        {/* Four Role Portals Launchpad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.role}
                className={`group rounded-2xl border bg-white p-6 sm:p-8 shadow-xs transition-all hover:shadow-md flex flex-col justify-between ${p.accent}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                      <Icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mt-5">{p.title}</h2>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.description}</p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    {p.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    href={p.href}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs group-hover:bg-blue-600"
                  >
                    <span>Launch {p.role} Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Architecture Highlight Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Architecture</div>
              <div className="text-base font-bold text-slate-900 mt-1">Postgres Row Level Security</div>
              <p className="text-xs text-slate-500 mt-1">
                Every table enforces strict RLS. Parents see only linked children, teachers only assigned sections.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Payment Flexibility</div>
              <div className="text-base font-bold text-slate-900 mt-1">Dual Payment Channels</div>
              <p className="text-xs text-slate-500 mt-1">
                Online Stripe Checkout (PHP) alongside cashier manual cash, bank transfer, and GCash receipting.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Privacy Mindset</div>
              <div className="text-base font-bold text-slate-900 mt-1">RA 10173 DPA Compliance</div>
              <p className="text-xs text-slate-500 mt-1">
                Minors&apos; PII guarded, private teacher-student assignment dialogue, and trigger-logged audit trails.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 text-center text-xs text-slate-500">
        <div>
          {school.name} • {school.address} • Operating Timezone: {school.timezone}
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          Built with Next.js App Router, Supabase PostgreSQL, Clerk Auth, Stripe, and Resend.
        </div>
      </footer>
    </div>
  );
}
