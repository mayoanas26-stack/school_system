// src/app/(admin)/academics/page.tsx
'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, GraduationCap, School, MapPin } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';
import { Section, Subject } from '@/lib/types/database';

export default function AdminAcademicsPage() {
  const sections = SchoolService.getSections();
  const subjects = SchoolService.getSubjects();
  const [activeTab, setActiveTab] = useState<'sections' | 'subjects'>('sections');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Hierarchy & School Setup</h1>
          <p className="text-sm text-slate-500">
            Manage academic years, sections, rooms, subject catalogs, and curriculum offerings.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add {activeTab === 'sections' ? 'Section' : 'Subject'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'sections'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sections & Homeroom Advisers ({sections.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'subjects'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Curriculum Subjects ({subjects.length})
        </button>
      </div>

      {activeTab === 'sections' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((sec) => (
            <div key={sec.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">
                  {sec.grade_level?.name}
                </span>
                <span className="text-xs text-slate-400 font-mono">Cap: {sec.capacity}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-3">{sec.name}</h3>
              <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{sec.room?.name} ({sec.room?.building})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  <span>Adviser: Prof. Juan Dela Cruz</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Subject Code</th>
                <th className="px-4 py-3">Subject Name</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{sub.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                  <td className="px-4 py-3 text-slate-600">{sub.units} Unit</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{sub.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
