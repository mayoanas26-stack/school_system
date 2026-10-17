// src/app/(student)/todo/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ClipboardList, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function StudentTodoPage() {
  const [activeFilter, setActiveFilter] = useState<'assigned' | 'missing' | 'done'>('assigned');

  const items = [
    {
      id: 'asg_1',
      title: 'Problem Set 4: Roots of Polynomial Equations',
      class: 'Mathematics 10 - Rizal',
      due: 'Oct 22, 11:59 PM',
      points: 100,
      status: 'done',
      score: '95/100',
    },
    {
      id: 'asg_2',
      title: 'Geometric Inquiry: Tangent and Secant Segments',
      class: 'Mathematics 10 - Rizal',
      due: 'Oct 28, 11:59 PM',
      points: 50,
      status: 'assigned',
      score: null,
    },
    {
      id: 'asg_3',
      title: 'Science Lab Activity: Electromagnetic Induction',
      class: 'Science 10 - Rizal',
      due: 'Oct 14, 11:59 PM',
      points: 60,
      status: 'done',
      score: '58/60',
    },
  ];

  const filtered = items.filter((item) => {
    if (activeFilter === 'assigned') return item.status === 'assigned';
    if (activeFilter === 'missing') return item.status === 'missing';
    if (activeFilter === 'done') return item.status === 'done';
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student To-Do List</h1>
        <p className="text-sm text-slate-500">
          Track upcoming coursework deadlines, missing submissions, and returned graded work across all subjects.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveFilter('assigned')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeFilter === 'assigned'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Assigned (1)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('missing')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeFilter === 'missing'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Missing (0)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('done')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeFilter === 'done'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Done (2)
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600 font-semibold">
                  {item.points} pts
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{item.class}</p>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">Due: {item.due}</div>
            </div>

            <div className="flex items-center gap-3">
              {item.score && (
                <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-mono font-bold text-emerald-700 border border-emerald-200">
                  Score: {item.score}
                </span>
              )}
              <Link
                href="/student/classes/cls_math_10_rizal"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open Classwork &rarr;
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            No items in this category. You are all caught up!
          </div>
        )}
      </div>
    </div>
  );
}
