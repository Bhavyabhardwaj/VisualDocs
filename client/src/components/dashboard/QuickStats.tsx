import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FC } from 'react';

interface StatCardProps {
  icon: FC<{ className?: string }>;
  title: string;
  value: number | string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient: string;
  index: number;
}

const StatCard = ({ icon: Icon, title, value, trend, gradient, index }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg transition-shadow"
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute top-0 right-0 w-32 h-32 opacity-5 blur-2xl rounded-full",
        gradient
      )} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-3 rounded-xl bg-gradient-to-br",
            gradient
          )}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
              trend.isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        <div className="mb-1">
          <div className="text-3xl font-bold text-slate-900">{value}</div>
        </div>
        
        <div className="text-sm text-slate-600">{title}</div>
      </div>
    </motion.div>
  );
};

interface QuickStatsProps {
  stats: {
    totalProjects: number;
    docsGenerated: number;
    aiInsights: number;
    teamCollaborators: number;
  };
}

export const QuickStats = ({ stats }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={({ className }) => <span className={className}>📁</span> as any}
        title="Projects Analyzed"
        value={stats.totalProjects}
        trend={{ value: 12, isPositive: true }}
        gradient="from-indigo-500 to-purple-500"
        index={0}
      />
      <StatCard
        icon={({ className }) => <span className={className}>📄</span> as any}
        title="Docs Generated"
        value={stats.docsGenerated}
        trend={{ value: 8, isPositive: true }}
        gradient="from-green-500 to-emerald-500"
        index={1}
      />
      <StatCard
        icon={({ className }) => <span className={className}>🤖</span> as any}
        title="AI Insights"
        value={stats.aiInsights}
        trend={{ value: 5, isPositive: true }}
        gradient="from-cyan-500 to-blue-500"
        index={2}
      />
      <StatCard
        icon={({ className }) => <span className={className}>👥</span> as any}
        title="Team Collaborators"
        value={stats.teamCollaborators}
        trend={{ value: 3, isPositive: true }}
        gradient="from-orange-500 to-red-500"
        index={3}
      />
    </div>
  );
};
