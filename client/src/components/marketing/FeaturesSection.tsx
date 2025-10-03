import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  Github, 
  Brain, 
  Workflow, 
  Users, 
  Zap, 
  BarChart3,
  Shield,
  Globe,
  Code2,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Github,
    title: 'One-Click GitHub Import',
    description: 'Connect any repository instantly. Our AI analyzes your entire codebase in seconds, understanding structure and dependencies automatically.',
    gradient: 'from-gray-500 to-gray-600',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Get intelligent insights on code quality, complexity, and maintainability with actionable recommendations powered by advanced AI.',
    gradient: 'from-marketing-primary to-cyan-500',
  },
  {
    icon: Workflow,
    title: 'Auto-Generated Diagrams',
    description: 'Beautiful architecture diagrams, flowcharts, and system maps created automatically from your code structure and relationships.',
    gradient: 'from-marketing-secondary to-purple-500',
  },
  {
    icon: Users,
    title: 'Real-Time Collaboration',
    description: 'Work together seamlessly with live cursors, comments, and instant updates across your entire development team.',
    gradient: 'from-marketing-accent to-yellow-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance with instant loading, real-time updates, and smooth animations that never slow you down.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track code quality over time, identify technical debt, measure documentation coverage, and get detailed metrics.',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white dark:bg-dark-bg">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Features</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-light-text dark:text-dark-text mb-6">
            Built for Modern Development
          </h2>
          
          <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary max-w-3xl mx-auto">
            Every feature designed to make documentation effortless and beautiful, 
            while maintaining the highest standards of code quality.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              variant="elevated"
              hover
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-8 h-8 text-primary-500 mx-auto mb-4" />
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-2">
              Enterprise Security
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              SOC2 compliant with end-to-end encryption
            </p>
          </div>
          
          <div className="text-center">
            <Globe className="w-8 h-8 text-primary-500 mx-auto mb-4" />
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-2">
              Global Performance
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Deployed on global CDN for lightning speed
            </p>
          </div>
          
          <div className="text-center">
            <Code2 className="w-8 h-8 text-primary-500 mx-auto mb-4" />
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-2">
              Developer Experience
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              Built by developers, for developers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
