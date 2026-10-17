// tests/unit/grades.test.ts
import { describe, it, expect } from 'vitest';
import { computeTransmutedGrade } from '../../src/lib/services/schoolService';

describe('DepEd Grade Transmutation & Academic Calculations', () => {
  it('transmutes 100% to 100 rating', () => {
    expect(computeTransmutedGrade(100)).toBe(100);
  });

  it('transmutes 98.5% to 99 rating', () => {
    expect(computeTransmutedGrade(98.5)).toBe(99);
  });

  it('transmutes 90.5% to 94 rating (With Honors standing)', () => {
    expect(computeTransmutedGrade(90.5)).toBe(94);
  });

  it('transmutes 60.0% to 75 passing threshold', () => {
    expect(computeTransmutedGrade(60.0)).toBe(75);
  });

  it('handles scores below 60% with minimum floor rating', () => {
    const transmuted = computeTransmutedGrade(50.0);
    expect(transmuted).toBeLessThan(75);
    expect(transmuted).toBeGreaterThanOrEqual(60);
  });

  it('computes DepEd weighted component scores accurately (30% WW, 50% PT, 20% QA)', () => {
    const writtenWork = 90;
    const performanceTask = 95;
    const quarterlyAssessment = 92;

    const weightedScore = writtenWork * 0.3 + performanceTask * 0.5 + quarterlyAssessment * 0.2;
    expect(weightedScore).toBeCloseTo(92.9, 1);

    const finalTransmuted = computeTransmutedGrade(weightedScore);
    expect(finalTransmuted).toBe(95);
  });
});
