// src/app/(teacher)/timetable/page.tsx
'use client';

import React from 'react';
import { Clock, Video, MapPin, Users } from 'lucide-react';

export default function TeacherTimetablePage() {
  const scheduleDays = [
    {
      day: 'Monday / Wednesday / Friday',
      slots: [
        {
          time: '08:00 AM - 09:30 AM',
          subject: 'Mathematics 10',
          section: '10 - Rizal',
          room: 'Room 201 (Rizal Hall)',
          meetUrl: 'https://meet.google.com/new',
        },
        {
          time: '10:00 AM - 11:30 AM',
          subject: 'Faculty Department Consultation',
          section: 'Math Faculty',
          room: 'Faculty Conference Room A',
          meetUrl: '',
        },
      ],
    },
    {
      day: 'Tuesday / Thursday',
      slots: [
        {
          time: '10:00 AM - 12:00 PM',
          subject: 'Science 10 Laboratory',
          section: '10 - Rizal',
          room: 'Science Lab 1',
          meetUrl: 'https://meet.google.com/new',
        },
        {
          time: '01:30 PM - 03:00 PM',
          subject: 'Homeroom Advisory & Guidance',
          section: '10 - Rizal',
          room: 'Room 201',
          meetUrl: '',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Personal Faculty Timetable</h1>
          <p className="text-sm text-slate-500">
            Teaching load, room allocations, conflict-free scheduling, and 1-click video lesson launch.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {scheduleDays.map((d, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{d.day}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {d.slots.map((slot, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-blue-700">{slot.time}</div>
                    <div className="text-base font-bold text-slate-900 mt-1">{slot.subject}</div>
                    <div className="text-xs text-slate-600 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span>Section: {slot.section}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  </div>

                  {slot.meetUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                      <a
                        href={slot.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition shadow-xs"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Start Video Lesson</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
