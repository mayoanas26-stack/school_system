// src/app/(teacher)/classes/[id]/page.tsx
'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  MessageSquare,
  ClipboardList,
  Users,
  Video,
  Send,
  Plus,
  Paperclip,
  CheckCircle,
  FileText,
  Calendar,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { SchoolService } from '@/lib/services/schoolService';

export default function TeacherClassDetailPage() {
  const routeParams = useParams();
  const classId = (routeParams?.id as string) || 'cls_math_10_rizal';
  const cls = SchoolService.getClassById(classId) || SchoolService.getClasses()[0];
  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people'>('stream');

  // Stream state
  const streamPosts = SchoolService.getStreamPosts(cls.id);
  const [posts, setPosts] = useState(streamPosts);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');

  // Classwork state
  const assignments = SchoolService.getAssignments(cls.id);
  const [asgList, setAsgList] = useState(assignments);
  const [showCreateAsg, setShowCreateAsg] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgPoints, setNewAsgPoints] = useState('100');
  const [newAsgDue, setNewAsgDue] = useState('2026-10-25');

  const students = SchoolService.getStudents();

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    const newPost = SchoolService.createStreamPost({
      classId: cls.id,
      authorId: 'usr_teacher_1',
      title: announcementTitle || undefined,
      content: announcementText,
    });

    setPosts([newPost, ...posts]);
    setAnnouncementText('');
    setAnnouncementTitle('');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle.trim()) return;

    const created = SchoolService.createAssignment({
      classId: cls.id,
      title: newAsgTitle,
      description: newAsgDesc,
      points: parseInt(newAsgPoints) || 100,
      dueDate: newAsgDue,
    });

    setAsgList([created, ...asgList]);
    setShowCreateAsg(false);
    setNewAsgTitle('');
    setNewAsgDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Google Classroom Hero Header */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block rounded-md bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm">
              Class Code: {cls.class_code}
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {cls.name}
            </h1>
            <p className="mt-1 text-sm text-blue-100 font-medium">
              {cls.room} • {cls.schedule_text} • Roster Synced from SMS Section 10-Rizal
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
              <span>Launch Google Meet Lesson</span>
            </a>
          </div>
        </div>
      </div>

      {/* Classroom Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        {(['stream', 'classwork', 'people'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* STREAM TAB */}
      {activeTab === 'stream' && (
        <div className="space-y-6">
          {/* Post Composer */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Announce something to your class
            </h3>
            <form onSubmit={handlePostAnnouncement} className="space-y-3">
              <input
                type="text"
                placeholder="Announcement Title (Optional)"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-900"
              />
              <textarea
                placeholder="Share instructions, attach links, or remind students of upcoming deadlines..."
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  <span>Attach Google Drive or File</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  <span>Post to Stream</span>
                </button>
              </div>
            </form>
          </div>

          {/* Stream Feed */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
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
                  {post.is_pinned && (
                    <span className="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                      Pinned Notice
                    </span>
                  )}
                </div>

                {post.title && (
                  <h4 className="text-base font-bold text-slate-900 mt-4">{post.title}</h4>
                )}
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
        </div>
      )}

      {/* CLASSWORK TAB */}
      {activeTab === 'classwork' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Quarter 2 Assignments & Materials</h2>
            <button
              type="button"
              onClick={() => setShowCreateAsg(!showCreateAsg)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Create Assignment</span>
            </button>
          </div>

          {showCreateAsg && (
            <form onSubmit={handleCreateAssignment} className="rounded-xl border border-blue-200 bg-blue-50/40 p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">New Assignment Details</h3>
              <input
                type="text"
                placeholder="Assignment Title (e.g. Problem Set 5: Circle Theorems)"
                value={newAsgTitle}
                onChange={(e) => setNewAsgTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold bg-white"
              />
              <textarea
                placeholder="Instructions, rubrics, and submission format expectations..."
                rows={3}
                value={newAsgDesc}
                onChange={(e) => setNewAsgDesc(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    value={newAsgPoints}
                    onChange={(e) => setNewAsgPoints(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newAsgDue}
                    onChange={(e) => setNewAsgDue(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAsg(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                  Publish to Students
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {asgList.map((asg) => (
              <div
                key={asg.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{asg.title}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600 font-semibold">
                      {asg.points} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{asg.description}</p>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>Due: {asg.due_date ? new Date(asg.due_date).toLocaleDateString('en-PH') : 'No due date'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/teacher/assignments"
                    className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Open Grading Queue (1 Submitted)
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PEOPLE TAB */}
      {activeTab === 'people' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4">Faculty & Teachers</h3>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                JD
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Prof. Juan Dela Cruz</div>
                <div className="text-xs text-slate-500">Primary Teacher • Department of Mathematics</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4 flex items-center justify-between">
              <span>Enrolled Students ({students.length})</span>
              <span className="text-xs text-emerald-600 font-medium">Automatic SMS Roster Sync</span>
            </h3>
            <div className="divide-y divide-slate-100">
              {students.map((stu) => (
                <div key={stu.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                      {stu.user?.first_name[0]}{stu.user?.last_name[0]}
                    </div>
                    <span className="font-semibold text-slate-800">
                      {stu.user?.first_name} {stu.user?.last_name}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">LRN: {stu.lrn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
