import { motion } from 'framer-motion';
import { Github, Upload, FileCode, Users } from 'lucide-react';

interface EmptyStateProps {
  onImportGithub: () => void;
  onUploadFiles: () => void;
}

export const EmptyState = ({ onImportGithub, onUploadFiles }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl opacity-10 absolute inset-0 blur-2xl" />
        <div className="relative w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center">
          <FileCode className="h-16 w-16 text-emerald-600" />
        </div>
      </div>

      {/* Content */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Transform Your First Codebase
      </h2>
      <p className="text-slate-600 text-center max-w-md mb-8">
        Turn your code into beautiful, AI-powered documentation in minutes. 
        Connect your repository or upload files to get started.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <button
          onClick={onImportGithub}
          className="flex items-center gap-3 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
        >
          <Github className="h-5 w-5" />
          Import from GitHub
        </button>
        <button
          onClick={onUploadFiles}
          className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <Upload className="h-5 w-5" />
          Upload Files
        </button>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-3">
            <FileCode className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Auto Documentation</h3>
          <p className="text-xs text-slate-600">AI generates comprehensive docs from your code</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
            <TrendingUp className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Code Quality</h3>
          <p className="text-xs text-slate-600">Get insights and improvement suggestions</p>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-3">
            <Users className="h-6 w-6 text-teal-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">Team Collaboration</h3>
          <p className="text-xs text-slate-600">Share and collaborate with your team</p>
        </div>
      </div>
    </motion.div>
  );
};

// Missing import
import { TrendingUp } from 'lucide-react';
