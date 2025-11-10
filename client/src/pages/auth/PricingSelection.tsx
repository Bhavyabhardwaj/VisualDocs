import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PricingPlan {
  id: 'FREE' | 'PROFESSIONAL' | 'ENTERPRISE';
  name: string;
  description: string;
  icon: any;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Free',
    description: 'Perfect for getting started',
    icon: Rocket,
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Up to 3 projects',
      'Basic diagrams',
      'Community support',
      '100 MB storage',
      'Basic AI analysis',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Professional',
    description: 'For professional developers',
    icon: Zap,
    monthlyPrice: 999,
    annualPrice: 9999,
    popular: true,
    features: [
      'Unlimited projects',
      'Advanced diagrams',
      'Priority support',
      '10 GB storage',
      'Advanced AI analysis',
      'Team collaboration',
      'Custom templates',
      'Export options',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'For large teams',
    icon: Crown,
    monthlyPrice: 2999,
    annualPrice: 29999,
    features: [
      'Everything in Professional',
      'Unlimited storage',
      'Dedicated support',
      'Custom integrations',
      'SSO & Advanced security',
      'SLA guarantee',
      'Custom training',
      'On-premise option',
    ],
  },
];

export const PricingSelection = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePlanSelect = async (plan: PricingPlan) => {
    const token = localStorage.getItem('authToken');
    
    // Check if user is authenticated
    if (!token) {
      alert('Please login first to select a plan');
      navigate('/login');
      return;
    }

    // If FREE plan, directly go to dashboard
    if (plan.id === 'FREE') {
      try {
        setLoading('FREE');
        
        console.log('📝 Selecting FREE plan...');
        
        // Update user subscription to FREE
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/select-free`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('✅ FREE plan selected:', response.data);

        // Navigate to dashboard
        navigate('/app/dashboard');
      } catch (error: any) {
        console.error('❌ Error selecting free plan:', error);
        console.error('Error details:', error.response?.data);
        const errorMsg = error.response?.data?.message || 'Failed to select free plan. Please try again.';
        alert(errorMsg);
      } finally {
        setLoading(null);
      }
      return;
    }

    // For paid plans, initiate payment
    try {
      setLoading(plan.id);
      const amount = isAnnual ? plan.annualPrice : plan.monthlyPrice;
      const billingPeriod = isAnnual ? 'ANNUALLY' : 'MONTHLY';

      // Create Razorpay order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          plan: plan.id,
          billingPeriod,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Order response received:', data);

      // Extract order from response (backend wraps in { success, data: { order } })
      const order = data.data?.order || data.order;

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'VisualDocs',
        description: `${plan.name} Plan - ${billingPeriod}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Payment successful, navigate to dashboard
            navigate('/app/dashboard');
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            const errorMsg = error.response?.data?.message || 'Payment verification failed. Please contact support.';
            alert(errorMsg);
          }
        },
        prefill: {
          email: localStorage.getItem('userEmail') || '',
          name: localStorage.getItem('userName') || '',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('❌ Error creating order:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      const errorMsg = error.response?.data?.message || error.message || 'Failed to initiate payment. Please try again.';
      alert(errorMsg);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Select the perfect plan for your needs
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <Label htmlFor="billing-toggle" className={!isAnnual ? 'font-semibold' : ''}>
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
            <Label htmlFor="billing-toggle" className={isAnnual ? 'font-semibold' : ''}>
              Annual
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            </Label>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            const isLoading = loading === plan.id;

            return (
              <Card
                key={plan.id}
                className={`relative transition-all hover:shadow-xl ${
                  plan.popular ? 'border-2 border-brand-primary shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-brand-primary">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.id === 'FREE' ? 'bg-blue-100' :
                      plan.id === 'PROFESSIONAL' ? 'bg-purple-100' :
                      'bg-yellow-100'
                    }`}>
                      <Icon className={`h-8 w-8 ${
                        plan.id === 'FREE' ? 'text-blue-600' :
                        plan.id === 'PROFESSIONAL' ? 'text-purple-600' :
                        'text-yellow-600'
                      }`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="text-4xl font-bold">
                      ₹{price.toLocaleString()}
                    </div>
                    {plan.id !== 'FREE' && (
                      <div className="text-sm text-gray-600">
                        per {isAnnual ? 'year' : 'month'}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button
                    className="w-full mb-6"
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isLoading || (loading !== null && loading !== plan.id)}
                  >
                    {isLoading ? 'Processing...' : plan.id === 'FREE' ? 'Get Started' : 'Subscribe Now'}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skip for now option */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/app/dashboard')}
            className="text-gray-600"
          >
            I'll choose later
          </Button>
        </div>
      </div>
    </div>
  );
};
