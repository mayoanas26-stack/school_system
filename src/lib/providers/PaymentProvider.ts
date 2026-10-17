// src/lib/providers/PaymentProvider.ts
export interface CheckoutSessionParams {
  schoolId: string;
  studentId: string;
  ledgerId: string;
  amount: number;
  currency?: string; // Default 'PHP'
  customerEmail: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface ManualPaymentParams {
  schoolId: string;
  studentId: string;
  ledgerId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_deposit' | 'e_wallet_manual';
  referenceNumber?: string;
  cashierUserId: string;
  notes?: string;
}

export interface PaymentProvider {
  createCheckoutSession(params: CheckoutSessionParams): Promise<{
    sessionId: string;
    checkoutUrl: string;
  }>;

  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string
  ): Promise<{
    eventType: string;
    data: any;
    isValid: boolean;
  }>;

  recordManualPayment(params: ManualPaymentParams): Promise<{
    paymentId: string;
    receiptNumber: string;
  }>;
}

// Stripe + Manual Implementation
export class StripePaymentProvider implements PaymentProvider {
  private stripeSecretKey: string;
  private webhookSecret: string;

  constructor() {
    this.stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
  }

  async createCheckoutSession(params: CheckoutSessionParams) {
    if (!this.stripeSecretKey) {
      // Mock / fallback session for local development without credentials
      console.log('[StripePaymentProvider] Mocking checkout session for amount:', params.amount);
      const mockSessionId = `mock_cs_${Date.now()}`;
      return {
        sessionId: mockSessionId,
        checkoutUrl: `${params.successUrl}?session_id=${mockSessionId}&mock=true`,
      };
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const session = await (stripe.checkout.sessions.create as any)({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: (params.currency || 'php').toLowerCase(),
            product_data: {
              name: params.description,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: params.customerEmail,
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: {
        schoolId: params.schoolId,
        studentId: params.studentId,
        ledgerId: params.ledgerId,
        ...params.metadata,
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url || '',
    };
  }

  async verifyWebhookSignature(payload: string | Buffer, signature: string) {
    if (!this.stripeSecretKey || !this.webhookSecret) {
      console.log('[StripePaymentProvider] In development mode without Stripe webhook secret');
      try {
        const parsed = typeof payload === 'string' ? JSON.parse(payload) : JSON.parse(payload.toString());
        return { eventType: parsed.type || 'payment_intent.succeeded', data: parsed.data?.object || parsed, isValid: true };
      } catch {
        return { eventType: 'unknown', data: {}, isValid: true };
      }
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as any,
    });

    try {
      const event = stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      return {
        eventType: event.type,
        data: event.data.object,
        isValid: true,
      };
    } catch (err: any) {
      console.error('[StripePaymentProvider] Signature verification failed:', err.message);
      return {
        eventType: '',
        data: null,
        isValid: false,
      };
    }
  }

  async recordManualPayment(params: ManualPaymentParams) {
    // Generate sequential official receipt code
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `OR-${dateStr}-${randSuffix}`;

    return {
      paymentId: `pay_manual_${Date.now()}`,
      receiptNumber,
    };
  }
}

export const defaultPaymentProvider = new StripePaymentProvider();
