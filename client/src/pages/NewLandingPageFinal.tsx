/**
 * Premium SaaS Landing Page - Light Theme
 * Inspired by Luma, Savio, and modern SaaS designs
 * Clean white theme with premium animations
 */

import { Button } from '@/components/ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  Github,
  ArrowRight,
  Brain,
  Workflow,
  Zap,
  Shield,
  Users,
  Code2,
  Star,
  Check,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

export const NewLandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 5 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Code2 className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                VisualDocs
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Testimonials
              </a>
              <a href="#docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Docs
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-200 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#pricing" className="block py-2 text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#testimonials" className="block py-2 text-gray-600 hover:text-gray-900">
                Testimonials
              </a>
              <div className="pt-4 flex flex-col gap-2">
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section
        ref={targetRef}
        style={{ opacity, scale }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Announcement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 mb-8 hover:shadow-md transition-shadow cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Code Documentation</span>
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">NEW</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Document Your Code
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                In Seconds, Not Hours
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Transform your codebase into beautiful, AI-generated documentation and diagrams. 
              Connect GitHub, analyze instantly, and create stunning visuals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/register">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/50 transition-all duration-300"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Start with GitHub
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                Watch Demo
                <Star className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: "50K+", label: "Projects" },
                { value: "99.9%", label: "Uptime" },
                { value: "10M+", label: "Files" },
                { value: "500+", label: "Companies" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section - Redesigned */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            >
              Built for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Development
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need to create beautiful documentation and diagrams, powered by AI
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Advanced machine learning analyzes your codebase instantly with deep insights and intelligent recommendations.",
                gradient: "from-violet-500 to-purple-500",
              },
              {
                icon: Users,
                title: "Real-Time Collaboration",
                description: "Work together with live cursors, comments, and instant synchronization across your team.",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Analyze thousands of files in seconds with our optimized engine and instant updates.",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Github,
                title: "GitHub Integration",
                description: "Connect any repository with one click and start analyzing your code immediately.",
                gradient: "from-gray-700 to-gray-900",
              },
              {
                icon: Workflow,
                title: "Beautiful Diagrams",
                description: "Auto-generate stunning architecture diagrams, flowcharts, and visual documentation.",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption with SOC 2 compliance, SSO, and advanced data protection.",
                gradient: "from-green-500 to-emerald-500",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                    style={{
                      background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                      backgroundImage: `linear-gradient(to right, ${feature.gradient})`,
                    }}
                  />
                  <div className="relative h-full p-8 bg-white rounded-2xl border border-gray-200 group-hover:border-gray-300 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-4" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
            >
              Simple,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Choose the perfect plan for your team
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                description: "Perfect for personal projects",
                features: ["5 Projects", "100 Files/month", "Basic Analysis", "Community Support"],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$29",
                description: "For professional developers",
                features: ["Unlimited Projects", "10K Files/month", "Advanced AI Analysis", "Real-time Collaboration", "Priority Support"],
                cta: "Start Pro Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large teams",
                features: ["Unlimited Everything", "Custom Integration", "Dedicated Support", "SLA Guarantee", "On-premise Option"],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className={`h-full p-8 rounded-2xl border-2 ${
                  plan.popular 
                    ? 'border-blue-600 shadow-xl shadow-blue-500/20 bg-gradient-to-b from-blue-50/50 to-white' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } transition-all duration-300`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-600 ml-2">/month</span>}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">VisualDocs</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 VisualDocs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
