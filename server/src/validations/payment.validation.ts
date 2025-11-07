/**
 * Payment Validation Schemas
 * Zod schemas for validating payment-related requests
 */

import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.enum(['professional', 'enterprise'], {
      message: 'Invalid plan selected',
    }),
    billingPeriod: z.enum(['monthly', 'annually'], {
      message: 'Invalid billing period',
    }),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string({
      message: 'Order ID is required',
    }),
    razorpay_payment_id: z.string({
      message: 'Payment ID is required',
    }),
    razorpay_signature: z.string({
      message: 'Payment signature is required',
    }),
  }),
});

export const cancelSubscriptionSchema = z.object({
  body: z.object({
    cancelAtCycleEnd: z.boolean().optional().default(true),
  }),
  params: z.object({
    subscriptionId: z.string({
      message: 'Subscription ID is required',
    }),
  }),
});

export const getSubscriptionSchema = z.object({
  params: z.object({
    subscriptionId: z.string({
      message: 'Subscription ID is required',
    }),
  }),
});
