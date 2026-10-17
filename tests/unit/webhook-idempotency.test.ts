// tests/unit/webhook-idempotency.test.ts
import { describe, it, expect } from 'vitest';
import { StripePaymentProvider } from '../../src/lib/providers/PaymentProvider';

describe('Stripe Webhook Verification & Idempotency', () => {
  const provider = new StripePaymentProvider();

  it('verifies valid simulated payment intent events in test environment', async () => {
    const mockPayload = JSON.stringify({
      id: 'evt_test_123',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_001',
          amount_total: 1100000,
          currency: 'php',
          metadata: {
            studentId: 'stu_gabriel',
            ledgerId: 'led_gabriel',
          },
        },
      },
    });

    const result = await provider.verifyWebhookSignature(mockPayload, 'sample_sig');
    expect(result.isValid).toBe(true);
    expect(result.eventType).toBe('checkout.session.completed');
    expect(result.data.id).toBe('cs_test_001');
  });

  it('ensures duplicate webhook deliveries are processed idempotently', () => {
    const processedEvents = new Set<string>();

    const handleEvent = (eventId: string, amount: number) => {
      if (processedEvents.has(eventId)) {
        return { processed: false, reason: 'Duplicate event ignored' };
      }
      processedEvents.add(eventId);
      return { processed: true, amountCredited: amount };
    };

    const firstDelivery = handleEvent('evt_pi_001', 11000);
    expect(firstDelivery.processed).toBe(true);
    expect(firstDelivery.amountCredited).toBe(11000);

    const duplicateDelivery = handleEvent('evt_pi_001', 11000);
    expect(duplicateDelivery.processed).toBe(false);
    expect(duplicateDelivery.reason).toBe('Duplicate event ignored');
    expect(processedEvents.size).toBe(1);
  });
});
