// src/app/api/pdf/report-card/route.ts
import { NextResponse } from 'next/server';
import { SchoolService } from '@/lib/services/schoolService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('student_id') || 'stu_gabriel';
  const student = SchoolService.getStudentById(studentId);
  const school = SchoolService.getSchoolInfo();

  const subjects = [
    { code: 'MATH-10', name: 'Mathematics 10', q1: 94, q2: 96, final: 95, remarks: 'Passed - With High Honors' },
    { code: 'SCI-10', name: 'Science 10', q1: 91, q2: 93, final: 92, remarks: 'Passed' },
    { code: 'ENG-10', name: 'English 10', q1: 95, q2: 95, final: 95, remarks: 'Passed - With High Honors' },
    { code: 'FIL-10', name: 'Filipino 10', q1: 93, q2: 92, final: 93, remarks: 'Passed' },
  ];

  const gpa = (95 + 92 + 95 + 93) / 4;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Official Report Card (Form 138) - ${student?.user?.first_name} ${student?.user?.last_name}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; }
        .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 25px; }
        .school-name { font-size: 20px; font-weight: 800; text-transform: uppercase; }
        .school-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
        .card-title { font-size: 16px; font-weight: 700; margin-top: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .student-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 25px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px 12px; text-align: left; }
        th { background: #f1f5f9; font-weight: 700; font-size: 11px; text-transform: uppercase; }
        .center { text-align: center; }
        .font-mono { font-family: monospace; }
        .bold { font-weight: 700; }
        .footer { margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; text-align: center; }
        .signature-line { border-top: 1px solid #0f172a; width: 200px; margin-top: 50px; padding-top: 5px; }
        .print-btn { background: #0f172a; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
        @media print { .print-btn { display: none; } }
      </style>
    </head>
    <body>
      <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

      <div class="header">
        <div class="school-name">${school.name}</div>
        <div class="school-sub">${school.address} • Contact: ${school.contact_email}</div>
        <div class="card-title">Learner Progress Report Card (DepEd Form 138-A)</div>
        <div style="font-size: 12px; margin-top: 4px; font-weight: 600;">School Year: 2025-2026</div>
      </div>

      <div class="student-info">
        <div><strong>Student Name:</strong> ${student?.user?.first_name} ${student?.user?.last_name}</div>
        <div><strong>Learner Reference No. (LRN):</strong> ${student?.lrn}</div>
        <div><strong>Grade & Section:</strong> Grade 10 - Rizal</div>
        <div><strong>Homeroom Adviser:</strong> Prof. Juan Dela Cruz</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Learning Area / Subject</th>
            <th class="center">Q1</th>
            <th class="center">Q2</th>
            <th class="center">Final Rating</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${subjects.map(s => `
            <tr>
              <td><strong>${s.name}</strong> <span style="font-size: 11px; color: #64748b;">(${s.code})</span></td>
              <td class="center font-mono">${s.q1}</td>
              <td class="center font-mono">${s.q2}</td>
              <td class="center font-mono bold">${s.final}</td>
              <td style="color: #059669; font-weight: 600;">${s.remarks}</td>
            </tr>
          `).join('')}
          <tr style="background: #f8fafc; font-weight: bold;">
            <td>GENERAL AVERAGE</td>
            <td class="center font-mono">93.25</td>
            <td class="center font-mono">94.00</td>
            <td class="center font-mono bold" style="color: #059669; font-size: 15px;">${gpa.toFixed(2)}</td>
            <td style="color: #b45309;">PASSED (WITH HIGH HONORS)</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 20px; font-size: 12px; line-height: 1.6; background: #fffbeb; border: 1px solid #fef3c7; padding: 12px; border-radius: 6px;">
        <strong>Grading Scale Description:</strong> Outstanding (90-100), Very Satisfactory (85-89), Satisfactory (80-84), Fairly Satisfactory (75-79), Did Not Meet Expectations (Below 75).
      </div>

      <div class="footer">
        <div>
          <div class="signature-line">Prof. Juan Dela Cruz</div>
          <div>Class Adviser</div>
        </div>
        <div>
          <div class="signature-line">Dr. Fernando Dizon</div>
          <div>School Principal</div>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
