import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { 
  Github, 
  ArrowRight, 
  Play, 
  Brain, 
  Workflow, 
  Users,
  BarChart3,
  Sparkles,
  Zap,
  Code2,
  FileText,
  Rocket
} from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-marketing-primary/20 to-marketing-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-marketing-accent/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-500" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,170,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,170,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 content-container text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 glass-effect rounded-full px-6 py-3 mb-8 animate-fade-in">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-marketing-primary rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-marketing-secondary rounded-full animate-pulse delay-150" />
          </div>
          <span className="text-sm font-medium text-white/90">
            AI-Powered • Real-time • Developer-First
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-slide-up">
          Transform Your
          <span className="block marketing-gradient animate-pulse">
            Code into Docs
          </span>
        </h1>

        {/* Hero Description */}
        <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto animate-slide-up delay-100">
          AI-powered code analysis, automated diagram generation, and seamless team collaboration. 
          The most beautiful documentation platform developers have ever seen.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-slide-up delay-200">
          <Link to="/auth/register">
            <Button 
              variant="marketing-primary"
              size="xl" 
              className="group px-8 py-4 text-lg"
              icon={<Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
            >
              Import from GitHub
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Button 
            variant="marketing-secondary"
            size="xl"
            className="px-8 py-4 text-lg"
            icon={<Play className="w-5 h-5" />}
          >
            Watch Demo
          </Button>
        </div>

        {/* Hero Visual - Dashboard Preview */}
        <div className="relative max-w-7xl mx-auto animate-scale-in delay-300">
          <Card variant="marketing" className="p-8 backdrop-blur-2xl">
            <div className="bg-marketing-dark/60 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="text-sm text-white/60 font-mono">VisualDocs Dashboard</div>
              </div>

              {/* Interactive Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                {/* AI Analysis Card */}
                <Card variant="marketing" className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-marketing-primary/10 to-transparent" />
                  <div className="relative p-6">
                    <Brain className="w-8 h-8 text-marketing-primary mb-4" />
                    <h3 className="font-bold text-white text-lg mb-2">AI Analysis</h3>
                    <div className="text-3xl font-bold text-marketing-primary mb-2">
                      94<span className="text-lg">/100</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-marketing-primary to-cyan-400 h-2 rounded-full w-[94%] relative">
                        <div className="absolute right-0 top-0 w-2 h-2 bg-marketing-primary rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* AI Diagrams Card */}
                <Card variant="marketing" className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-marketing-secondary/10 to-transparent" />
                  <div className="relative p-6">
                    <Workflow className="w-8 h-8 text-marketing-secondary mb-4" />
                    <h3 className="font-bold text-white text-lg mb-2">AI Diagrams</h3>
                    <div className="text-3xl font-bold text-marketing-secondary mb-2">
                      12<span className="text-lg"> generated</span>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-6 rounded border bg-gradient-to-r from-marketing-secondary/40 to-pink-500/40 ${
                            i === 0 ? 'animate-pulse' : ''
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Collaboration Card */}
                <Card variant="marketing" className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-marketing-accent/10 to-transparent" />
                  <div className="relative p-6">
                    <Users className="w-8 h-8 text-marketing-accent mb-4" />
                    <h3 className="font-bold text-white text-lg mb-2">Live Team</h3>
                    <div className="text-3xl font-bold text-marketing-accent mb-2">
                      4<span className="text-lg"> online</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-8 h-8 rounded-full border-2 border-marketing-dark bg-gradient-to-r from-marketing-accent to-yellow-500 ${
                            i === 0 ? 'animate-bounce' : ''
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Data Flow Visualization */}
              <Card variant="marketing" className="p-6 bg-white/5">
                <div className="relative h-32 overflow-hidden">
                  {/* Flowing connections */}
                  <svg className="absolute inset-0 w-full h-full">
                    <defs>
                      <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00d4aa" stopOpacity="0"/>
                        <stop offset="50%" stopColor="#00d4aa" stopOpacity="1"/>
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path 
                      d="M50,64 Q200,20 350,64 T650,64" 
                      stroke="url(#flowGradient)" 
                      strokeWidth="2" 
                      fill="none"
                      className="animate-pulse"
                    />
                  </svg>
                  
                  {/* Flow indicators */}
                  <div className="absolute top-1/2 left-12 w-4 h-4 bg-marketing-primary rounded-full animate-ping" />
                  <div className="absolute top-1/2 right-12 w-4 h-4 bg-marketing-secondary rounded-full animate-ping delay-1000" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/60 font-mono text-sm">
                      Repository → AI Analysis → Documentation
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
          
          {/* Floating elements */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-marketing-primary/30 rounded-full blur-xl animate-bounce" />
          <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-marketing-accent/30 rounded-full blur-xl animate-bounce delay-1000" />
        </div>

        {/* Social Proof */}
        <div className="mt-20 animate-fade-in delay-500">
          <p className="text-sm text-white/60 mb-6">Trusted by developers at</p>
          <div className="flex items-center justify-center space-x-8 opacity-50">
            {['Google', 'Microsoft', 'GitHub', 'Vercel', 'Linear'].map((company) => (
              <span key={company} className="text-white/40 font-semibold text-lg">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
