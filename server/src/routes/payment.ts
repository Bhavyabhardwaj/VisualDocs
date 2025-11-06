import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { paymentService } from '../services/payments/PaymentService';

const router = Router();

/**
 * POST /api/payment/create-checkout-session
 * Create a checkout session for subscription (works with any provider)
 */
router.post('/create-checkout-session', authenticateToken, async (req, res) => {
  try {
    const { planId, billingPeriod, priceAmount } = req.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    if (!userId || !userEmail) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate plan
    if (!['professional', 'enterprise'].includes(planId)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    if (!['monthly', 'annually'].includes(billingPeriod)) {
      return res.status(400).json({ error: 'Invalid billing period' });
    }

    // Get payment provider
    const provider = paymentService.getProvider();

    // Create checkout session using current provider
    const session = await provider.createCheckoutSession({
      planId,
      billingPeriod,
      userId,
      userEmail,
      priceAmount: priceAmount || (planId === 'professional' ? 20 : 200),
      currency: 'USD',
    });

    res.json({
      sessionId: session.sessionId,
      url: session.checkoutUrl,
      provider: paymentService.getProviderType(),
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/payment/webhook
 * Handle Stripe webhook events
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing stripe-signature header');
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentSucceeded(invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Handle successful checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id;
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;

  if (!userId) {
    console.error('No user ID in checkout session');
    return;
  }

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const planId = subscription.metadata.planId;
    const status = subscription.status;

    // Update user in database
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     stripeCustomerId: customerId,
    //     stripeSubscriptionId: subscriptionId,
    //     subscriptionStatus: status,
    //     subscriptionPlan: planId,
    //     billingPeriod: subscription.items.data[0].price.recurring?.interval,
    //     subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
    //   },
    // });

    console.log(`✅ Subscription created for user ${userId}: ${planId}`);

    // TODO: Send confirmation email
    // await sendSubscriptionConfirmationEmail(userId);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const status = subscription.status;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  try {
    // Update user subscription status
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionStatus: status,
    //     subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
    //   },
    // });

    console.log(`✅ Subscription updated for user ${userId}: ${status}`);
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error('No user ID in subscription metadata');
    return;
  }

  try {
    // Update user to free plan
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscriptionStatus: 'canceled',
    //     subscriptionPlan: 'starter',
    //     subscriptionEndsAt: new Date(subscription.ended_at! * 1000),
    //   },
    // });

    console.log(`✅ Subscription canceled for user ${userId}`);

    // TODO: Send cancellation email
    // await sendSubscriptionCanceledEmail(userId);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.userId;

    if (userId) {
      console.log(`✅ Payment succeeded for user ${userId}`);
      // TODO: Send receipt email
      // await sendPaymentReceiptEmail(userId, invoice);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.userId;

    if (userId) {
      console.log(`❌ Payment failed for user ${userId}`);
      // TODO: Send payment failed email with retry link
      // await sendPaymentFailedEmail(userId, invoice);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

/**
 * GET /api/payment/portal
 * Create a billing portal session for subscription management
 */
router.get('/portal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's Stripe customer ID from database
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: { stripeCustomerId: true },
    // });

    // if (!user?.stripeCustomerId) {
    //   return res.status(404).json({ error: 'No subscription found' });
    // }

    // Create portal session
    // const session = await stripe.billingPortal.sessions.create({
    //   customer: user.stripeCustomerId,
    //   return_url: `${process.env.FRONTEND_URL}/dashboard/settings`,
    // });

    // res.json({ url: session.url });

    res.status(501).json({ error: 'Not implemented - configure Stripe customer portal' });
  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
