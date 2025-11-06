/**
 * Payment Validation Schemas
 * Zod schemas for validating payment-related requests
 */

import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.enum(['professional', 'enterprise'], {
      required_error: 'Plan ID is required',
      invalid_type_error: 'Invalid plan selected',
    }),
    billingPeriod: z.enum(['monthly', 'annually'], {
      required_error: 'Billing period is required',
      invalid_type_error: 'Invalid billing period',
    }),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string({
      required_error: 'Order ID is required',
    }),
    razorpay_payment_id: z.string({
      required_error: 'Payment ID is required',
    }),
    razorpay_signature: z.string({
      required_error: 'Payment signature is required',
    }),
  }),
});

export const cancelSubscriptionSchema = z.object({
  body: z.object({
    cancelAtCycleEnd: z.boolean().optional().default(true),
  }),
  params: z.object({
    subscriptionId: z.string({
      required_error: 'Subscription ID is required',
    }),
  }),
});

export const getSubscriptionSchema = z.object({
  params: z.object({
    subscriptionId: z.string({
      required_error: 'Subscription ID is required',
    }),
  }),
});
