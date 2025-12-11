import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient, SubscriptionPlan, SubscriptionStatus, BillingPeriod, PaymentStatus } from '@prisma/client';
import { isAuthenticated } from '../middleware';

const router = Router();
const prisma = new PrismaClient();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Plan prices in INR (paise for Razorpay)
const PLAN_PRICES: Record<string, Record<string, number>> = {
  PROFESSIONAL: {
    MONTHLY: 99900, // ₹999 in paise
    ANNUALLY: 999900, // ₹9999 in paise
  },
  ENTERPRISE: {
    MONTHLY: 299900, // ₹2999 in paise
    ANNUALLY: 2999900, // ₹29999 in paise
  },
};

// Select FREE plan
router.post('/select-free', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Update user subscription to FREE
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: SubscriptionPlan.FREE,
        subscriptionStatus: SubscriptionStatus.FREE,
        subscriptionStartedAt: new Date(),
        subscriptionEndsAt: null,
        billingPeriod: null,
      },
    });

    res.json({
      success: true,
      message: 'Free plan activated successfully',
    });
  } catch (error) {
    console.error('Error selecting free plan:', error);
    res.status(500).json({ error: 'Failed to activate free plan' });
  }
});

// Create Razorpay order
router.post('/create-order', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { plan, billingPeriod, amount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate plan
    if (plan !== 'PROFESSIONAL' && plan !== 'ENTERPRISE') {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Validate billing period
    if (billingPeriod !== 'MONTHLY' && billingPeriod !== 'ANNUALLY') {
      return res.status(400).json({ error: 'Invalid billing period' });
    }

    // Get expected amount
    const expectedAmount = PLAN_PRICES[plan]?.[billingPeriod];
    if (!expectedAmount) {
      return res.status(400).json({ error: 'Invalid plan or billing period' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: expectedAmount,
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId,
        plan,
        billingPeriod,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId,
        amount: expectedAmount / 100, // Store in rupees
        currency: 'INR',
        razorpayOrderId: order.id,
        subscriptionPlan: plan as SubscriptionPlan,
        billingPeriod: billingPeriod as BillingPeriod,
        status: PaymentStatus.PENDING,
      },
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify payment
router.post('/verify', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Get payment record
    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: PaymentStatus.COMPLETED,
      },
    });

    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (payment.billingPeriod === BillingPeriod.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Update user subscription
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: payment.subscriptionPlan,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        billingPeriod: payment.billingPeriod,
        subscriptionStartedAt: startDate,
        subscriptionEndsAt: endDate,
      },
    });

    res.json({
      success: true,
      message: 'Payment verified and subscription activated',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get user subscription
router.get('/subscription', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        billingPeriod: true,
        subscriptionStartedAt: true,
        subscriptionEndsAt: true,
      },
    });

    res.json({ subscription: user });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Get payment history
router.get('/history', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
