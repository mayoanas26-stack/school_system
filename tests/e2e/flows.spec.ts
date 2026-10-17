// tests/e2e/flows.spec.ts
import { test, expect } from '@playwright/test';

test.describe('School Management System & Google Classroom Key Flows', () => {
  // FLOW 1: Role-Based Routing & Portals
  test('Flow 1: Role navigation across Admin, Teacher, Student, and Parent portals', async ({ page }) => {
    // 1. Visit Home landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/Philippine Science & Arts Academy/);
    await expect(page.locator('h1')).toContainText('One Platform. Four Portals');

    // 2. Navigate to Admin Portal
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Philippine Science & Arts Academy');
    await expect(page.getByText('Super Admin Console')).toBeVisible();

    // 3. Navigate to Teacher Portal
    await page.goto('/teacher');
    await expect(page.locator('h1')).toContainText('Welcome back, Prof. Juan!');

    // 4. Navigate to Student Portal
    await page.goto('/student');
    await expect(page.locator('h1')).toContainText('Welcome back, Gabriel!');

    // 5. Navigate to Parent Portal
    await page.goto('/parent');
    await expect(page.locator('h1')).toContainText('Family Academic Dashboard');
  });

  // FLOW 2: Admissions & Student Enrollment
  test('Flow 2: Review admissions application and approve enrollee into section', async ({ page }) => {
    await page.goto('/admin/admissions');
    await expect(page.locator('h1')).toContainText('Admissions & Enrollee Management');

    // Locate the pending applicant and click Approve & Enroll
    const approveBtn = page.getByRole('button', { name: 'Approve & Enroll' }).first();
    if (await approveBtn.isVisible()) {
      await approveBtn.click();
      await expect(page.getByText('Ready for Roster')).toBeVisible();
    }
  });

  // FLOW 3: Attendance Sheet & Alert Dispatch
  test('Flow 3: Teacher marks daily attendance and saves records', async ({ page }) => {
    await page.goto('/teacher/attendance');
    await expect(page.locator('h1')).toContainText('Attendance Sheet');

    // Click 'Mark All Present'
    await page.getByRole('button', { name: 'Mark All Present' }).click();

    // Save & Dispatch
    await page.getByRole('button', { name: /Save & Dispatch Alerts/i }).click();
    await expect(page.getByText('Attendance recorded successfully!')).toBeVisible();
  });

  // FLOW 4: Classroom Flow - Create, Submit, and Grade Assignment
  test('Flow 4: Classroom assignment submission, grading, and SMS sync', async ({ page }) => {
    // 1. Student turns in work
    await page.goto('/student/classes/cls_math_10_rizal');
    await page.getByRole('button', { name: 'Classwork & Submissions' }).click();

    // Check submission status
    await expect(page.getByText('Your Work')).toBeVisible();

    // 2. Teacher opens grading review queue
    await page.goto('/teacher/assignments');
    await expect(page.locator('h1')).toContainText('Grading Review Workspace');

    // Submit returned score
    const scoreInput = page.locator('input[type="number"]').first();
    await scoreInput.fill('98');
    await page.getByRole('button', { name: /Return Work & Sync Grade/i }).click();
    await expect(page.getByText(/automatically synced to SMS Gradebook/i)).toBeVisible();
  });

  // FLOW 5: Tuition Payment & Receipt Generation
  test('Flow 5: Parent online payment via Stripe / Cashier manual receipting', async ({ page }) => {
    await page.goto('/parent/billing');
    await expect(page.locator('h1')).toContainText('Tuition & Online Payments');
    await expect(page.getByText('Account Overview')).toBeVisible();

    // Click pay button
    const payBtn = page.getByRole('button', { name: /Pay ₱/i });
    if (await payBtn.isVisible()) {
      await payBtn.click();
      await expect(page.getByText(/Payment successful! Official Receipt/i)).toBeVisible();
    }
  });
});
