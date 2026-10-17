// src/app/(admin)/layout.tsx
import React, { Suspense } from 'react';
import { Header } from '@/components/navigation/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNav } from '@/components/navigation/MobileNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Suspense fallback={<div className="h-16 border-b bg-white" />}>
        <Header currentRole="admin" />
      </Suspense>
      <div className="flex flex-1">
        <Suspense fallback={<div className="w-64 border-r bg-white hidden lg:block" />}>
          <Sidebar role="admin" />
        </Suspense>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <Suspense fallback={null}>
        <MobileNav role="admin" />
      </Suspense>
    </div>
  );
}
