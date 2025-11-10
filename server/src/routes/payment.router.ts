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
 * Select FREE plan (no payment required)
 * POST /api/payment/select-free
 * Protected route - requires authentication
 */
router.post(
  '/select-free',
  isAuthenticated,
  paymentController.selectFreePlan.bind(paymentController)
);

/**
 * Create Razorpay order for subscription
 * POST /api/payment/create-order
 * Protected route - requires authentication
 */
router.post(
  '/create-order',
  isAuthenticated,
  generalLimiter,
  paymentController.createOrder.bind(paymentController)
);

/**
 * Verify payment after user completes transaction
 * POST /api/payment/verify
 * Protected route - requires authentication
 */
router.post(
  '/verify',
  isAuthenticated,
  paymentController.verifyPaymentAndActivate.bind(paymentController)
);

/**
 * Get current user's subscription
 * GET /api/payment/subscription
 * Protected route - requires authentication
 */
router.get(
  '/subscription',
  isAuthenticated,
  paymentController.getUserSubscription.bind(paymentController)
);

/**
 * Get payment history
 * GET /api/payment/history
 * Protected route - requires authentication
 */
router.get(
  '/history',
  isAuthenticated,
  paymentController.getPaymentHistory.bind(paymentController)
);

/**
 * Get plan limits and features
 * GET /api/payment/plan-limits
 * Protected route - requires authentication
 */
router.get(
  '/plan-limits',
  isAuthenticated,
  paymentController.getPlanLimits.bind(paymentController)
);

/**
 * Create a new subscription (Legacy)
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
 * Get subscription details (Legacy)
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
