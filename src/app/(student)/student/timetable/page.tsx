// src/app/(student)/timetable/page.tsx
'use client';

import React from 'react';
import { Clock, Video, MapPin, User } from 'lucide-react';

export default function StudentTimetablePage() {
  const scheduleDays = [
    {
      day: 'Monday / Wednesday / Friday',
      slots: [
        {
          time: '08:00 AM - 09:30 AM',
          subject: 'Mathematics 10',
          teacher: 'Prof. Juan Dela Cruz',
          room: 'Room 201 (Rizal Hall)',
          meetUrl: 'https://meet.google.com/new',
        },
        {
          time: '09:45 AM - 11:15 AM',
          subject: 'English 10: World Literature',
          teacher: 'Ms. Angela Reyes',
          room: 'Room 201',
          meetUrl: '',
        },
        {
          time: '01:00 PM - 02:30 PM',
          subject: 'Filipino 10: El Filibusterismo',
          teacher: 'G. Manuel Ramos',
          room: 'Room 201',
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
          teacher: 'Prof. Juan Dela Cruz',
          room: 'Science Lab 1 (Mabini Complex)',
          meetUrl: 'https://meet.google.com/new',
        },
        {
          time: '01:30 PM - 03:00 PM',
          subject: 'Araling Panlipunan 10',
          teacher: 'Gng. Teresa Luna',
          room: 'Room 201',
          meetUrl: '',
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Timetable</h1>
        <p className="text-sm text-slate-500">
          Grade 10 - Section Rizal • Weekly class schedule and 1-tap live meeting join links.
        </p>
      </div>

      <div className="space-y-6">
        {scheduleDays.map((d, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>{d.day}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {d.slots.map((slot, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-blue-700">{slot.time}</div>
                    <div className="text-base font-bold text-slate-900 mt-1">{slot.subject}</div>
                    <div className="text-xs text-slate-600 mt-2 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{slot.room}</span>
                      </div>
                    </div>
                  </div>

                  {slot.meetUrl && (
                    <div className="mt-4 pt-3 border-t border-slate-200">
                      <a
                        href={slot.meetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-xs"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Join Live Video Lesson</span>
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
