// src/components/navigation/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, GraduationCap, Shield, UserCheck, Calendar } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  currentRole: 'admin' | 'teacher' | 'student' | 'parent';
  onRoleSwitch?: (role: 'admin' | 'teacher' | 'student' | 'parent') => void;
}

export function Header({ currentRole, onRoleSwitch }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-PH', {
          timeZone: 'Asia/Manila',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const roleColors: Record<string, { bg: string; text: string; label: string }> = {
    admin: { bg: 'bg-purple-100 text-purple-800 border-purple-200', text: 'text-purple-700', label: 'Administrator' },
    teacher: { bg: 'bg-blue-100 text-blue-800 border-blue-200', text: 'text-blue-700', label: 'Faculty / Teacher' },
    student: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', text: 'text-emerald-700', label: 'Student' },
    parent: { bg: 'bg-amber-100 text-amber-800 border-amber-200', text: 'text-amber-700', label: 'Parent / Guardian' },
  };

  const activeRoleBadge = roleColors[currentRole] || roleColors.admin;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <GraduationCap className="h-5 w-5 text-blue-400" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-slate-900 leading-tight">PSAA Portal</h1>
            <p className="text-[11px] text-slate-500 font-medium">Philippine Science & Arts Academy</p>
          </div>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${activeRoleBadge.bg}`}>
          <Shield className="h-3 w-3" />
          <span>{activeRoleBadge.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Philippine Manila Time Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span>{currentTime || 'Loading PHT...'} (GMT+8)</span>
        </div>

        {/* Global Quick Role Switcher for instant pairing / testing */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
          {(['admin', 'teacher', 'student', 'parent'] as const).map((role) => (
            <Link
              key={role}
              href={`/${role}`}
              className={`rounded px-2 py-1 font-medium capitalize transition-all ${
                currentRole === role
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {role}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600" />
          </span>
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow-xs">
          {currentRole.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
