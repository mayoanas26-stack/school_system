// src/app/(student)/classes/[id]/page.tsx
'use client';

import React, { useState, use } from 'react';
import {
  BookOpen,
  Calendar,
  Video,
  FileText,
  UploadCloud,
  CheckCircle,
  MessageSquare,
  Send,
  Award,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { SchoolService } from '@/lib/services/schoolService';

export default function StudentClassDetailPage() {
  const routeParams = useParams();
  const classId = (routeParams?.id as string) || 'cls_math_10_rizal';
  const cls = SchoolService.getClassById(classId) || SchoolService.getClasses()[0];
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork'>('stream');

  const streamPosts = SchoolService.getStreamPosts(cls.id);
  const assignments = SchoolService.getAssignments(cls.id);
  const existingSub = SchoolService.getSubmissionForStudent('asg_1', 'stu_gabriel');

  // Student Turn-in State
  const [submissionStatus, setSubmissionStatus] = useState<string>(
    existingSub?.status || 'assigned'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    existingSub?.attachments?.[0]?.file_name || null
  );
  const [privateComment, setPrivateComment] = useState('');
  const [commentsHistory, setCommentsHistory] = useState([
    { id: 'c1', author: 'Gabriel Dela Cruz', text: 'Sir, I attached the handwritten solutions for items 6-10 in page 2.', time: 'Oct 16, 2:25 PM' },
    { id: 'c2', author: 'Prof. Juan Dela Cruz', text: 'Received Gabriel, reviewing your steps now.', time: 'Oct 16, 4:10 PM' },
  ]);

  const handleTurnIn = () => {
    const filename = uploadedFileName || 'Gabriel_DelaCruz_MathPS4.pdf';
    setUploadedFileName(filename);
    SchoolService.submitWork({
      assignmentId: 'asg_1',
      studentId: 'stu_gabriel',
      fileName: filename,
    });
    setSubmissionStatus('turned_in');
  };

  const handleUnsubmit = () => {
    setSubmissionStatus('assigned');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateComment.trim()) return;

    setCommentsHistory([
      ...commentsHistory,
      {
        id: `c_${Date.now()}`,
        author: 'Gabriel Dela Cruz',
        text: privateComment,
        time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setPrivateComment('');
  };

  return (
    <div className="space-y-6">
      {/* Course Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
              Code: {cls.class_code}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {cls.name}
            </h1>
            <p className="mt-1 text-sm text-blue-100 font-medium">
              Prof. Juan Dela Cruz • {cls.room} • {cls.schedule_text}
            </p>
          </div>

          <div>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-blue-50 transition shadow-sm"
            >
              <Video className="h-4 w-4 text-emerald-600" />
              <span>Join Live Lesson</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('stream')}
          className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition ${
            activeTab === 'stream'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Stream & Announcements
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('classwork')}
          className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition ${
            activeTab === 'classwork'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Classwork & Submissions
        </button>
      </div>

      {activeTab === 'stream' && (
        <div className="space-y-4">
          {streamPosts.map((post) => (
            <div key={post.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  JD
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Prof. Juan Dela Cruz</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(post.created_at).toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}
                  </div>
                </div>
              </div>

              {post.title && <h3 className="text-base font-bold text-slate-900 mt-4">{post.title}</h3>}
              <p className="text-xs text-slate-700 leading-relaxed mt-2 whitespace-pre-line">
                {post.content}
              </p>

              {post.attachments && post.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {post.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>{att.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'classwork' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignments Column */}
          <div className="lg:col-span-2 space-y-4">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{asg.title}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono text-slate-600">
                      {asg.points} pts
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-rose-600">
                    Due {asg.due_date ? new Date(asg.due_date).toLocaleDateString('en-PH') : 'Soon'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{asg.description}</p>
              </div>
            ))}
          </div>

          {/* Student Turn-In Card (Core Classroom Feature) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Your Work</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                    submissionStatus === 'graded'
                      ? 'bg-emerald-100 text-emerald-800'
                      : submissionStatus === 'turned_in'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {submissionStatus}
                </span>
              </div>

              {uploadedFileName && (
                <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate text-slate-800 font-medium">
                    <FileText className="h-4 w-4 text-rose-600 shrink-0" />
                    <span className="truncate">{uploadedFileName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">PDF</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {submissionStatus === 'assigned' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setUploadedFileName('Gabriel_DelaCruz_MathPS4.pdf')}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UploadCloud className="h-4 w-4 text-blue-600" />
                      <span>+ Add or Upload Document</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleTurnIn}
                      className="w-full rounded-lg bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                    >
                      Turn In Assignment
                    </button>
                  </>
                )}

                {submissionStatus === 'turned_in' && (
                  <button
                    type="button"
                    onClick={handleUnsubmit}
                    className="w-full rounded-lg border border-slate-300 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Unsubmit Work
                  </button>
                )}

                {submissionStatus === 'graded' && (
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center justify-between">
                      <span>Score Awarded:</span>
                      <span className="text-sm font-mono font-bold text-emerald-700">
                        {existingSub?.score || 95} / 100
                      </span>
                    </div>
                    <p className="text-slate-600 italic">
                      &quot;{existingSub?.feedback || 'Great work on synthetic division!'}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Private Comments Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Private Comments
              </h4>
              <div className="space-y-2.5 mb-3 max-h-36 overflow-y-auto">
                {commentsHistory.map((c) => (
                  <div key={c.id} className="rounded-lg bg-slate-50 p-2.5 text-xs">
                    <div className="flex justify-between font-bold text-slate-800 text-[11px] mb-0.5">
                      <span>{c.author}</span>
                      <span className="text-slate-400 font-normal">{c.time}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{c.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Private comment to teacher..."
                  value={privateComment}
                  onChange={(e) => setPrivateComment(e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1 text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
