/**
 * Payment Controller
 * Handles HTTP requests for payment operations
 * Uses Razorpay for processing payments
 */

import type { NextFunction, Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { successResponse } from '../utils';
import { BadRequestError } from '../errors';
import prisma from '../config/db';

export class PaymentController {
  /**
   * Create a subscription checkout
   * POST /api/payment/create-subscription
   */
  async createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { planId, billingPeriod } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      // Validate plan
      if (!['professional', 'enterprise'].includes(planId)) {
        throw new BadRequestError('Invalid plan selected');
      }

      if (!['monthly', 'annually'].includes(billingPeriod)) {
        throw new BadRequestError('Invalid billing period');
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (!user) {
        throw new BadRequestError('User not found');
      }

      // Create Razorpay subscription
      const subscription = await PaymentService.createSubscription(
        planId,
        billingPeriod,
        userId,
        user.email,
        user.name
      );

      return successResponse(
        res,
        {
          subscriptionId: subscription.subscriptionId,
          amount: subscription.amount / 100, // Convert paise to rupees
          currency: subscription.currency,
          paymentUrl: subscription.shortUrl,
          planId,
          billingPeriod,
        },
        'Subscription created successfully',
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify payment after user completes payment
   * POST /api/payment/verify
   */
  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new BadRequestError('Missing payment verification details');
      }

      // Verify signature
      const isValid = PaymentService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (!isValid) {
        throw new BadRequestError('Invalid payment signature');
      }

      // Get payment details
      const payment = await PaymentService.getPayment(razorpay_payment_id);

      // TODO: Update user subscription in database
      // await this.updateUserSubscription(userId, payment);

      return successResponse(
        res,
        {
          verified: true,
          payment: {
            id: payment.id,
            amount: Number(payment.amount) / 100,
            status: payment.status,
            method: payment.method,
          },
        },
        'Payment verified successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Razorpay webhooks
   * POST /api/payment/webhook
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const body = JSON.stringify(req.body);

      // Verify webhook signature
      const isValid = PaymentService.verifyWebhookSignature(body, signature);

      if (!isValid) {
        throw new BadRequestError('Invalid webhook signature');
      }

      const event = req.body;

      // Handle different webhook events
      switch (event.event) {
        case 'subscription.activated':
          await this.handleSubscriptionActivated(event.payload.subscription.entity);
          break;

        case 'subscription.charged':
          await this.handleSubscriptionCharged(event.payload.payment.entity);
          break;

        case 'subscription.cancelled':
          await this.handleSubscriptionCancelled(event.payload.subscription.entity);
          break;

        case 'subscription.paused':
          await this.handleSubscriptionPaused(event.payload.subscription.entity);
          break;

        case 'subscription.resumed':
          await this.handleSubscriptionResumed(event.payload.subscription.entity);
          break;

        case 'payment.failed':
          await this.handlePaymentFailed(event.payload.payment.entity);
          break;

        default:
          console.log(`Unhandled webhook event: ${event.event}`);
      }

      // Always return 200 to Razorpay
      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get subscription details
   * GET /api/payment/subscription/:subscriptionId
   */
  async getSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      if (!subscriptionId) {
        throw new BadRequestError('Subscription ID is required');
      }

      // Get subscription from Razorpay
      const subscription = await PaymentService.getSubscription(subscriptionId);

      // Verify this subscription belongs to the user
      if (subscription.notes && subscription.notes.userId !== userId) {
        throw new BadRequestError('Unauthorized access to subscription');
      }

      return successResponse(
        res,
        {
          subscription: {
            id: subscription.id,
            planId: subscription.notes?.planId || '',
            status: subscription.status,
            currentStart: subscription.current_start,
            currentEnd: subscription.current_end,
            chargeAt: subscription.charge_at,
            paidCount: subscription.paid_count,
            totalCount: subscription.total_count,
          },
        },
        'Subscription fetched successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cancel subscription
   * POST /api/payment/subscription/:subscriptionId/cancel
   */
  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      const { cancelAtCycleEnd = true } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }

      if (!subscriptionId) {
        throw new BadRequestError('Subscription ID is required');
      }

      // Verify subscription belongs to user
      const subscription = await PaymentService.getSubscription(subscriptionId);
      if (subscription.notes && subscription.notes.userId !== userId) {
        throw new BadRequestError('Unauthorized access to subscription');
      }

      // Cancel subscription
      const cancelled = await PaymentService.cancelSubscription(
        subscriptionId,
        cancelAtCycleEnd
      );

      return successResponse(
        res,
        {
          subscriptionId: cancelled.id,
          status: cancelled.status,
          cancelledAt: cancelled.ended_at,
        },
        'Subscription cancelled successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  // ===== Private Helper Methods =====

  /**
   * Handle subscription activated event
   */
  private async handleSubscriptionActivated(subscription: any) {
    const userId = subscription.notes.userId;
    const planId = subscription.notes.planId;
    const billingPeriod = subscription.notes.billingPeriod;

    // TODO: Update user in database with subscription details
    console.log(`✅ Subscription activated for user ${userId}: ${planId}`);

    // Example database update (uncomment when ready):
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionId: subscription.id,
    //     subscriptionStatus: 'active',
    //     subscriptionPlan: planId,
    //     billingPeriod,
    //     subscriptionEndsAt: new Date(subscription.current_end * 1000),
    //   },
    // });
  }

  /**
   * Handle successful payment for subscription
   */
  private async handleSubscriptionCharged(payment: any) {
    console.log(`✅ Payment successful: ${payment.id}`);
    // TODO: Send payment receipt email
  }

  /**
   * Handle subscription cancelled
   */
  private async handleSubscriptionCancelled(subscription: any) {
    const userId = subscription.notes.userId;

    console.log(`❌ Subscription cancelled for user ${userId}`);

    // TODO: Update user to free plan
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionStatus: 'cancelled',
    //     subscriptionPlan: 'starter',
    //   },
    // });
  }

  /**
   * Handle subscription paused
   */
  private async handleSubscriptionPaused(subscription: any) {
    const userId = subscription.notes.userId;
    console.log(`⏸️ Subscription paused for user ${userId}`);
  }

  /**
   * Handle subscription resumed
   */
  private async handleSubscriptionResumed(subscription: any) {
    const userId = subscription.notes.userId;
    console.log(`▶️ Subscription resumed for user ${userId}`);
  }

  /**
   * Handle payment failed
   */
  private async handlePaymentFailed(payment: any) {
    console.log(`❌ Payment failed: ${payment.id}`);
    // TODO: Send payment failed email to user
  }
}

// Export singleton instance
export const paymentController = new PaymentController();
