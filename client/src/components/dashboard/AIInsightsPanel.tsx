import { motion } from 'framer-motion';
import type { AIInsight } from '@/types/dashboard';
import { AlertTriangle, Lightbulb, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface AIInsightsPanelProps {
  insights: AIInsight[];
}

export const AIInsightsPanel = ({ insights }: AIInsightsPanelProps) => {
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: 'text-amber-600',
        };
      case 'suggestion':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: 'text-blue-600',
        };
      case 'success':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: 'text-green-600',
        };
      case 'info':
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-700',
          border: 'border-slate-200',
          icon: 'text-slate-600',
        };
    }
  };

  const getPriorityBadge = (priority: AIInsight['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      low: 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return colors[priority];
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          AI Insights
        </h3>
        <span className="text-xs font-medium text-slate-500">Today</span>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-3">
              <Info className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm text-slate-600">No insights yet</p>
            <p className="text-xs text-slate-500 mt-1">AI will analyze your projects soon</p>
          </div>
        ) : (
          insights.map((insight, index) => {
            const colors = getInsightColor(insight.type);
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border ${colors.bg} ${colors.border} hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${colors.icon}`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${colors.text}`}>{insight.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityBadge(insight.priority)}`}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* View All Link */}
      {insights.length > 0 && (
        <button className="w-full mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 py-2 hover:bg-indigo-50 rounded-lg transition-colors">
          View All Insights →
        </button>
      )}
    </div>
  );
};
