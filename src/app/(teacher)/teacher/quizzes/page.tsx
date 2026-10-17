// src/app/(teacher)/quizzes/page.tsx
'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, CheckCircle, Clock, Trash2, Award } from 'lucide-react';

export default function TeacherQuizzesPage() {
  const [quizzes, setQuizzes] = useState([
    {
      id: 'quiz_1',
      title: 'Polynomial Functions Mastery Check',
      subject: 'Mathematics 10 - Rizal',
      timeLimit: 20,
      questionsCount: 5,
      submissionsCount: 38,
      avgScore: '88.5%',
      status: 'active',
    },
    {
      id: 'quiz_2',
      title: 'Circle Theorems & Tangents Diagnostic',
      subject: 'Mathematics 10 - Rizal',
      timeLimit: 15,
      questionsCount: 4,
      submissionsCount: 0,
      avgScore: '—',
      status: 'draft',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLimit, setNewLimit] = useState('20');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setQuizzes([
      ...quizzes,
      {
        id: `quiz_${Date.now()}`,
        title: newTitle,
        subject: 'Mathematics 10 - Rizal',
        timeLimit: parseInt(newLimit) || 20,
        questionsCount: 5,
        submissionsCount: 0,
        avgScore: '—',
        status: 'active',
      },
    ]);
    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Auto-Graded Quizzes & Question Banks</h1>
          <p className="text-sm text-slate-500">
            Create timed online quizzes with multiple-choice, true/false, and short answer questions with instant grade sync.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+ Create New Quiz</span>
        </button>
      </div>

      {showCreateModal && (
        <form onSubmit={handleCreate} className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">New Quiz Setup</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Quiz Title</label>
            <input
              type="text"
              placeholder="e.g. Mid-Quarter Diagnostic Exam"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white font-semibold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 bg-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Auto-Grading Action</label>
              <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 font-semibold text-[11px]">
                Instant Sync to SMS Gradebook (QA/WW)
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              Publish Quiz
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{quiz.subject}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                    quiz.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {quiz.status}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-2">{quiz.title}</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <div className="font-bold text-slate-900">{quiz.timeLimit} mins</div>
                  <div className="text-[10px] text-slate-400">Duration</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <div className="font-bold text-slate-900">{quiz.questionsCount} items</div>
                  <div className="text-[10px] text-slate-400">Questions</div>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2 border border-emerald-100">
                  <div className="font-bold text-emerald-700">{quiz.avgScore}</div>
                  <div className="text-[10px] text-emerald-600">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">{quiz.submissionsCount} submissions received</span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Viewing question bank & analytics for ${quiz.title}`);
                }}
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Inspect Results &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
