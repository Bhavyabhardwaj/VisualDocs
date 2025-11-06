/**
 * Payment Routes
 * Razorpay integration for subscription payments
 * FREE for Indian developers - 2% fee only on successful transactions
 */

import { Router } from 'express';
import { paymentController } from '../controllers';
import {
  createSubscriptionSchema,
  verifyPaymentSchema,
  cancelSubscriptionSchema,
  getSubscriptionSchema,
  validate,
} from '../validations';
import { isAuthenticated, generalLimiter } from '../middleware';

const router = Router();

/**
 * Create a new subscription
 * POST /api/payment/create-subscription
 * Protected route - requires authentication
 */
router.post(
  '/create-subscription',
  isAuthenticated,
  generalLimiter,
  validate(createSubscriptionSchema),
  paymentController.createSubscription.bind(paymentController)
);

/**
 * Verify payment after user completes transaction
 * POST /api/payment/verify
 * Protected route - requires authentication
 */
router.post(
  '/verify',
  isAuthenticated,
  validate(verifyPaymentSchema),
  paymentController.verifyPayment.bind(paymentController)
);

/**
 * Razorpay webhook endpoint
 * POST /api/payment/webhook
 * Public route - Razorpay sends events here
 * No authentication required - signature verification done in controller
 */
router.post(
  '/webhook',
  paymentController.handleWebhook.bind(paymentController)
);

/**
 * Get subscription details
 * GET /api/payment/subscription/:subscriptionId
 * Protected route - requires authentication
 */
router.get(
  '/subscription/:subscriptionId',
  isAuthenticated,
  validate(getSubscriptionSchema),
  paymentController.getSubscription.bind(paymentController)
);

/**
 * Cancel a subscription
 * POST /api/payment/subscription/:subscriptionId/cancel
 * Protected route - requires authentication
 */
router.post(
  '/subscription/:subscriptionId/cancel',
  isAuthenticated,
  validate(cancelSubscriptionSchema),
  paymentController.cancelSubscription.bind(paymentController)
);

export default router;
