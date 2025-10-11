import { motion } from 'framer-motion';
import { Github, Upload, FileCode, Users, Clock } from 'lucide-react';
import { ActivityItem } from '@/types/dashboard';

interface QuickActionsCenterProps {
  onImportGitHub?: () => void;
  onUploadCodebase?: () => void;
  onUseTemplate?: () => void;
  onJoinTeam?: () => void;
  recentActivity?: ActivityItem[];
}

export const QuickActionsCenter = ({ 
  onImportGitHub,
  onUploadCodebase,
  onUseTemplate,
  onJoinTeam,
  recentActivity = []
}: QuickActionsCenterProps) => {
  const actions = [
    {
      icon: Github,
      title: 'Import from GitHub',
      description: 'Connect your repository',
      gradient: 'from-slate-700 to-slate-900',
      onClick: onImportGitHub
    },
    {
      icon: Upload,
      title: 'Upload Codebase',
      description: 'Direct file upload',
      gradient: 'from-indigo-500 to-purple-500',
      onClick: onUploadCodebase
    },
    {
      icon: FileCode,
      title: 'Create from Template',
      description: 'Start with boilerplate',
      gradient: 'from-cyan-500 to-blue-500',
      onClick: onUseTemplate
    },
    {
      icon: Users,
      title: 'Join Team Project',
      description: 'Collaborate on existing',
      gradient: 'from-green-500 to-emerald-500',
      onClick: onJoinTeam
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'generated': return '📄';
      case 'insight': return '💡';
      case 'collaboration': return '👥';
      case 'export': return '📤';
      default: return '📌';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 text-left hover:border-indigo-300 hover:shadow-lg transition-all group"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 blur-2xl transition-opacity`} />
              
              <div className="relative flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-slate-600">{action.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
