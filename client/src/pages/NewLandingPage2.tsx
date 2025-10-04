/**
 * Premium Marketing Landing Page - REDESIGNED
 * With Bento Grids, Advanced Animations, Glassmorphism & Micro-interactions
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
  Github as GithubIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoGrid, BentoGridItem } from '@/components/ui/aceternity/bento-grid';
import { BackgroundGradient } from '@/components/ui/aceternity/background-gradient';
import { useRef } from 'react';

export const NewLandingPage = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Advanced machine learning analyzes your codebase instantly with deep insights",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-br from-violet-500/40 to-purple-500/40 blur-3xl"
          />
          <Brain className="w-20 h-20 text-violet-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      ),
      icon: <Brain className="h-4 w-4 text-violet-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Real-Time Collaboration",
      description: "Work together with live cursors, comments, and instant synchronization",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 relative overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ y: 0 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-12 h-12 rounded-full bg-cyan-400/60 backdrop-blur-sm border-2 border-white/40"
              />
            ))}
          </motion.div>
        </div>
      ),
      icon: <Users className="h-4 w-4 text-cyan-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Lightning Fast",
      description: "Analyze thousands of files in seconds with our optimized engine",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 relative overflow-hidden">
          <motion.div
            animate={{
              x: [-100, 300],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
          <Zap className="w-16 h-16 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
      ),
      icon: <Zap className="h-4 w-4 text-yellow-500" />,
      className: "md:col-span-1",
    },
    {
      title: "GitHub Integration",
      description: "Connect any repository with one click and start analyzing immediately",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-gray-500/20 to-slate-500/20 relative overflow-hidden p-4">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <GithubIcon className="w-20 h-20 text-white/80" />
          </motion.div>
        </div>
      ),
      icon: <GithubIcon className="h-4 w-4 text-gray-500" />,
      className: "md:col-span-2",
    },
    {
      title: "Beautiful Diagrams",
      description: "Auto-generate stunning architecture diagrams and flowcharts",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative w-32 h-32"
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-8 h-8 bg-pink-400/60 rounded-lg"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${i * 90}deg) translateX(40px) translateY(-50%)`,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      ),
      icon: <Workflow className="h-4 w-4 text-pink-500" />,
      className: "md:col-span-1",
    },
    {
      title: "Enterprise Security",
      description: "Bank-level encryption with SOC 2 compliance and data protection",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Shield className="w-20 h-20 text-green-400" />
          </motion.div>
          <motion.div
            animate={{
              scale: [1.5, 2.5, 1.5],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-green-400/50"
          />
        </div>
      ),
      icon: <Shield className="h-4 w-4 text-green-500" />,
      className: "md:col-span-2",
    },
  ];

  const stats = [
    { value: "50K+", label: "Projects Analyzed" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "10M+", label: "Files Processed" },
    { value: "500+", label: "Companies Trust Us" },
  ];

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
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-marketing-primary to-marketing-secondary flex items-center justify-center marketing-glow-sm group-hover:marketing-glow transition-all"
              >
                <Code2 className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold marketing-gradient">VisualDocs</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-white/70 hover:text-white transition-colors">Testimonials</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="marketing-ghost" size="md">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
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
      <motion.section 
        ref={targetRef}
        style={{ opacity, scale }}
        className="pt-24 pb-32 relative"
      >
        <div className="content-container">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-8 border border-white/20 hover:border-white/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-marketing-primary animate-pulse" />
              <span className="text-sm">AI-Powered Code Documentation</span>
              <span className="px-2 py-0.5 bg-marketing-primary/20 text-marketing-primary text-xs font-semibold rounded-full">NEW</span>
            </motion.div>

            {/* Hero Heading with Scroll Animation */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black mb-6 leading-tight"
            >
              Document Your Code
              <br />
              <span className="marketing-gradient inline-block">
                In Seconds, Not Hours
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your codebase into beautiful, AI-generated documentation and diagrams. 
              Connect GitHub, analyze instantly, and create stunning visuals that your team will love.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link to="/register">
                <BackgroundGradient className="rounded-[22px] p-0.5">
                  <Button variant="marketing-primary" size="lg" className="px-8 py-6 text-lg">
                    <Github className="w-5 h-5" />
                    Start with GitHub
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </BackgroundGradient>
              </Link>
              <Button variant="marketing-secondary" size="lg" className="px-8 py-6 text-lg">
                Watch Demo
                <Star className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect p-6 rounded-2xl border border-white/10"
                >
                  <div className="text-4xl font-bold marketing-gradient mb-2">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-32 relative">
        <div className="content-container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black mb-6"
            >
              Built for{' '}
              <span className="marketing-gradient">Modern Development</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/70 max-w-2xl mx-auto"
            >
              Everything you need to create beautiful documentation and diagrams, powered by AI
            </motion.p>
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BentoGridItem
                  title={feature.title}
                  description={feature.description}
                  header={feature.header}
                  icon={feature.icon}
                  className={feature.className}
                />
              </motion.div>
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative">
        <div className="content-container">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-black mb-6"
            >
              Simple, <span className="marketing-gradient">Transparent Pricing</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/70"
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
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-marketing-primary to-marketing-secondary rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className={`glass-effect p-8 rounded-3xl border ${plan.popular ? 'border-marketing-primary/50 marketing-glow' : 'border-white/10'} h-full flex flex-col`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/60 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-black">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-white/60">/month</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-marketing-primary" />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={plan.popular ? "marketing-primary" : "marketing-secondary"}
                    className="w-full"
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
      <footer className="border-t border-white/10 py-12">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-marketing-primary" />
              <span className="font-bold">VisualDocs</span>
            </div>
            <p className="text-white/60 text-sm">
              © 2025 VisualDocs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">Docs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
