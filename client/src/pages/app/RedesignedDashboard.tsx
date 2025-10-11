import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  Plus,
  Menu,
  X,
  Code2,
  LayoutDashboard,
  Folder,
  Users,
  Target,
  Share2,
  Cog,
  Download
} from 'lucide-react';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { QuickActionsCenter } from '@/components/dashboard/QuickActionsCenter';
import { ProjectStatus, DashboardStats, AIInsight, ActivityItem, QualityTrend } from '@/types/dashboard';
import { cn } from '@/lib/utils';
import { projectService } from '@/services/project.service';
import { useSocket } from '@/hooks/useSocket';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'analyzing' | 'needs_update'>('all');
  const [projects, setProjects] = useState<ProjectStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    docsGenerated: 0,
    aiInsights: 0,
    teamCollaborators: 0
  });

  // Socket connection for real-time updates
  const socket = useSocket({
    onProjectUpdate: (data: any) => {
      console.log('Project updated:', data);
      loadProjects();
    },
    onAnalysisComplete: (data: any) => {
      console.log('Analysis complete:', data);
      loadProjects();
    }
  });

  // Mock data for demonstration
  const mockProjects: ProjectStatus[] = [
    {
      id: '1',
      name: 'E-Commerce Platform',
      description: 'Full-stack Next.js application with Stripe integration',
      status: 'ready',
      progress: 100,
      qualityScore: 92,
      docsGenerated: 45,
      lastUpdated: new Date('2025-10-10'),
      repository: {
        provider: 'github',
        url: 'https://github.com/user/ecommerce',
        branch: 'main',
        connected: true
      },
      collaborators: [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
      ],
      insights: []
    },
    {
      id: '2',
      name: 'Mobile Banking App',
      description: 'React Native application for iOS and Android',
      status: 'analyzing',
      progress: 67,
      qualityScore: 85,
      docsGenerated: 28,
      lastUpdated: new Date('2025-10-11'),
      repository: {
        provider: 'gitlab',
        url: 'https://gitlab.com/user/banking-app',
        branch: 'develop',
        connected: true
      },
      collaborators: [
        { id: '1', name: 'Alice Cooper', email: 'alice@example.com' },
        { id: '2', name: 'Charlie Brown', email: 'charlie@example.com' }
      ],
      insights: []
    },
    {
      id: '3',
      name: 'CRM Dashboard',
      description: 'Enterprise customer relationship management system',
      status: 'needs_update',
      progress: 100,
      qualityScore: 78,
      docsGenerated: 62,
      lastUpdated: new Date('2025-10-08'),
      repository: {
        provider: 'github',
        url: 'https://github.com/company/crm',
        branch: 'main',
        connected: true
      },
      collaborators: [
        { id: '1', name: 'David Lee', email: 'david@example.com' },
        { id: '2', name: 'Emma Wilson', email: 'emma@example.com' },
        { id: '3', name: 'Frank Martin', email: 'frank@example.com' },
        { id: '4', name: 'Grace Taylor', email: 'grace@example.com' }
      ],
      insights: []
    }
  ];

  const mockInsights: AIInsight[] = [
    {
      id: '1',
      type: 'warning',
      title: '5 functions need better documentation',
      description: 'UserService.js has complex functions without JSDoc comments',
      priority: 'high',
      createdAt: new Date(),
      actionable: true
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Consider splitting large files',
      description: 'UserService.js is 850 lines. Consider breaking it into smaller modules',
      priority: 'medium',
      createdAt: new Date(),
      actionable: true
    },
    {
      id: '3',
      type: 'success',
      title: 'Great job! Code quality improved by 15%',
      description: 'Your refactoring efforts are paying off',
      priority: 'low',
      createdAt: new Date(),
      actionable: false
    },
    {
      id: '4',
      type: 'info',
      title: 'New dependency detected',
      description: 'Update security documentation for axios v1.6.0',
      priority: 'medium',
      createdAt: new Date(),
      actionable: true
    }
  ];

  const mockActivity: ActivityItem[] = [
    {
      id: '1',
      type: 'generated',
      message: 'Generated architecture diagram for E-Commerce Platform',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      projectId: '1'
    },
    {
      id: '2',
      type: 'insight',
      message: 'AI found 12 improvement suggestions in Mobile Banking App',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      projectId: '2'
    },
    {
      id: '3',
      type: 'collaboration',
      message: 'Team member added comments to API docs',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      userId: '2'
    },
    {
      id: '4',
      type: 'export',
      message: 'Documentation exported as PDF',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      projectId: '1'
    }
  ];

  const mockQualityTrends: QualityTrend[] = [
    { date: 'Mon', score: 75, coverage: 68 },
    { date: 'Tue', score: 78, coverage: 72 },
    { date: 'Wed', score: 82, coverage: 75 },
    { date: 'Thu', score: 85, coverage: 78 },
    { date: 'Fri', score: 88, coverage: 82 },
    { date: 'Sat', score: 90, coverage: 85 },
    { date: 'Sun', score: 92, coverage: 88 }
  ];

  useEffect(() => {
    // Load projects
    setProjects(mockProjects);
    setStats({
      totalProjects: mockProjects.length,
      docsGenerated: mockProjects.reduce((sum, p) => sum + p.docsGenerated, 0),
      aiInsights: mockInsights.length,
      teamCollaborators: 8
    });
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard', active: true },
    { icon: Folder, label: 'My Projects', path: '/app/projects' },
    { icon: Users, label: 'Team Projects', path: '/app/team' },
    { icon: Target, label: 'AI Analysis', path: '/app/analytics' },
    { icon: Share2, label: 'Diagram Generator', path: '/app/diagrams' },
    { icon: Download, label: 'Exports & Sharing', path: '/app/exports' },
    { icon: Cog, label: 'Settings', path: '/app/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-72 bg-white border-r border-slate-200 z-40 overflow-y-auto"
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">VisualDocs</h1>
                  <p className="text-xs text-slate-500">AI Documentation</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      item.active 
                        ? "bg-indigo-50 text-indigo-600" 
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarOpen ? "ml-72" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 backdrop-blur-xl bg-white/80">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Menu Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search */}
              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects, docs, or team members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </button>
                
                <button
                  onClick={() => navigate('/app/settings')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 text-slate-600" />
                </button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow ml-2"
                >
                  <Plus className="h-5 w-5" />
                  New Project
                </motion.button>

                <div className="h-10 w-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-medium ml-2 cursor-pointer">
                  JD
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-[1600px] mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
              <p className="text-slate-600">Welcome back! Here's what's happening with your projects.</p>
            </div>

            {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Projects & Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Filter Tabs */}
                {projects.length > 0 && (
                  <div className="flex items-center gap-2">
                    {(['all', 'ready', 'analyzing', 'needs_update'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                          filterStatus === status
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                        )}
                      >
                        {status === 'all' ? 'All Projects' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </button>
                    ))}
                  </div>
                )}

                {/* Projects Grid or Empty State */}
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onView={(id) => navigate(`/app/projects/${id}`)}
                        onRegenerate={(id) => console.log('Regenerate', id)}
                        onShare={(id) => console.log('Share', id)}
                        onExport={(id) => console.log('Export', id)}
                      />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <EmptyState
                    onImportGitHub={() => console.log('Import from GitHub')}
                    onUploadFiles={() => console.log('Upload files')}
                    onUseTemplate={() => console.log('Use template')}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600">No projects match your search.</p>
                  </div>
                )}

                {/* Quick Actions */}
                {projects.length > 0 && (
                  <QuickActionsCenter
                    recentActivity={mockActivity}
                    onImportGitHub={() => console.log('Import from GitHub')}
                    onUploadCodebase={() => console.log('Upload codebase')}
                    onUseTemplate={() => console.log('Use template')}
                    onJoinTeam={() => console.log('Join team')}
                  />
                )}
              </div>

              {/* Right Column - AI Insights */}
              <div className="lg:col-span-1">
                <AIInsightsPanel 
                  insights={mockInsights} 
                  qualityTrends={mockQualityTrends}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
