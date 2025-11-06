/**
 * Payment Service - Razorpay Integration (Client Side)
 * Handles checkout sessions and payment processing
 * FREE for Indian developers - Only 2% fee on successful transactions
 */

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface CheckoutData {
  planName: string;
  planId: 'professional' | 'enterprise';
  billingPeriod: 'monthly' | 'annually';
  price: number;
}

/**
 * Load Razorpay script dynamically
 */
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initialize Razorpay checkout session
 */
export const createCheckoutSession = async (data: CheckoutData): Promise<void> => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Get auth token
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login with return URL
      window.location.href = `/login?redirect=/pricing&plan=${data.planId}&billing=${data.billingPeriod}`;
      return;
    }

    // Create subscription on backend
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        planId: data.planId,
        billingPeriod: data.billingPeriod,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create subscription');
    }

    const { data: subscriptionData } = await response.json();

    // Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Razorpay Key ID
      subscription_id: subscriptionData.subscriptionId,
      name: 'VisualDocs',
      description: `${data.planName} - ${data.billingPeriod === 'monthly' ? 'Monthly' : 'Annual'} Plan`,
      image: '/logo.png', // Your logo
      prefill: {
        email: '', // Will be filled from user profile
        contact: '', // Optional
      },
      theme: {
        color: '#37322F', // Your brand color
      },
      handler: async function (response: any) {
        // Payment successful - verify on backend
        try {
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyResponse.ok) {
            // Redirect to success page
            window.location.href = '/dashboard?payment=success';
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Verification error:', error);
          window.location.href = '/dashboard?payment=error';
        }
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          // Optionally redirect or show message
        }
      },
      notes: {
        planId: data.planId,
        billingPeriod: data.billingPeriod,
      },
    };

    // Open Razorpay checkout
    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Checkout error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to initialize checkout');
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
 * Format price for display
 */
export const formatPrice = (price: number, period: 'monthly' | 'annually', currency: 'INR' | 'USD' = 'INR'): string => {
  if (price === 0) return 'Free';
  
  const symbol = currency === 'INR' ? '₹' : '$';
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return `${symbol}${formatted}/${period === 'monthly' ? 'mo' : 'yr'}`;
};
