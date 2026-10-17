// src/components/navigation/MobileNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Award,
  CreditCard,
  ClipboardList,
} from 'lucide-react';

interface MobileNavProps {
  role: 'admin' | 'teacher' | 'student' | 'parent';
}

export function MobileNav({ role }: MobileNavProps) {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';

  const mobileItems: Record<
    string,
    Array<{ label: string; href: string; icon: React.ElementType }>
  > = {
    admin: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Admissions', href: '/admin/admissions', icon: ClipboardList },
      { label: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { label: 'Gradebook', href: '/admin/grading', icon: Award },
      { label: 'Finance', href: '/admin/finance', icon: CreditCard },
    ],
    teacher: [
      { label: 'Console', href: '/teacher', icon: LayoutDashboard },
      { label: 'Classes', href: '/teacher/classes', icon: BookOpen },
      { label: 'Attendance', href: '/teacher/attendance', icon: CalendarCheck },
      { label: 'Gradebook', href: '/teacher/gradebook', icon: Award },
      { label: 'Grading', href: '/teacher/assignments', icon: ClipboardList },
    ],
    student: [
      { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'Classes', href: '/student/classes', icon: BookOpen },
      { label: 'To-Do', href: '/student/todo', icon: ClipboardList },
      { label: 'Grades', href: '/student/grades', icon: Award },
      { label: 'Fees', href: '/student/fees', icon: CreditCard },
    ],
    parent: [
      { label: 'Family', href: '/parent', icon: LayoutDashboard },
      { label: 'Grades', href: '/parent/grades', icon: Award },
      { label: 'Attendance', href: '/parent/attendance', icon: CalendarCheck },
      { label: 'Billing', href: '/parent/billing', icon: CreditCard },
      { label: 'Summary', href: '/parent/summaries', icon: ClipboardList },
    ],
  };

  const items = mobileItems[role] || mobileItems.admin;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md justify-around items-center">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
