import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Philippine Science & Arts Academy | Unified SMS & Google Classroom Platform",
  description: "Unified School Management System and Google Classroom Learning Platform with Admin, Teacher, Student, and Parent portals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
