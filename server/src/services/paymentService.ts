/**
 * Razorpay Payment Service
 * Handles all payment-related operations using Razorpay API
 * FREE for Indian developers - Only pay 2% when you make sales
 */

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { BadRequestError } from '../errors';

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Plan pricing (in paise - ₹1 = 100 paise)
const PLAN_PRICING = {
  professional: {
    monthly: 2000, // ₹20 or $20 = 2000 paise
    annually: 19200, // ₹192 or $192 (20% discount)
  },
  enterprise: {
    monthly: 20000, // ₹200 or $200
    annually: 192000, // ₹1920 or $1920 (20% discount)
  },
};

// Razorpay plan IDs (you'll get these after creating plans in dashboard)
const RAZORPAY_PLAN_IDS = {
  professional_monthly: process.env.RAZORPAY_PLAN_PROFESSIONAL_MONTHLY || 'plan_prof_monthly',
  professional_annually: process.env.RAZORPAY_PLAN_PROFESSIONAL_ANNUAL || 'plan_prof_annual',
  enterprise_monthly: process.env.RAZORPAY_PLAN_ENTERPRISE_MONTHLY || 'plan_ent_monthly',
  enterprise_annually: process.env.RAZORPAY_PLAN_ENTERPRISE_ANNUAL || 'plan_ent_annual',
};

export class PaymentService {
  /**
   * Create a Razorpay order for one-time payment
   * For subscriptions, use createSubscription instead
   */
  static async createOrder(amount: number, currency: string = 'INR', notes?: any) {
    try {
      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);
      return order;
    } catch (error: any) {
      throw new Error(
        `Failed to create Razorpay order: ${error.message}`
      );
    }
  }

  /**
   * Create a Razorpay subscription
   * This is the recommended way for recurring payments
   */
  static async createSubscription(
    planId: 'professional' | 'enterprise',
    billingPeriod: 'monthly' | 'annually',
    userId: string,
    userEmail: string,
    userName: string
  ) {
    try {
      // Get plan details
      const amount = PLAN_PRICING[planId][billingPeriod];
      const planKey = `${planId}_${billingPeriod}` as keyof typeof RAZORPAY_PLAN_IDS;
      const razorpayPlanId = RAZORPAY_PLAN_IDS[planKey];

      // Create subscription
      const subscription = await razorpay.subscriptions.create({
        plan_id: razorpayPlanId,
        customer_notify: 1, // Send email/SMS to customer
        total_count: billingPeriod === 'annually' ? 12 : 120, // Number of billing cycles
        notes: {
          userId,
          userEmail,
          userName,
          planId,
          billingPeriod,
        },
      });

      return {
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
        amount,
        currency: 'INR',
        shortUrl: subscription.short_url, // Payment link for user
      };
    } catch (error: any) {
      throw new Error(
        `Failed to create subscription: ${error.message}`
      );
    }
  }

  /**
   * Verify Razorpay payment signature
   * CRITICAL: Always verify webhook signatures to prevent fraud
   */
  static verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const text = `${orderId}|${paymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text)
        .digest('hex');

      return generated_signature === signature;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verify Razorpay webhook signature
   * Use this for webhook events
   */
  static verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
        .update(body)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get payment details
   */
  static async getPayment(paymentId: string) {
    try {
      const payment = await razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch payment: ${error.message}`
      );
    }
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.fetch(subscriptionId);
      return subscription;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch subscription: ${error.message}`
      );
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(
    subscriptionId: string,
    cancelAtCycleEnd: boolean = true
  ) {
    try {
      const subscription = await razorpay.subscriptions.cancel(
        subscriptionId,
        cancelAtCycleEnd
      );
      return subscription;
    } catch (error: any) {
      throw new Error(
        `Failed to cancel subscription: ${error.message}`
      );
    }
  }

  /**
   * Pause a subscription
   */
  static async pauseSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.pause(subscriptionId);
      return subscription;
    } catch (error: any) {
      throw new Error(
        `Failed to pause subscription: ${error.message}`
      );
    }
  }

  /**
   * Resume a paused subscription
   */
  static async resumeSubscription(subscriptionId: string) {
    try {
      const subscription = await razorpay.subscriptions.resume(subscriptionId);
      return subscription;
    } catch (error: any) {
      throw new Error(
        `Failed to resume subscription: ${error.message}`
      );
    }
  }

  /**
   * Create a refund
   */
  static async createRefund(paymentId: string, amount?: number) {
    try {
      const options: any = {
        payment_id: paymentId,
      };

      if (amount) {
        options.amount = amount * 100; // Amount in paise
      }

      const refund = await razorpay.payments.refund(paymentId, options);
      return refund;
    } catch (error: any) {
      throw new Error(
        `Failed to create refund: ${error.message}`
      );
    }
  }

  /**
   * Get all invoices for a subscription
   */
  static async getInvoices(subscriptionId: string) {
    try {
      const invoices = await razorpay.invoices.all({
        subscription_id: subscriptionId,
      });
      return invoices;
    } catch (error: any) {
      throw new Error(
        `Failed to fetch invoices: ${error.message}`
      );
    }
  }
}
