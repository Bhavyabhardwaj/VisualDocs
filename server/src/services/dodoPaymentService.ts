/**
 * DodoPay Payment Service
 * Modern payment gateway specifically designed for SaaS and AI products
 * Free to integrate - Merchant of Record included
 */

import DodoPayments from 'dodopayments';
import crypto from 'crypto';
import { BadRequestError } from '../errors';

// Verify DodoPay credentials are loaded
const DODO_API_KEY = process.env.DODO_API_KEY || '';
const DODO_ENVIRONMENT = process.env.DODO_ENVIRONMENT || 'test'; // 'test' or 'live'

if (!DODO_API_KEY) {
  console.warn('⚠️  DODOPAY API KEY MISSING!');
  console.warn('Please set DODO_API_KEY in .env file');
  console.warn('Get your API key from: https://app.dodopayments.com');
} else {
  console.log('✅ DodoPay credentials loaded:', {
    environment: DODO_ENVIRONMENT,
    api_key: DODO_API_KEY.substring(0, 12) + '...',
  });
}

// Initialize DodoPay client
const dodoClient = new DodoPayments({
  bearerToken: DODO_API_KEY,
});

// Base URL based on environment
const DODO_BASE_URL = DODO_ENVIRONMENT === 'live' 
  ? 'https://live.dodopayments.com' 
  : 'https://test.dodopayments.com';

// Plan pricing (in cents - $1 = 100 cents)
const PLAN_PRICING = {
  professional: {
    monthly: 2000, // $20.00
    annually: 19200, // $192.00 (20% discount)
  },
  enterprise: {
    monthly: 20000, // $200.00
    annually: 192000, // $1920.00 (20% discount)
  },
};

export class DodoPaymentService {
  /**
   * Create a checkout session for one-time payment
   */
  static async createCheckoutSession(
    planId: 'professional' | 'enterprise',
    billingPeriod: 'monthly' | 'annually',
    userId: string,
    userEmail: string,
    userName: string
  ) {
    try {
      console.log('🔧 Creating DodoPay checkout session:', { 
        planId, 
        billingPeriod, 
        userId, 
        userEmail 
      });
      
      const amount = PLAN_PRICING[planId][billingPeriod];
      const planName = `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`;
      const periodLabel = billingPeriod === 'monthly' ? 'Monthly' : 'Annual';
      
      // Create checkout session via API
      const response = await fetch(`${DODO_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'USD',
          description: `${planName} - ${periodLabel} Subscription`,
          customer: {
            email: userEmail,
            name: userName,
          },
          metadata: {
            userId,
            planId,
            billingPeriod,
            productName: 'VisualDocs',
          },
          success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const session = await response.json();
      
      console.log('✅ DodoPay checkout session created:', session.id);
      
      return {
        sessionId: session.id,
        checkoutUrl: session.checkout_url,
        amount,
        currency: 'USD',
        status: session.status,
      };
    } catch (error: any) {
      console.error('❌ DodoPay checkout session creation failed:', error);
      throw new Error(
        `Failed to create DodoPay checkout session: ${error.message}`
      );
    }
  }

  /**
   * Create a subscription for recurring payments
   */
  static async createSubscription(
    planId: 'professional' | 'enterprise',
    billingPeriod: 'monthly' | 'annually',
    userId: string,
    userEmail: string,
    userName: string
  ) {
    try {
      console.log('🔧 Creating DodoPay subscription:', { 
        planId, 
        billingPeriod, 
        userId, 
        userEmail 
      });
      
      // Get product ID from environment variables
      const productIdKey = `DODO_PRODUCT_${planId.toUpperCase()}_${billingPeriod.toUpperCase()}`;
      const productId = process.env[productIdKey];
      
      if (!productId) {
        console.error(`❌ Product ID not found: ${productIdKey}`);
        throw new Error(`Product configuration missing for ${planId} ${billingPeriod}. Please add ${productIdKey} to .env`);
      }
      
      console.log(`📦 Using product ID: ${productId}`);
      
      const amount = PLAN_PRICING[planId][billingPeriod];
      
      // Create checkout session using DodoPay SDK
      const checkoutSession = await dodoClient.checkoutSessions.create({
        product_cart: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
        customer: {
          email: userEmail,
          name: userName,
        },
        metadata: {
          userId,
          planId,
          billingPeriod,
        },
        return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/app/dashboard?payment=success`,
      });
      
      if (!checkoutSession || !checkoutSession.checkout_url) {
        throw new Error('Failed to create checkout session - no checkout URL returned');
      }
      
      console.log('✅ DodoPay checkout session created:', checkoutSession.session_id);
      
      return {
        subscriptionId: checkoutSession.session_id,
        checkoutUrl: checkoutSession.checkout_url,
        status: 'pending',
        amount,
        currency: 'USD',
      };
    } catch (error: any) {
      console.error('❌ DodoPay subscription creation failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw new Error(
        `Failed to create subscription: ${error.message}`
      );
    }
  }

  /**
   * Verify webhook signature from DodoPay
   * CRITICAL: Always verify webhook signatures to prevent fraud
   */
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch (error) {
      console.error('❌ Webhook signature verification failed:', error);
      return false;
    }
  }

  /**
   * Retrieve payment details
   */
  static async getPayment(paymentId: string) {
    try {
      const response = await fetch(`${DODO_BASE_URL}/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Payment not found');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to retrieve payment: ${error.message}`);
    }
  }

  /**
   * Retrieve subscription details
   */
  static async getSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`${DODO_BASE_URL}/subscriptions/${subscriptionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Subscription not found');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to retrieve subscription: ${error.message}`);
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`${DODO_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to cancel subscription: ${error.message}`);
    }
  }

  /**
   * Get all customer subscriptions
   */
  static async getCustomerSubscriptions(customerEmail: string) {
    try {
      const response = await fetch(`${DODO_BASE_URL}/subscriptions?customer_email=${customerEmail}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch customer subscriptions');
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to retrieve customer subscriptions: ${error.message}`);
    }
  }

  /**
   * Create a payment link (useful for quick checkouts)
   */
  static async createPaymentLink(
    planId: 'professional' | 'enterprise',
    billingPeriod: 'monthly' | 'annually',
    userEmail?: string
  ) {
    try {
      const amount = PLAN_PRICING[planId][billingPeriod];
      const planName = `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`;
      const periodLabel = billingPeriod === 'monthly' ? 'Monthly' : 'Annual';
      
      const response = await fetch(`${DODO_BASE_URL}/payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DODO_API_KEY}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'USD',
          description: `${planName} - ${periodLabel}`,
          customer_email: userEmail,
          metadata: {
            planId,
            billingPeriod,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment link');
      }

      const link = await response.json();
      
      return {
        linkId: link.id,
        url: link.url,
        amount,
        currency: 'USD',
      };
    } catch (error: any) {
      throw new Error(`Failed to create payment link: ${error.message}`);
    }
  }

  /**
   * Get plan pricing
   */
  static getPlanPricing() {
    return PLAN_PRICING;
  }

  /**
   * Format amount for display (cents to dollars)
   */
  static formatAmount(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
  }
}

export default DodoPaymentService;
