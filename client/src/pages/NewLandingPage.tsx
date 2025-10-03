/**
 * Premium Marketing Landing Page
 * Dark theme with glassmorphism, animations, and stunning visuals
 */

import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Github,
  ArrowRight,
  Brain,
  Workflow,
  Zap,
  Shield,
  Users,
  BarChart3,
  Code2,
  Star,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewLandingPage = () => {
  return (
    <div className="min-h-screen bg-marketing-dark text-white overflow-hidden marketing-theme">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-marketing-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-marketing-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-marketing-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="bg-dot-pattern opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="glass-effect-strong border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="content-container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-marketing-primary to-marketing-secondary flex items-center justify-center marketing-glow-sm group-hover:marketing-glow transition-all">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold marketing-gradient">VisualDocs</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-white/70 hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-sm text-white/70 hover:text-white transition-colors">FAQ</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/auth/login">
                <Button variant="marketing-ghost" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button variant="marketing-primary" size="md">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 relative">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-8 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-marketing-primary" />
              <span className="text-sm">AI-Powered Code Documentation</span>
              <span className="px-2 py-0.5 bg-marketing-primary/20 text-marketing-primary text-xs font-semibold rounded-full">NEW</span>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black mb-6 leading-tight"
            >
              Document Your Code
              <br />
              <span className="marketing-gradient">In Seconds, Not Hours</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your codebase into beautiful, AI-generated documentation and diagrams.
              Connect GitHub, analyze instantly, and create stunning visuals that your team will love.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/auth/register">
                <Button variant="marketing-primary" size="xl" className="min-w-[200px]">
                  <Github className="w-5 h-5" />
                  Start with GitHub
                </Button>
              </Link>
              <Button variant="marketing-secondary" size="xl" className="min-w-[200px]">
                Watch Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-white/60"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-marketing-primary to-marketing-secondary border-2 border-marketing-dark" />
                  ))}
                </div>
                <span>10,000+ developers</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-marketing-accent text-marketing-accent" />
                ))}
                <span className="ml-2">4.9/5 rating</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 relative"
          >
            <div className="glass-effect-strong rounded-2xl border border-white/20 overflow-hidden marketing-glow">
              <div className="aspect-video bg-gradient-to-br from-marketing-dark to-marketing-dark/50 flex items-center justify-center">
                <div className="text-white/40 text-center">
                  <BarChart3 className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Dashboard Preview Coming Soon</p>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-marketing-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-marketing-secondary/20 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="content-container">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-marketing-primary" />
              <span className="text-sm">Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for <span className="marketing-gradient">Modern Development</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to create beautiful documentation and diagrams, powered by AI
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect-strong rounded-2xl border border-white/10 p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="content-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-marketing-primary" />
              <span className="text-sm">Pricing</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, <span className="marketing-gradient">Transparent Pricing</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`glass-effect-strong rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-marketing-primary marketing-glow scale-105'
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-1 bg-marketing-primary/20 text-marketing-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black">${plan.price}</span>
                  <span className="text-white/60">/month</span>
                </div>
                <p className="text-white/70 mb-8">{plan.description}</p>
                <Button
                  variant={plan.popular ? 'marketing-primary' : 'marketing-secondary'}
                  size="lg"
                  className="w-full mb-8"
                >
                  {plan.cta}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-marketing-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-24">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-marketing-primary" />
              <span className="font-bold">VisualDocs</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
            <p className="text-sm text-white/60">© 2025 VisualDocs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Features Data
const features = [
  {
    icon: Github,
    title: 'One-Click GitHub Import',
    description: 'Connect any repository instantly. Our AI analyzes your entire codebase in seconds.',
    gradient: 'from-gray-500 to-gray-700',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Get intelligent insights on code quality, complexity, and maintainability.',
    gradient: 'from-marketing-primary to-cyan-500',
  },
  {
    icon: Workflow,
    title: 'Auto-Generated Diagrams',
    description: 'Beautiful architecture diagrams and flowcharts created automatically.',
    gradient: 'from-marketing-secondary to-purple-600',
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    description: 'Work together with live cursors, comments, and instant updates.',
    gradient: 'from-marketing-accent to-yellow-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance with instant loading and smooth animations.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with SOC 2 compliance and data encryption.',
    gradient: 'from-green-500 to-emerald-600',
  },
];

// Pricing Data
const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out VisualDocs',
    cta: 'Get Started',
    popular: false,
    features: [
      '3 projects',
      'Basic AI analysis',
      '10 diagrams/month',
      'Community support',
      'Public repositories only',
    ],
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For professional developers',
    cta: 'Start Free Trial',
    popular: true,
    features: [
      'Unlimited projects',
      'Advanced AI analysis',
      'Unlimited diagrams',
      'Priority support',
      'Private repositories',
      'Team collaboration',
      'Custom branding',
      'Export to PDF/PNG',
    ],
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large teams and organizations',
    cta: 'Contact Sales',
    popular: false,
    features: [
      'Everything in Pro',
      'Dedicated support',
      'SSO & SAML',
      'Advanced security',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Training & onboarding',
    ],
  },
];
