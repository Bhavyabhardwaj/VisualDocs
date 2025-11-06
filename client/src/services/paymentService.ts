/**
 * Payment Service - Stripe Integration
 * Handles checkout sessions and payment processing
 */

export interface CheckoutData {
  planName: string;
  planId: 'starter' | 'professional' | 'enterprise';
  billingPeriod: 'monthly' | 'annually';
  price: number;
}

/**
 * Initialize Stripe checkout session
 * In production, this would call your backend API to create a Stripe session
 */
export const createCheckoutSession = async (data: CheckoutData): Promise<void> => {
  try {
    // In production, call your backend API
    // const response = await fetch('/api/create-checkout-session', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const { sessionId } = await response.json();
    // const stripe = await loadStripe(process.env.VITE_STRIPE_PUBLIC_KEY!);
    // await stripe?.redirectToCheckout({ sessionId });

    // For now, redirect to register with plan info
    const params = new URLSearchParams({
      plan: data.planId,
      billing: data.billingPeriod,
      price: data.price.toString(),
    });
    
    window.location.href = `/register?${params.toString()}`;
  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error('Failed to initialize checkout. Please try again.');
  }
};

/**
 * Handle enterprise contact sales
 */
export const contactSales = (planName: string): void => {
  const subject = encodeURIComponent(`Enterprise Plan Inquiry - ${planName}`);
  const body = encodeURIComponent(`Hi,\n\nI'm interested in the ${planName} plan for my team.\n\nPlease contact me to discuss pricing and features.\n\nThank you!`);
  window.location.href = `mailto:sales@visualdocs.com?subject=${subject}&body=${body}`;
};

/**
 * Stripe price IDs (configure these in your Stripe dashboard)
 * These should be stored in environment variables
 */
export const STRIPE_PRICE_IDS = {
  professional: {
    monthly: 'price_professional_monthly', // Replace with actual Stripe price ID
    annually: 'price_professional_annual', // Replace with actual Stripe price ID
  },
  enterprise: {
    monthly: 'price_enterprise_monthly',
    annually: 'price_enterprise_annual',
  },
} as const;

/**
 * Format price for display
 */
export const formatPrice = (price: number, period: 'monthly' | 'annually'): string => {
  if (price === 0) return 'Free';
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
  
  return `${formatted}/${period === 'monthly' ? 'mo' : 'yr'}`;
};
