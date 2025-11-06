/**
 * Dodo Payments Provider Implementation
 * For regions with lower fees and crypto support
 */

import axios from 'axios';
import {
  PaymentProvider,
  CheckoutSessionData,
  CheckoutSessionResult,
  WebhookEvent,
  SubscriptionData,
} from './PaymentProvider';

export class DodoProvider extends PaymentProvider {
  name = 'dodo';
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, isProduction = false) {
    super();
    this.apiKey = apiKey;
    this.apiUrl = isProduction
      ? 'https://api.dodo.dev/v1'
      : 'https://api.sandbox.dodo.dev/v1';
  }

  async createCheckoutSession(
    data: CheckoutSessionData
  ): Promise<CheckoutSessionResult> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/checkout/sessions`,
        {
          amount: data.priceAmount * 100, // Convert to cents
          currency: data.currency || 'USD',
          subscription: {
            plan_id: this.getPlanId(data.planId, data.billingPeriod),
            interval: data.billingPeriod === 'annually' ? 'year' : 'month',
          },
          customer: {
            email: data.userEmail,
            metadata: {
              userId: data.userId,
            },
          },
          success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={SESSION_ID}&success=true`,
          cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
          metadata: {
            userId: data.userId,
            planId: data.planId,
            billingPeriod: data.billingPeriod,
          },
          payment_methods: ['card', 'crypto'], // Dodo supports crypto!
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        sessionId: response.data.id,
        checkoutUrl: response.data.url,
      };
    } catch (error: any) {
      throw new Error(
        `Dodo checkout failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async verifyWebhook(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Promise<WebhookEvent> {
    // Dodo uses HMAC-SHA256 for webhook verification
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid webhook signature');
    }

    const event = JSON.parse(payload.toString());
    return {
      type: this.mapEventType(event.type),
      data: event.data,
      raw: event,
    };
  }

  async getSubscription(subscriptionId: string): Promise<SubscriptionData> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/subscriptions/${subscriptionId}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const sub = response.data;
      return {
        id: sub.id,
        customerId: sub.customer_id,
        status: this.mapStatus(sub.status),
        planId: sub.metadata?.planId || '',
        billingPeriod: sub.interval === 'year' ? 'annually' : 'monthly',
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end || false,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to get subscription: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    immediately = false
  ): Promise<void> {
    try {
      await axios.post(
        `${this.apiUrl}/subscriptions/${subscriptionId}/cancel`,
        {
          immediately,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );
    } catch (error: any) {
      throw new Error(
        `Failed to cancel subscription: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/portal/sessions`,
        {
          customer_id: customerId,
          return_url: returnUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data.url;
    } catch (error: any) {
      throw new Error(
        `Failed to create portal session: ${error.response?.data?.message || error.message}`
      );
    }
  }

  async refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ refundId: string; status: string }> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/refunds`,
        {
          payment_id: paymentId,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return {
        refundId: response.data.id,
        status: response.data.status,
      };
    } catch (error: any) {
      throw new Error(
        `Failed to refund payment: ${error.response?.data?.message || error.message}`
      );
    }
  }

  private getPlanId(planId: string, billingPeriod: 'monthly' | 'annually'): string {
    // Map your internal plan IDs to Dodo plan IDs
    const planMap: Record<string, Record<string, string>> = {
      professional: {
        monthly: process.env.DODO_PROFESSIONAL_MONTHLY_PLAN_ID || '',
        annually: process.env.DODO_PROFESSIONAL_ANNUAL_PLAN_ID || '',
      },
      enterprise: {
        monthly: process.env.DODO_ENTERPRISE_MONTHLY_PLAN_ID || '',
        annually: process.env.DODO_ENTERPRISE_ANNUAL_PLAN_ID || '',
      },
    };

    return planMap[planId]?.[billingPeriod] || '';
  }

  private mapEventType(dodoEventType: string): string {
    // Map Dodo event types to your internal event types
    const eventMap: Record<string, string> = {
      'checkout.completed': 'checkout.session.completed',
      'subscription.updated': 'customer.subscription.updated',
      'subscription.canceled': 'customer.subscription.deleted',
      'payment.succeeded': 'invoice.payment_succeeded',
      'payment.failed': 'invoice.payment_failed',
    };

    return eventMap[dodoEventType] || dodoEventType;
  }

  private mapStatus(
    dodoStatus: string
  ): 'active' | 'canceled' | 'past_due' | 'incomplete' {
    const statusMap: Record<string, 'active' | 'canceled' | 'past_due' | 'incomplete'> = {
      active: 'active',
      cancelled: 'canceled',
      canceled: 'canceled',
      past_due: 'past_due',
      incomplete: 'incomplete',
      trialing: 'active',
    };

    return statusMap[dodoStatus.toLowerCase()] || 'incomplete';
  }
}
