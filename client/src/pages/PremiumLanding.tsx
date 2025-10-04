import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Shield, 
  Code2,
  Layers,
  Box,
  Command,
  Check,
  Menu,
  X
} from 'lucide-react';
import { useState, useRef } from 'react';

export default function PremiumLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

  // Smooth spring physics
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 0.95]), springConfig);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />
      </div>

      {/* Premium Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-violet-600/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          
          <div className="relative flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-violet-600 rounded-lg blur-sm opacity-70" />
                <div className="relative bg-gradient-to-br from-emerald-400 to-violet-600 p-2 rounded-lg">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 via-violet-400 to-amber-400 bg-clip-text text-transparent">
                VisualDocs
              </span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Docs', 'About'].map((item, idx) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-sm font-medium text-white/70 hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-emerald-400 to-violet-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="relative px-5 py-2.5 text-sm font-semibold rounded-xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-violet-600 to-emerald-500 bg-[length:200%_100%] animate-gradient" />
                <span className="relative text-white flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex flex-col gap-3">
                {['Features', 'Pricing', 'Docs', 'About'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {item}
                  </a>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <button className="px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/5 rounded-lg text-left transition-all">
                  Sign In
                </button>
                <button className="px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-violet-600 rounded-lg">
                  Get Started
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <motion.div
          ref={heroRef}
          style={{ opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-violet-600 to-amber-400 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="relative px-5 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Introducing AI-Powered Documentation</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight"
          >
            <span className="inline-block">Documentation</span>
            <br />
            <span className="inline-block bg-gradient-to-r from-emerald-400 via-violet-400 to-amber-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_100%]">
              Reimagined
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-3xl mx-auto font-light"
          >
            Create stunning, interactive documentation that your team will actually love.
            <br />
            AI-powered, real-time collaboration, and blazingly fast.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16, 185, 129, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 text-lg font-semibold rounded-2xl overflow-hidden group w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-violet-600 to-emerald-500 bg-[length:200%_100%] animate-gradient" />
              <span className="relative text-white flex items-center justify-center gap-2">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl hover:bg-white/10 transition-all w-full sm:w-auto group"
            >
              <span className="flex items-center justify-center gap-2">
                Watch Demo
                <motion.span
                  className="inline-block w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </span>
            </motion.button>
          </motion.div>

          {/* Floating Cards Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: 'Active Users', value: '100K+', icon: Users },
              { label: 'Uptime', value: '99.99%', icon: Zap },
              { label: 'Projects', value: '500K+', icon: Box },
              { label: 'Countries', value: '150+', icon: Shield },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-violet-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                  <stat.icon className="w-6 h-6 text-emerald-400 mb-3 mx-auto" />
                  <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-[10%] w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-violet-600/20 rounded-2xl backdrop-blur-xl border border-white/10 hidden lg:block"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/3 right-[15%] w-32 h-32 bg-gradient-to-br from-violet-600/20 to-amber-400/20 rounded-3xl backdrop-blur-xl border border-white/10 hidden lg:block"
        />
      </section>

      {/* Features Bento Grid */}
      <section className="relative px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything you need.
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-violet-400 bg-clip-text text-transparent">
                Nothing you don't.
              </span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Powerful features that make documentation a breeze
            </p>
          </motion.div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature - AI Powered */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="md:col-span-2 md:row-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-violet-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 hover:border-white/20 transition-all overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl" />
                <div className="relative">
                  <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500/20 to-violet-600/20 rounded-2xl mb-6">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered Intelligence</h3>
                  <p className="text-lg text-white/60 mb-8 max-w-xl">
                    Let AI handle the heavy lifting. Auto-generate documentation, suggest improvements, and maintain consistency across your entire codebase.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Auto-complete', 'Smart Suggestions', 'Code Analysis', 'SEO Optimization'].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Collaboration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-amber-400/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-violet-500/20 to-amber-400/20 rounded-2xl mb-6">
                  <Users className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real-time Collaboration</h3>
                <p className="text-white/60">
                  Work together seamlessly with your team in real-time
                </p>
              </div>
            </motion.div>

            {/* Lightning Fast */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400/20 to-emerald-500/20 rounded-2xl mb-6">
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-white/60">
                  Instant search, navigation, and updates. No waiting around.
                </p>
              </div>
            </motion.div>

            {/* Integrations */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-violet-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500/20 to-violet-600/20 rounded-2xl mb-6">
                  <Command className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Deep Integrations</h3>
                <p className="text-white/60">
                  Connect with GitHub, Slack, Notion, and 50+ more tools
                </p>
              </div>
            </motion.div>

            {/* Interactive Diagrams */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="md:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-emerald-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-violet-500/20 to-emerald-500/20 rounded-2xl mb-6">
                  <Layers className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Interactive Diagrams</h3>
                <p className="text-white/60 max-w-xl">
                  Create beautiful flowcharts, architecture diagrams, and mind maps with our intuitive drag-and-drop editor
                </p>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-violet-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-amber-400/20 to-violet-600/20 rounded-2xl mb-6">
                  <Shield className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
                <p className="text-white/60">
                  SOC 2 compliant with end-to-end encryption
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-white/60">
              Choose the perfect plan for your team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for side projects',
                features: ['5 Projects', '10GB Storage', 'Basic Analytics', 'Community Support'],
                cta: 'Get Started',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                description: 'For growing teams',
                features: ['Unlimited Projects', '100GB Storage', 'Advanced Analytics', 'Priority Support', 'Custom Domain', 'API Access'],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations',
                features: ['Unlimited Everything', 'Dedicated Support', 'SLA Guarantee', 'Advanced Security', 'Custom Integration', 'Training & Onboarding'],
                cta: 'Contact Sales',
                popular: false,
              },
            ].map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative group ${plan.popular ? 'md:-mt-8' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-violet-600 rounded-full text-sm font-semibold z-10">
                    Most Popular
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  plan.popular 
                    ? 'from-emerald-500/30 to-violet-600/30' 
                    : 'from-white/5 to-white/10'
                } rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative h-full bg-white/5 backdrop-blur-xl border ${
                  plan.popular ? 'border-emerald-500/50' : 'border-white/10'
                } rounded-3xl p-8 hover:border-white/20 transition-all`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-white/60 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-white/60">{plan.period}</span>}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-xl font-semibold ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-violet-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    } transition-all`}
                  >
                    {plan.cta}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-emerald-400 to-violet-600 p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">VisualDocs</span>
            </div>
            <p className="text-white/60 text-sm">
              © 2025 VisualDocs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
