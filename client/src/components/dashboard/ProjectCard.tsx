import { motion } from 'framer-motion';
import { FileText, Github, Gitlab, Upload, Clock, TrendingUp, Users, Eye, RefreshCw, Share2, Settings, MoreVertical } from 'lucide-react';
import type { DashboardProject } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ProjectCardProps {
  project: DashboardProject;
  onViewDocs: (projectId: string) => void;
  onRegenerate: (projectId: string) => void;
  onShare: (projectId: string) => void;
}

export const ProjectCard = ({ project, onViewDocs, onRegenerate, onShare }: ProjectCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusConfig = () => {
    switch (project.status) {
      case 'ready':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          label: 'Ready',
        };
      case 'analyzing':
        return {
          bg: 'bg-cyan-50',
          text: 'text-cyan-700',
          border: 'border-cyan-200',
          label: 'Analyzing...',
        };
      case 'needs_update':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          label: 'Needs Update',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200',
          label: 'Error',
        };
    }
  };

  const statusConfig = getStatusConfig();

  const getProviderIcon = () => {
    switch (project.repository.provider) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'gitlab':
        return <Gitlab className="h-4 w-4" />;
      case 'upload':
        return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {project.name}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">{project.description}</p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreVertical className="h-5 w-5 text-slate-400" />
        </button>
      </div>

      {/* Repository Info */}
      <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
        {getProviderIcon()}
        <span className="truncate">{project.repository.url || 'Uploaded files'}</span>
        {project.repository.branch && (
          <>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{project.repository.branch}</span>
          </>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <TrendingUp className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-medium text-slate-600">Quality</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{project.qualityScore}<span className="text-sm text-slate-500">/100</span></p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <FileText className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-slate-600">Progress</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{project.progress}<span className="text-sm text-slate-500">%</span></p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Eye className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-medium text-slate-600">Insights</span>
          </div>
          <p className="text-xl font-bold text-slate-900">{project.insights.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-600">Documentation Progress</span>
          <span className="text-xs text-slate-500">{project.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {/* Collaborators */}
          <div className="flex -space-x-2">
            {project.collaborators.slice(0, 3).map((user, idx) => (
              <div
                key={user.id}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                title={user.name}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
            ))}
            {project.collaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 text-xs font-medium">
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>
          {/* Last Updated */}
          <div className="flex items-center gap-1 text-xs text-slate-500 ml-2">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(project.lastUpdated), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : -10 }}
          className="flex items-center gap-2"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDocs(project.id);
            }}
            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Docs
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(project.id);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(project.id);
            }}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="h-4 w-4 text-slate-600" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
