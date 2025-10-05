import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FolderGit2, Users, MessageSquare, TrendingUp, FileCode,
  Bell, Search, Settings, LogOut, Plus, Grid, List, GitBranch,
  Eye, Trash2, Archive, Clock, Activity, BarChart3, Zap,
  Download, Share2, ChevronRight, Sparkles, Brain, Code2,
  Loader2, Check, AlertCircle, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService, projectService, analysisService } from '../../services';
import { useSocket } from '../../hooks/useSocket';
import type { Project, UserStats } from '../../types/api';

export default function CompleteDashboard() {
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
    setupSocketListeners();
  }, []);

  const setupSocketListeners = () => {
    // Listen for analysis progress
    socket.onAnalysisProgress((data: any) => {
      addNotification({
        type: 'info',
        title: 'Analysis Progress',
        message: `${data.progress}% complete`,
        icon: Brain,
      });
    });

    socket.onAnalysisComplete((data: any) => {
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your project analysis is ready!',
        icon: Check,
      });
      loadDashboardData();
    });

    socket.onUserJoined((data: any) => {
      setOnlineUsers(prev => [...prev, data]);
      addNotification({
        type: 'info',
        title: 'User Joined',
        message: `${data.userName} joined`,
        icon: Users,
      });
    });

    socket.onUserLeft((data: any) => {
      setOnlineUsers(prev => prev.filter((u: any) => u.userId !== data.userId));
    });
  };

  const addNotification = (notification: any) => {
    const id = Date.now();
    setNotifications(prev => [{ ...notification, id }, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [userData, statsResponse, projectsData] = await Promise.all([
        authService.getProfile(),
        authService.getUserStats(),
        projectService.getProjects({ page: 1, limit: 12 })
      ]);
      
      console.log('📊 Dashboard Data:', { userData, statsResponse, projectsData });
      
      setUser(userData);
      setStats(statsResponse.data || null);
      
      // Ensure projects is always an array
      if (Array.isArray(projectsData.data)) {
        setProjects(projectsData.data);
      } else if (projectsData.data && Array.isArray(projectsData.data.projects)) {
        // Backend might return { projects: [], total: X, page: Y }
        setProjects(projectsData.data.projects);
      } else {
        console.warn('⚠️ Projects data is not an array:', projectsData);
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // If we get a 401, the interceptor will handle redirect
      // For other errors, show a notification
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status !== 401) {
          addNotification({
            type: 'error',
            title: 'Error Loading Data',
            message: 'Failed to load dashboard data. Please refresh the page.',
            icon: AlertTriangle,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] font-['Inter']">
      {/* Notifications */}
      <NotificationStack notifications={notifications} />
      
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} onlineUsers={onlineUsers} />

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Header */}
        <Header user={user} notificationCount={notifications.length} />

        {/* Dashboard Content */}
        <main className="p-8">
          {/* Welcome Section */}
          <WelcomeSection user={user} />

          {/* Stats Cards */}
          <StatsGrid stats={stats} />

          {/* Quick Actions */}
          <QuickActions
            onUpload={() => setShowUploadModal(true)}
            onGitHub={() => setShowGitHubModal(true)}
          />

          {/* Projects Section */}
          <ProjectsSection
            projects={projects}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onProjectClick={setSelectedProject}
            onRefresh={loadDashboardData}
          />
        </main>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={loadDashboardData}
      />
      <GitHubImportModal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        onSuccess={loadDashboardData}
      />
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

// ==================== NOTIFICATION STACK ====================
function NotificationStack({ notifications }: { notifications: any[] }) {
  return (
    <div className="fixed top-20 right-6 z-[100] space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notif: any) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`bg-white rounded-xl border-l-4 ${
              notif.type === 'success'
                ? 'border-emerald-500'
                : notif.type === 'error'
                ? 'border-red-500'
                : 'border-blue-500'
            } shadow-lg p-4 flex items-start gap-3`}
          >
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                notif.type === 'success'
                  ? 'bg-emerald-50'
                  : notif.type === 'error'
                  ? 'bg-red-50'
                  : 'bg-blue-50'
              }`}
            >
              {notif.icon && <notif.icon
                className={`w-5 h-5 ${
                  notif.type === 'success'
                    ? 'text-emerald-600'
                    : notif.type === 'error'
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`}
              />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{notif.title}</p>
              <p className="text-sm text-gray-600">{notif.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({ onLogout, onlineUsers }: { onLogout: () => void; onlineUsers: any[] }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Grid, badge: null as string | number | null },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: null as string | number | null },
    { id: 'analysis', label: 'Analysis', icon: Brain, badge: 'AI' as string | number | null },
    { id: 'diagrams', label: 'Diagrams', icon: GitBranch, badge: null as string | number | null },
    { id: 'collaboration', label: 'Collaboration', icon: Users, badge: onlineUsers.length || null },
    { id: 'activity', label: 'Activity', icon: Activity, badge: null as string | number | null },
  ];

  return (
    <motion.aside
      initial={{ x: -264 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">VisualDocs</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-emerald-50 text-emerald-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="flex-1 text-left font-medium">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-violet-600 text-white">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}

// ==================== HEADER ====================
function Header({ user, notificationCount }: { user: any; notificationCount: number }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, files, or analysis..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all">
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-all">
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==================== WELCOME SECTION ====================
function WelcomeSection({ user }: { user: any }) {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {greeting}, {user?.name?.split(' ')[0] || 'there'}! 👋
      </h1>
      <p className="text-gray-600">Here's what's happening with your projects today</p>
    </div>
  );
}

// ==================== STATS GRID ====================
function StatsGrid({ stats }: { stats: UserStats | null }) {
  const statCards = [
    {
      label: 'Total Projects',
      value: stats?.totalProjects || 0,
      change: '+12.5%',
      icon: FolderGit2,
      color: 'emerald',
    },
    {
      label: 'Active Analysis',
      value: stats?.totalAnalyses || 0,
      change: '+8.3%',
      icon: Brain,
      color: 'violet',
    },
    {
      label: 'Diagrams Created',
      value: stats?.totalDiagrams || 0,
      change: '+15.2%',
      icon: GitBranch,
      color: 'amber',
    },
    {
      label: 'Collaborators',
      value: 0,
      change: '+2',
      icon: Users,
      color: 'blue',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              {stat.change}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ==================== QUICK ACTIONS ====================
function QuickActions({
  onUpload,
  onGitHub,
}: {
  onUpload: () => void;
  onGitHub: () => void;
}) {
  const actions = [
    {
      label: 'Upload Project',
      description: 'Upload files or folders',
      icon: Upload,
      onClick: onUpload,
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Import from GitHub',
      description: 'Connect your repository',
      icon: GitBranch,
      onClick: onGitHub,
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      label: 'AI Analysis',
      description: 'Analyze code quality',
      icon: Brain,
      onClick: () => {},
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      label: 'Generate Diagram',
      description: 'Visualize architecture',
      icon: GitBranch,
      onClick: () => {},
      gradient: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={action.onClick}
          className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all overflow-hidden"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
          ></div>
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>
          <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </motion.button>
      ))}
    </div>
  );
}

// ==================== PROJECTS SECTION ====================
function ProjectsSection({
  projects,
  viewMode,
  onViewModeChange,
  onProjectClick,
  onRefresh,
}: {
  projects: Project[];
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onProjectClick: (project: Project) => void;
  onRefresh: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
          <p className="text-sm text-gray-600 mt-1">{projects.length} total projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewMode={viewMode}
              onClick={() => onProjectClick(project)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No projects yet. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== PROJECT CARD ====================
function ProjectCard({
  project,
  viewMode,
  onClick,
}: {
  project: Project;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center">
          <FolderGit2 className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2">
          {project.isGitHubImport && (
            <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
              GitHub
            </span>
          )}
          <button className="p-1.5 rounded-lg hover:bg-gray-100">
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description || 'No description provided'}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FileCode className="w-3.5 h-3.5" />
            {project.languages?.[0] || 'N/A'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

// ==================== MODALS ====================
function UploadModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !files) return;

    try {
      setUploading(true);
      // Create project first
      const projectResponse = await projectService.createProject({ name, description });
      const project = projectResponse.data;

      if (!project) {
        throw new Error('Failed to create project');
      }

      // Upload files
      const filesArray = Array.from(files);
      await projectService.uploadFiles(project.id, filesArray);

      onSuccess();
      onClose();
      setName('');
      setDescription('');
      setFiles(null);
    } catch (error: any) {
      alert(error.userMessage || 'Failed to upload project');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Files *
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 transition-colors"
              required
            />
            {files && (
              <p className="text-sm text-gray-600 mt-2">{files.length} files selected</p>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-violet-600 text-white hover:shadow-lg disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function GitHubImportModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [repoUrl, setRepoUrl] = useState('');
  const [importing, setImporting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;

    try {
      setImporting(true);
      await projectService.importFromGitHub({ githubUrl: repoUrl });
      onSuccess();
      onClose();
      setRepoUrl('');
    } catch (error: unknown) {
      const err = error as { userMessage?: string };
      alert(err.userMessage || 'Failed to import from GitHub');
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Import from GitHub</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Repository URL *
            </label>
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter the full GitHub repository URL
            </p>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={importing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-violet-600 text-white hover:shadow-lg disabled:opacity-50"
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'files' | 'analysis' | 'diagrams'>('files');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          {['files', 'analysis', 'diagrams'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'files' && <FilesTab projectId={project.id} />}
          {activeTab === 'analysis' && <AnalysisTab projectId={project.id} />}
          {activeTab === 'diagrams' && <DiagramsTab projectId={project.id} />}
        </div>
      </motion.div>
    </div>
  );
}

// Tab Components
function FilesTab({ projectId }: { projectId: string }) {
  return <div className="text-gray-600">Files for project {projectId}</div>;
}

function AnalysisTab({ projectId }: { projectId: string }) {
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      await analysisService.analyzeProject(projectId);
      alert('Analysis started successfully!');
    } catch (error: any) {
      alert(error.userMessage || 'Failed to start analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-violet-600 text-white hover:shadow-lg disabled:opacity-50"
      >
        {analyzing ? 'Analyzing...' : 'Start AI Analysis'}
      </button>
    </div>
  );
}

function DiagramsTab({ projectId }: { projectId: string }) {
  return <div className="text-gray-600">Diagrams for project {projectId}</div>;
}
