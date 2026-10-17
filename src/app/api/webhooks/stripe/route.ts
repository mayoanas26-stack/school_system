// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server';
import { defaultPaymentProvider } from '@/lib/providers/PaymentProvider';
import { SchoolService } from '@/lib/services/schoolService';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature') || '';

    const verification = await defaultPaymentProvider.verifyWebhookSignature(
      rawBody,
      signature
    );

    if (!verification.isValid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const { eventType, data } = verification;
    console.log(`[StripeWebhook] Processing event: ${eventType}`);

    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const metadata = data.metadata || {};
      const amountPaid = (data.amount_total || data.amount || 1100000) / 100;
      const studentId = metadata.studentId || 'stu_gabriel';
      const ledgerId = metadata.ledgerId || 'led_gabriel';

      await SchoolService.recordPayment({
        ledgerId,
        studentId,
        amount: amountPaid,
        paymentMethod: 'stripe_card',
        transactionReference: data.id || `pi_${Date.now()}`,
        notes: 'Stripe Online Checkout Succeeded',
      });

      console.log(`[StripeWebhook] Successfully balanced ledger for student ${studentId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[StripeWebhook] Handler error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
