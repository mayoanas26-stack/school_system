// src/components/navigation/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Award,
  CreditCard,
  BookOpen,
  ClipboardList,
  ShieldAlert,
  Settings,
  Clock,
  FileCheck,
  HeartPulse,
  GraduationCap,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'teacher' | 'student' | 'parent';
}

export function Sidebar({ role }: SidebarProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  const navItemsByRole: Record<
    string,
    Array<{ label: string; href: string; icon: React.ElementType }>
  > = {
    admin: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'School Setup', href: '/admin/academics', icon: BookOpen },
      { label: 'Admissions & Enrollees', href: '/admin/admissions', icon: Users },
      { label: 'Attendance Records', href: '/admin/attendance', icon: CalendarCheck },
      { label: 'Gradebook & Lock', href: '/admin/grading', icon: Award },
      { label: 'Finance & Cashier', href: '/admin/finance', icon: CreditCard },
      { label: 'Classrooms Oversight', href: '/admin/classrooms', icon: ClipboardList },
      { label: 'Audit Trail Logs', href: '/admin/audit', icon: ShieldAlert },
      { label: 'System Settings', href: '/admin/settings', icon: Settings },
    ],
    teacher: [
      { label: 'Teaching Console', href: '/teacher', icon: LayoutDashboard },
      { label: 'My Classes & Stream', href: '/teacher/classes', icon: BookOpen },
      { label: 'Attendance Marking', href: '/teacher/attendance', icon: CalendarCheck },
      { label: 'SMS Gradebook', href: '/teacher/gradebook', icon: Award },
      { label: 'Grading Review Queue', href: '/teacher/assignments', icon: ClipboardList },
      { label: 'Class Schedule', href: '/teacher/timetable', icon: Clock },
    ],
    student: [
      { label: 'My Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'My Classes', href: '/student/classes', icon: BookOpen },
      { label: 'To-Do & Deadlines', href: '/student/todo', icon: ClipboardList },
      { label: 'Grades & Report Card', href: '/student/grades', icon: Award },
      { label: 'Statement of Account', href: '/student/fees', icon: CreditCard },
      { label: 'Timetable', href: '/student/timetable', icon: Clock },
    ],
    parent: [
      { label: 'Family Dashboard', href: '/parent', icon: LayoutDashboard },
      { label: 'Academic Progress', href: '/parent/grades', icon: Award },
      { label: 'Attendance History', href: '/parent/attendance', icon: CalendarCheck },
      { label: 'Tuition & Payments', href: '/parent/billing', icon: CreditCard },
      { label: 'Guardian Summaries', href: '/parent/summaries', icon: FileCheck },
    ],
  };

  const navList = navItemsByRole[role] || navItemsByRole.admin;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="space-y-6">
        <div>
          <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {role.toUpperCase()} PORTAL
          </div>
          <nav className="space-y-1">
            {navList.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 space-y-3">
        <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">S.Y. 2025-2026</div>
          <div className="text-emerald-700 font-medium">Quarter 2 Active</div>
        </div>

        <Link
          href="/"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Portal</span>
        </Link>
      </div>
    </aside>
  );
}
