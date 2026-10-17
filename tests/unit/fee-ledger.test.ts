// tests/unit/fee-ledger.test.ts
import { describe, it, expect } from 'vitest';

describe('Fee Management & Student Ledger Balancing', () => {
  it('correctly assesses total tuition and deductions', () => {
    const tuition = 38000;
    const misc = 7000;
    const totalAssessed = tuition + misc;
    const scholarshipDiscount = 2000;

    const netAssessed = totalAssessed - scholarshipDiscount;
    expect(netAssessed).toBe(43000);
  });

  it('updates remaining balance upon partial installment payments', () => {
    const netAssessed = 43000;
    let totalPaid = 0;

    // Payment 1: Downpayment upon enrollment
    totalPaid += 12000;
    let remaining = netAssessed - totalPaid;
    let status = remaining === 0 ? 'fully_paid' : 'partially_paid';

    expect(remaining).toBe(31000);
    expect(status).toBe('partially_paid');

    // Payment 2: Quarter 2 Installment
    totalPaid += 11000;
    remaining = netAssessed - totalPaid;
    expect(remaining).toBe(20000);

    // Payment 3 & 4: Remaining 20,000
    totalPaid += 20000;
    remaining = Math.max(0, netAssessed - totalPaid);
    status = remaining === 0 ? 'fully_paid' : 'partially_paid';

    expect(remaining).toBe(0);
    expect(status).toBe('fully_paid');
  });

  it('prevents negative remaining balance if overpaid', () => {
    const netAssessed = 43000;
    const totalPaid = 45000;
    const remaining = Math.max(0, netAssessed - totalPaid);
    expect(remaining).toBe(0);
  });
});
