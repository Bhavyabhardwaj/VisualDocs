import type { NextFunction, Request, Response } from 'express';
import { DodoPaymentService } from '../services/dodoPaymentService';
import { successResponse } from '../utils';
import { BadRequestError } from '../errors';
import prisma from '../config/db';

export class PaymentController {
  async selectFreePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: 'FREE',
          subscriptionStatus: 'ACTIVE',
          billingPeriod: null,
          subscriptionStartedAt: new Date(),
          subscriptionEndsAt: null,
        },
      });
      return successResponse(res, { plan: 'FREE' }, 'FREE plan activated successfully');
    } catch (error) {
      next(error);
    }
  }

  async createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { planId, billingPeriod } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      if (!['professional', 'enterprise'].includes(planId)) {
        throw new BadRequestError('Invalid plan selected');
      }
      if (!['monthly', 'annually'].includes(billingPeriod)) {
        throw new BadRequestError('Invalid billing period');
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      const subscription = await DodoPaymentService.createSubscription(
        planId, billingPeriod, userId, user.email, user.name
      );
      return successResponse(res, {
        subscriptionId: subscription.subscriptionId,
        amount: subscription.amount / 100,
        currency: subscription.currency,
        checkoutUrl: subscription.checkoutUrl,
        planId, billingPeriod,
      }, 'Subscription created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.body;
      if (!paymentId) {
        throw new BadRequestError('Payment ID is required');
      }
      const payment = await DodoPaymentService.getPayment(paymentId);
      return successResponse(res, {
        verified: true,
        payment: { id: payment.id, amount: payment.amount / 100, status: payment.status, currency: payment.currency },
      }, 'Payment verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-dodo-signature'] as string;
      const webhookSecret = process.env.DODO_WEBHOOK_SECRET || '';
      const body = JSON.stringify(req.body);
      if (webhookSecret && signature) {
        const isValid = DodoPaymentService.verifyWebhookSignature(body, signature, webhookSecret);
        if (!isValid) {
          throw new BadRequestError('Invalid webhook signature');
        }
      }
      const event = req.body;
      switch (event.type) {
        case 'payment.succeeded': await this.handlePaymentSucceeded(event.data); break;
        case 'payment.failed': await this.handlePaymentFailed(event.data); break;
        case 'subscription.created': await this.handleSubscriptionCreated(event.data); break;
        case 'subscription.updated': await this.handleSubscriptionUpdated(event.data); break;
        case 'subscription.cancelled': await this.handleSubscriptionCancelled(event.data); break;
        default: console.log('Unhandled webhook event:', event.type);
      }
      return res.status(200).json({ received: true });
    } catch (error) {
      next(error);
    }
  }

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
      const subscription = await DodoPaymentService.getSubscription(subscriptionId);
      return successResponse(res, {
        subscription: { id: subscription.id, status: subscription.status, amount: subscription.amount, currency: subscription.currency },
      }, 'Subscription fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.params;
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      if (!subscriptionId) {
        throw new BadRequestError('Subscription ID is required');
      }
      const cancelled = await DodoPaymentService.cancelSubscription(subscriptionId);
      return successResponse(res, { subscriptionId: cancelled.id, status: cancelled.status }, 'Subscription cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  async getUserSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionPlan: true, subscriptionStatus: true, billingPeriod: true, subscriptionStartedAt: true, subscriptionEndsAt: true },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      return successResponse(res, { subscription: user }, 'Subscription fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { planId, billingPeriod } = req.body;
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      if (!['professional', 'enterprise'].includes(planId)) {
        throw new BadRequestError('Invalid plan selected');
      }
      if (!['monthly', 'annually'].includes(billingPeriod)) {
        throw new BadRequestError('Invalid billing period');
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      const subscription = await DodoPaymentService.createSubscription(
        planId, billingPeriod, userId, user.email, user.name
      );
      return successResponse(res, {
        subscriptionId: subscription.subscriptionId,
        amount: subscription.amount / 100,
        currency: subscription.currency,
        checkoutUrl: subscription.checkoutUrl,
        planId, billingPeriod,
      }, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async verifyPaymentAndActivate(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentId } = req.body;
      if (!paymentId) {
        throw new BadRequestError('Payment ID is required');
      }
      const payment = await DodoPaymentService.getPayment(paymentId);
      return successResponse(res, {
        verified: true,
        payment: { id: payment.id, amount: payment.amount / 100, status: payment.status, currency: payment.currency },
      }, 'Payment verified successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPaymentHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      return successResponse(res, { history: [] }, 'Payment history fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPlanLimits(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new BadRequestError('User not authenticated');
      }
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionPlan: true },
      });
      if (!user) {
        throw new BadRequestError('User not found');
      }
      const limits = {
        FREE: { documents: 5, storage: 100, collaborators: 2 },
        PROFESSIONAL: { documents: 50, storage: 1000, collaborators: 10 },
        ENTERPRISE: { documents: -1, storage: -1, collaborators: -1 },
      };
      return successResponse(res, { 
        plan: user.subscriptionPlan, 
        limits: limits[user.subscriptionPlan] 
      }, 'Plan limits fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  private async handlePaymentSucceeded(payment: any) {
    console.log('Payment succeeded:', payment.id);
  }

  private async handlePaymentFailed(payment: any) {
    console.log('Payment failed:', payment.id);
  }

  private async handleSubscriptionCreated(subscription: any) {
    console.log('Subscription created:', subscription.id);
  }

  private async handleSubscriptionUpdated(subscription: any) {
    console.log('Subscription updated:', subscription.id);
  }

  private async handleSubscriptionCancelled(subscription: any) {
    console.log('Subscription cancelled:', subscription.id);
  }
}

export const paymentController = new PaymentController();
