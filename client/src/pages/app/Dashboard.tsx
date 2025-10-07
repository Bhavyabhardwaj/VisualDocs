import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FolderGit2, Search, Plus, FileCode, Users, Settings, LogOut,
  MoreHorizontal, Star, LayoutDashboard, X, Eye, Trash2,
  Activity, BarChart3, Brain
} from 'lucide-react';
import { authService, projectService, analysisService } from '@/services';
import { useSocket } from '@/hooks/useSocket';
import type { Project, UserStats } from '@/types/api';
import { cn } from '@/lib/utils';

// Navigation Item Component
const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}> = ({ icon, label, active, onClick, count }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
    className={cn(
      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all",
      active
        ? "bg-neutral-900 text-white shadow-sm"
        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
    )}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span className={cn(
        "text-xs px-2 py-0.5 rounded-full font-medium",
        active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"
      )}>
        {count}
      </span>
    )}
  </motion.button>
);

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}> = ({ title, value, change, changeType, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-sm transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-neutral-600">{title}</p>
        <p className="text-2xl font-semibold text-neutral-900">{value}</p>
        <p className={cn(
          "text-sm font-medium",
          changeType === 'positive' ? "text-green-600" : "text-red-600"
        )}>
          {change}
        </p>
      </div>
      <div className="w-12 h-12 bg-neutral-50 rounded-lg flex items-center justify-center">
        {icon}
      </div>
    </div>
  </motion.div>
);

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onView: () => void;
  onDelete: () => void;
}> = ({ project, onView, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -2 }}
    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <FileCode className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral-900">{project.name}</h3>
          <p className="text-sm text-neutral-600">{project.description}</p>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-1">
          <button
            onClick={onView}
            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-4">
        <span className="text-neutral-600">{project.language}</span>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-neutral-600">{project.stars || 0}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={cn(
          "w-2 h-2 rounded-full",
          project.status === 'analyzing' ? "bg-yellow-400 animate-pulse" : "bg-green-400"
        )} />
        <span className="text-neutral-500">{project.updatedAt}</span>
      </div>
    </div>
  </motion.div>
);

// Loading State Component
const LoadingState: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded w-20"></div>
                <div className="h-8 bg-neutral-200 rounded w-16"></div>
                <div className="h-4 bg-neutral-200 rounded w-24"></div>
              </div>
              <div className="w-12 h-12 bg-neutral-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState: React.FC<{ onUpload: () => void; onGitHub: () => void }> = ({ onUpload, onGitHub }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-12"
  >
    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileCode className="w-8 h-8 text-neutral-400" />
    </div>
    <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>
    <p className="text-neutral-600 mb-6">Get started by uploading code or importing from GitHub</p>
    <div className="flex items-center justify-center space-x-3">
      <button
        onClick={onUpload}
        className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Upload Code
      </button>
      <button
        onClick={onGitHub}
        className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        Import from GitHub
      </button>
    </div>
  </motion.div>
);

// Upload Modal Component
const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploading(true);
    
    // Handle file upload
    setTimeout(() => {
      setUploading(false);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Upload Code</h3>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-neutral-300 hover:border-neutral-400"
              )}
            >
              {uploading ? (
                <div className="space-y-4">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-neutral-600">Uploading and analyzing...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Drop your code files here
                    </p>
                    <p className="text-sm text-neutral-600">
                      or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setUploading(true);
                        setTimeout(() => {
                          setUploading(false);
                          onClose();
                        }, 2000);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// GitHub Modal Component
const GitHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) return;
    
    setImporting(true);
    
    // Handle GitHub import
    setTimeout(() => {
      setImporting(false);
      onClose();
      setUrl('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-neutral-900">Import from GitHub</h3>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Repository URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username/repository"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!url.trim() || importing}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {importing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Importing...</span>
                    </>
                  ) : (
                    <>
                      <FolderGit2 className="w-4 h-4" />
                      <span>Import</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [userResponse, projectsResponse, statsResponse] = await Promise.all([
          authService.getCurrentUser(),
          projectService.getProjects(),
          analysisService.getUserStats()
        ]);

        setUser(userResponse.data);
        setProjects(projectsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;

    socket.on('notification', (notification) => {
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    });

    socket.on('userOnline', (users) => {
      setOnlineUsers(users);
    });

    socket.on('projectUpdated', (updatedProject) => {
      setProjects(prev => prev.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ));
    });

    return () => {
      socket.off('notification');
      socket.off('userOnline');
      socket.off('projectUpdated');
    };
  }, [socket]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await projectService.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex">
          <div className="w-64 bg-white border-r border-neutral-200 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-neutral-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-8">
            <LoadingState />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 font-['Inter']">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 bg-white border-r border-neutral-200 flex flex-col"
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">VisualDocs</span>
            </div>

            <nav className="space-y-1">
              <NavItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Dashboard"
                active
              />
              <NavItem
                icon={<FileCode className="w-5 h-5" />}
                label="Projects"
                count={projects.length}
                onClick={() => navigate('/app/projects')}
              />
              <NavItem
                icon={<BarChart3 className="w-5 h-5" />}
                label="Analytics"
                onClick={() => navigate('/app/analytics')}
              />
              <NavItem
                icon={<Users className="w-5 h-5" />}
                label="Team"
                count={onlineUsers.length}
              />
              <NavItem
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
                onClick={() => navigate('/app/settings')}
              />
            </nav>
          </div>

          {/* User Profile */}
          <div className="mt-auto p-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <motion.header
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-b border-neutral-200 px-8 py-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900">
                  Good morning, {user?.name?.split(' ')[0] || 'there'}! 👋
                </h1>
                <p className="text-neutral-600 mt-1">
                  Here's what's happening with your projects today.
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGitHubModal(true)}
                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>Import</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowUploadModal(true)}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Projects"
                    value={stats.totalProjects.toString()}
                    change={`+${stats.projectsThisMonth} this month`}
                    changeType="positive"
                    icon={<FileCode className="w-6 h-6 text-neutral-600" />}
                  />
                  <StatsCard
                    title="Lines of Code"
                    value={stats.totalLinesOfCode?.toLocaleString() || '0'}
                    change={`+${stats.linesAddedThisWeek || 0} this week`}
                    changeType="positive"
                    icon={<Activity className="w-6 h-6 text-neutral-600" />}
                  />
                  <StatsCard
                    title="Code Quality"
                    value={`${stats.averageQualityScore || 0}/100`}
                    change={stats.qualityTrend || '+2 points'}
                    changeType="positive"
                    icon={<BarChart3 className="w-6 h-6 text-neutral-600" />}
                  />
                  <StatsCard
                    title="Active Today"
                    value={onlineUsers.length.toString()}
                    change="team members"
                    changeType="positive"
                    icon={<Users className="w-6 h-6 text-neutral-600" />}
                  />
                </div>
              )}

              {/* Projects Grid */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900">
                      Recent Projects
                    </h2>
                    <p className="text-neutral-600">
                      {filteredProjects.length} of {projects.length} projects
                    </p>
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                      <Activity className="w-4 h-4" />
                      <span>{notifications.length} recent updates</span>
                    </div>
                  )}
                </div>

                {filteredProjects.length === 0 ? (
                  <EmptyState
                    onUpload={() => setShowUploadModal(true)}
                    onGitHub={() => setShowGitHubModal(true)}
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onView={() => navigate(`/app/projects/${project.id}`)}
                        onDelete={() => handleDeleteProject(project.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
      <GitHubModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
      />
    </div>
  );
}
