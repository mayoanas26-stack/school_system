// src/app/(admin)/admissions/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Search, Clock, FileText } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminAdmissionsPage() {
  const sections = SchoolService.getSections();
  const [applications, setApplications] = useState([
    {
      id: 'app_001',
      appNo: 'ADM-2026-0041',
      applicantName: 'Ezekiel Bautista',
      gradeLevel: 'Grade 10',
      guardianName: 'Miriam Bautista',
      email: 'miriam.b@example.com',
      phone: '+63 917 234 5678',
      previousSchool: 'St. Jude Catholic School',
      status: 'under_review',
      assignedSection: '',
      submittedDate: '2026-10-15',
    },
    {
      id: 'app_002',
      appNo: 'ADM-2026-0042',
      applicantName: 'Hannah Nicole Garcia',
      gradeLevel: 'Grade 10',
      guardianName: 'Eduardo Garcia',
      email: 'ed.garcia@example.com',
      phone: '+63 918 345 6789',
      previousSchool: 'Ateneo Junior High School',
      status: 'approved',
      assignedSection: '10 - Rizal',
      submittedDate: '2026-10-14',
    },
    {
      id: 'app_003',
      appNo: 'ADM-2026-0043',
      applicantName: 'Joshua Miguel Santos',
      gradeLevel: 'Grade 7',
      guardianName: 'Grace Santos',
      email: 'grace.s@example.com',
      phone: '+63 920 456 7890',
      previousSchool: 'Claret School of QC',
      status: 'submitted',
      assignedSection: '',
      submittedDate: '2026-10-16',
    },
  ]);

  const handleApprove = (id: string, sectionName: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: 'approved', assignedSection: sectionName || '10 - Rizal' }
          : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'rejected' } : app))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admissions & Enrollee Management</h1>
          <p className="text-sm text-slate-500">
            Registrar console: review student applications, verify credentials, approve enrollees, and allocate sections.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Incoming Applications ({applications.length})</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">App No.</th>
                <th className="px-4 py-3">Applicant Name</th>
                <th className="px-4 py-3">Grade Level</th>
                <th className="px-4 py-3">Guardian Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Section</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">{app.appNo}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {app.applicantName}
                    <div className="text-xs text-slate-400 font-normal">Prev: {app.previousSchool}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{app.gradeLevel}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    <div>{app.guardianName}</div>
                    <div className="font-mono text-slate-400">{app.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        app.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status === 'approved' && <CheckCircle className="h-3 w-3" />}
                      {app.status === 'rejected' && <XCircle className="h-3 w-3" />}
                      {app.status === 'under_review' && <Clock className="h-3 w-3" />}
                      <span className="capitalize">{app.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {app.assignedSection || <span className="text-slate-400 italic">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {app.status !== 'approved' && app.status !== 'rejected' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(app.id, '10 - Rizal')}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                        >
                          Approve & Enroll
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(app.id)}
                          className="rounded-md border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {app.status === 'approved' && (
                      <span className="text-xs text-emerald-600 font-medium">Ready for Roster</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
