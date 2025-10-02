import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Check, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for individual developers',
    features: [
      'Up to 3 repositories',
      'Basic AI analysis',
      'Standard diagrams',
      '5GB storage',
      'Community support',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 19,
    description: 'Best for growing teams',
    features: [
      'Unlimited repositories',
      'Advanced AI analysis',
      'Custom diagram styles',
      '100GB storage',
      'Real-time collaboration',
      'Priority support',
      'Advanced analytics',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'On-premise deployment',
      'Custom integrations',
      'Unlimited storage',
      'SLA guarantee',
      'Dedicated support',
      'Custom training',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-6">
            Simple, Transparent Pricing
          </h2>
          
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Choose the perfect plan for your needs. Start free, upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              variant={plan.popular ? "elevated" : "default"}
              className={`relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''} animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                
                <div className="mt-6">
                  {plan.price === null ? (
                    <div className="text-4xl font-bold text-light-text dark:text-dark-text">
                      Custom
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-light-text dark:text-dark-text">
                        ${plan.price}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-light-text-secondary dark:text-dark-text-secondary ml-2">
                          /month
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      {feature}
                    </span>
                  </div>
                ))}
              </CardContent>

              <CardFooter>
                <Link to="/auth/register" className="w-full">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Questions? Check our{' '}
            <a href="#faq" className="text-primary-600 hover:text-primary-500 font-medium">
              FAQ
            </a>{' '}
            or{' '}
            <a href="#contact" className="text-primary-600 hover:text-primary-500 font-medium">
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
