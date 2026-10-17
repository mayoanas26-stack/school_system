// src/app/(admin)/operations/page.tsx
'use client';

import React, { useState } from 'react';
import { BookMarked, Bus, Package, IdCard, QrCode, Search, CheckCircle } from 'lucide-react';
import { SchoolService } from '@/lib/services/schoolService';

export default function AdminOperationsPage() {
  const [activeTab, setActiveTab] = useState<'library' | 'transport' | 'inventory' | 'id_cards'>('library');

  const libraryBooks = [
    { id: 'b1', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1285741550', available: 8, total: 10 },
    { id: 'b2', title: 'University Physics with Modern Physics', author: 'Young & Freedman', isbn: '978-0133978049', available: 5, total: 6 },
    { id: 'b3', title: 'El Filibusterismo (DepEd Annotated Edition)', author: 'Dr. Jose Rizal', isbn: '978-9710864321', available: 25, total: 30 },
  ];

  const transportRoutes = [
    { route: 'Route A: Katipunan - Commonwealth - Fairview', bus: 'Bus 04 (Plate: NBD-1092)', driver: 'Kuya Danilo Cruz', pickupCount: 22 },
    { route: 'Route B: Marikina Heights - Marcos Highway - Katipunan', bus: 'Bus 07 (Plate: NBD-3491)', driver: 'Kuya Roberto Mendoza', pickupCount: 18 },
  ];

  const students = SchoolService.getStudents();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campus Operations & Logistics</h1>
          <p className="text-sm text-slate-500">
            Library catalogs, transport bus fleets, asset inventories, and printable official student ID cards.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'library'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Library Management
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('transport')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'transport'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Transport & Bus Routes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('id_cards')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'id_cards'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Printable Student IDs
        </button>
      </div>

      {/* LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-xs flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-blue-600" />
              <span>Library Book Catalog & Loans</span>
            </span>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Book Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">ISBN</th>
                <th className="px-4 py-3 text-center">Available Copies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {libraryBooks.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3 font-semibold text-slate-900">{b.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{b.author}</td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-400">{b.isbn}</td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700 font-mono">
                    {b.available} / {b.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TRANSPORT TAB */}
      {activeTab === 'transport' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transportRoutes.map((tr, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                <Bus className="h-4 w-4 text-blue-600" />
                <span>{tr.bus}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-2">{tr.route}</h2>
              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div>Driver: <span className="font-semibold text-slate-800">{tr.driver}</span></div>
                <div>Assigned Students: <span className="font-semibold text-emerald-700">{tr.pickupCount} riders</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRINTABLE ID CARDS */}
      {activeTab === 'id_cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border-2 border-slate-900 bg-white p-6 shadow-md max-w-sm flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider text-blue-800">
                    Philippine Science & Arts Academy
                  </div>
                  <div className="text-xs font-bold text-slate-900">Official Student ID</div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  {student.user?.first_name[0]}{student.user?.last_name[0]}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {student.user?.first_name} {student.user?.last_name}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  LRN: <strong>{student.lrn}</strong>
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  Grade 10 - Section Rizal • Blood Type: {student.blood_type || 'O+'}
                </div>
              </div>

              <div className="pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="h-10 w-10 text-slate-900" />
                  <div className="text-[9px] text-slate-400 font-mono leading-tight">
                    GATE RFID / QR <br /> VERIFIED S.Y. 2026
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Print ID
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
