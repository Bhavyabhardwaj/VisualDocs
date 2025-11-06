/**
 * Payment Provider Interface
 * Allows switching between different payment gateways (Stripe, Dodo, etc.)
 */

export interface CheckoutSessionData {
  planId: string;
  billingPeriod: 'monthly' | 'annually';
  userId: string;
  userEmail: string;
  priceAmount: number;
  currency?: string;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
}

export interface SubscriptionData {
  id: string;
  customerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  planId: string;
  billingPeriod: 'monthly' | 'annually';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export interface WebhookEvent {
  type: string;
  data: any;
  raw: any;
}

/**
 * Abstract Payment Provider
 * Implement this interface for each payment gateway
 */
export abstract class PaymentProvider {
  abstract name: string;

  /**
   * Create a checkout session for a subscription
   */
  abstract createCheckoutSession(
    data: CheckoutSessionData
  ): Promise<CheckoutSessionResult>;

  /**
   * Verify webhook signature
   */
  abstract verifyWebhook(
    payload: string | Buffer,
    signature: string,
    secret: string
  ): Promise<WebhookEvent>;

  /**
   * Get subscription details
   */
  abstract getSubscription(subscriptionId: string): Promise<SubscriptionData>;

  /**
   * Cancel a subscription
   */
  abstract cancelSubscription(
    subscriptionId: string,
    immediately?: boolean
  ): Promise<void>;

  /**
   * Create customer portal session (for self-service management)
   */
  abstract createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string>;

  /**
   * Refund a payment
   */
  abstract refundPayment(
    paymentId: string,
    amount?: number
  ): Promise<{ refundId: string; status: string }>;
}
