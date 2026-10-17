// src/app/api/export/analytics/route.ts
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { SchoolService } from '@/lib/services/schoolService';

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Philippine Science & Arts Academy SMS';
  workbook.created = new Date();

  // Sheet 1: Students & Academic Records
  const studentsSheet = workbook.addWorksheet('Enrolled Students');
  studentsSheet.columns = [
    { header: 'LRN', key: 'lrn', width: 18 },
    { header: 'Student Name', key: 'name', width: 25 },
    { header: 'Grade & Section', key: 'section', width: 20 },
    { header: 'Q1 Grade', key: 'q1', width: 12 },
    { header: 'Q2 Grade', key: 'q2', width: 12 },
    { header: 'General Average', key: 'gpa', width: 16 },
    { header: 'Academic Standing', key: 'standing', width: 24 },
  ];

  studentsSheet.addRow({
    lrn: '109283746512',
    name: 'Gabriel Dela Cruz',
    section: 'Grade 10 - Rizal',
    q1: 94.0,
    q2: 96.0,
    gpa: 95.0,
    standing: 'With High Honors',
  });

  studentsSheet.addRow({
    lrn: '109283746513',
    name: 'Sofia Dela Cruz',
    section: 'Grade 7 - Diamond',
    q1: 91.0,
    q2: 92.5,
    gpa: 91.75,
    standing: 'With Honors',
  });

  // Sheet 2: Financial Collections & Ledgers
  const financeSheet = workbook.addWorksheet('Tuition Collections');
  financeSheet.columns = [
    { header: 'Receipt No.', key: 'receipt', width: 18 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Student', key: 'student', width: 22 },
    { header: 'Payment Method', key: 'method', width: 20 },
    { header: 'Amount (PHP)', key: 'amount', width: 16 },
    { header: 'Transaction Ref', key: 'ref', width: 25 },
  ];

  const payments = SchoolService.getPayments();
  payments.forEach((p) => {
    financeSheet.addRow({
      receipt: p.receipt_number,
      date: new Date(p.created_at).toLocaleDateString('en-PH'),
      student: 'Gabriel Dela Cruz',
      method: p.payment_method.toUpperCase(),
      amount: p.amount,
      ref: p.transaction_reference,
    });
  });

  // Style header rows
  [studentsSheet, financeSheet].forEach((sheet) => {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0F172A' },
    };
  });

  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="PSAA_School_Analytics_2026.xlsx"',
    },
  });
}
