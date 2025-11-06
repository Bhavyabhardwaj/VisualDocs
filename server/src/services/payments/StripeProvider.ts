/**
 * Stripe Payment Provider Implementation
 */

import Stripe from 'stripe';
import {
  PaymentProvider,
  CheckoutSessionData,
  CheckoutSessionResult,
  WebhookEvent,
  SubscriptionData,
} from './PaymentProvider';

export class StripeProvider extends PaymentProvider {
  name = 'stripe';
  private stripe: Stripe;

  constructor(secretKey: string) {
    super();
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(
    data: CheckoutSessionData
  ): Promise<CheckoutSessionResult> {
    const priceIds = this.getPriceIds();
    const priceId = priceIds[data.planId]?.[data.billingPeriod];

    if (!priceId) {
      throw new Error(`Invalid plan: ${data.planId}`);
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      client_reference_id: data.userId,
      customer_email: data.userEmail,
      metadata: {
        userId: data.userId,
        planId: data.planId,
        billingPeriod: data.billingPeriod,
      },
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url || '',
    };
  }

  async verifyWebhook(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Promise<WebhookEvent> {
    const event = this.stripe.webhooks.constructEvent(payload, signature, secret);
    return {
      type: event.type,
      data: event.data.object,
      raw: event,
    };
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionData> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);

    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: this.mapStatus(subscription.status),
      planId: subscription.metadata.planId || '',
      billingPeriod: (subscription.items.data[0].price.recurring?.interval === 'year'
        ? 'annually'
        : 'monthly') as 'monthly' | 'annually',
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };
  }

  async cancelSubscription(
    subscriptionId: string,
    immediately = false
  ): Promise<void> {
    if (immediately) {
      await this.stripe.subscriptions.cancel(subscriptionId);
    } else {
      await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    }
  }

  async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return session.url;
  }

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ refundId: string; status: string }> {
    const refund = await this.stripe.refunds.create({
      payment_intent: paymentId,
      amount,
    });
    return {
      refundId: refund.id,
      status: refund.status,
    };
  }

  private getPriceIds() {
    return {
      professional: {
        monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || '',
        annually: process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID || '',
      },
      enterprise: {
        monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || '',
        annually: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || '',
      },
    };
  }

  private mapStatus(
    stripeStatus: Stripe.Subscription.Status
  ): 'active' | 'canceled' | 'past_due' | 'incomplete' {
    const statusMap: Record<string, 'active' | 'canceled' | 'past_due' | 'incomplete'> = {
      active: 'active',
      canceled: 'canceled',
      past_due: 'past_due',
      incomplete: 'incomplete',
      incomplete_expired: 'incomplete',
      trialing: 'active',
      unpaid: 'past_due',
    };
    return statusMap[stripeStatus] || 'incomplete';
  }
}
