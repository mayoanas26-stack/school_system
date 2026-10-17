// src/app/(teacher)/assignments/page.tsx
'use client';

import React, { useState } from 'react';
import { ClipboardList, CheckCircle, FileText, Send, Award, ArrowUpRight } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function TeacherGradingQueuePage() {
  const submissions = SchoolService.getSubmissions('asg_1');
  const [subList, setSubList] = useState(submissions);
  const [selectedSubId, setSelectedSubId] = useState(submissions[0]?.id || '');
  const [scoreInput, setScoreInput] = useState(submissions[0]?.score?.toString() || '95');
  const [feedbackInput, setFeedbackInput] = useState(
    submissions[0]?.feedback || 'Great step-by-step synthetic division!'
  );
  const [privateComment, setPrivateComment] = useState('');
  const [commentsHistory, setCommentsHistory] = useState([
    { id: 'c1', author: 'Gabriel Dela Cruz', text: 'Sir, I attached the handwritten solutions for items 6-10 in page 2.', time: 'Oct 16, 2:25 PM' },
    { id: 'c2', author: 'Prof. Juan Dela Cruz', text: 'Received Gabriel, reviewing your steps now.', time: 'Oct 16, 4:10 PM' },
  ]);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const activeSub = subList.find((s) => s.id === selectedSubId) || subList[0];

  const handleReturnGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSub) return;

    const scoreNum = parseFloat(scoreInput) || 0;
    const updated = SchoolService.gradeSubmission(activeSub.id, scoreNum, feedbackInput);

    setSubList([...SchoolService.getSubmissions('asg_1')]);
    setSuccessBanner(
      `Grade of ${scoreNum}/100 returned to student and automatically synced to SMS Gradebook!`
    );
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateComment.trim()) return;

    setCommentsHistory([
      ...commentsHistory,
      {
        id: `c_${Date.now()}`,
        author: 'Prof. Juan Dela Cruz',
        text: privateComment,
        time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setPrivateComment('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Grading Review Workspace</h1>
          <p className="text-sm text-slate-500">
            Review student submissions, provide private feedback, return scored work, and 1-click sync to SMS gradebook.
          </p>
        </div>
      </div>

      {successBanner && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submissions List Queue */}
        <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Review Queue • Problem Set 4 ({subList.length})
          </h2>

          <div className="space-y-2">
            {subList.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setSelectedSubId(sub.id);
                  setScoreInput(sub.score?.toString() || '95');
                  setFeedbackInput(sub.feedback || '');
                }}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedSubId === sub.id
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {sub.student?.user?.first_name} {sub.student?.user?.last_name}
                  </span>
                  <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 capitalize">
                    {sub.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Submitted: {new Date(sub.submitted_at || '').toLocaleDateString('en-PH')}
                </div>
                {sub.score !== undefined && sub.score !== null && (
                  <div className="text-xs font-bold text-blue-700 mt-2 font-mono">
                    Score: {sub.score} / 100
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Submission Viewer & Grading Box */}
        {activeSub && (
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeSub.student?.user?.first_name} {activeSub.student?.user?.last_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">LRN: {activeSub.student?.lrn}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Assignment:</span>
                  <div className="font-semibold text-slate-800 text-xs">Problem Set 4: Roots</div>
                </div>
              </div>

              {/* Student File Submission Preview */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-6">
                <div className="text-xs font-semibold text-slate-600 mb-2">Student Attached Files:</div>
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <FileText className="h-4 w-4 text-rose-600" />
                    <span>Gabriel_DelaCruz_MathPS4.pdf (1.2 MB)</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Displaying student PDF solution sheet preview.');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View Submission</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Grading Form */}
              <form onSubmit={handleReturnGrade} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Score (Max: 100 points)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                      required
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm font-bold font-mono text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      SMS Sync Action
                    </label>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-600" />
                      <span>Auto-syncs score to SMS Gradebook</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Teacher Feedback & Rubric Notes
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  Return Work & Sync Grade
                </button>
              </form>
            </div>

            {/* Private Student-Teacher Dialogue Box (Strictly Private) */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Private Student-Teacher Comments
              </h4>
              <p className="text-[11px] text-slate-400 mb-3">
                Visible only to you and the student. Complying with Data Privacy Act minors&apos; scoping.
              </p>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {commentsHistory.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                    </div>
                    <p className="text-slate-700">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a private comment for this student..."
                  value={privateComment}
                  onChange={(e) => setPrivateComment(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
