import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { 
  Github, 
  ArrowRight, 
  Play, 
  Sparkles,
  Zap,
  Brain,
  Workflow,
  Users,
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-white/90">
              AI-Powered  Real-time  Developer-First
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
          >
            Transform Your
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Code into Docs
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto"
          >
            AI-powered code analysis, automated diagram generation, and seamless team collaboration. 
            <span className="text-emerald-400 font-semibold"> The most beautiful documentation platform</span> developers have ever seen.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Link to="/auth/register">
              <Button 
                className="group px-8 py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-2xl shadow-emerald-500/50"
              >
                <Github className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Free with GitHub
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            <Button 
              className="px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {[
              { icon: Brain, label: 'AI Analysis', color: 'from-emerald-400 to-cyan-400' },
              { icon: Workflow, label: 'Auto Diagrams', color: 'from-purple-400 to-pink-400' },
              { icon: Users, label: 'Team Collab', color: 'from-blue-400 to-teal-400' },
              { icon: Zap, label: 'Real-time', color: 'from-yellow-400 to-orange-400' },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                whileHover={{ y: -5 }}
                className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className={'p-4 rounded-xl bg-gradient-to-br ' + feature.color}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/90 font-medium">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-20 flex flex-col items-center"
          >
            <p className="text-white/60 text-sm mb-4">Trusted by developers worldwide</p>
            <div className="flex items-center gap-8">
              {['10k+ Users', '500+ Companies', '99% Uptime'].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.split(' ')[0]}</div>
                  <div className="text-xs text-white/60">{stat.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
