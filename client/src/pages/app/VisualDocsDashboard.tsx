import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  FolderKanban,
  FileText,
  Sparkles,
  Users,
  LayoutDashboard,
  Target,
  BarChart3,
  Share2,
  Menu,
  X,
  Github,
  Upload,
  Code2,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { DashboardProject, DashboardStats, AIInsight, ActivityItem } from '@/types/dashboard';
import { projectService } from '@/services/project';
import { useSocket } from '@/hooks/useSocket';

export const VisualDocsDashboard = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    docsGenerated: 0,
    aiInsights: 0,
    teamCollaborators: 0,
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ready' | 'analyzing' | 'needs_update'>('all');

  // Load projects and data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (socket) {
      socket.onProjectUpdate?.((data: any) => {
        // Update project in list
        setProjects(prev => prev.map(p => p.id === data.projectId ? { ...p, ...data.updates } : p));
      });

      socket.onNewInsight?.((insight: AIInsight) => {
        setInsights(prev => [insight, ...prev].slice(0, 5));
      });
    }
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      const projectsData = response.data.items;

      // Transform backend projects to dashboard format
      const transformedProjects: DashboardProject[] = projectsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: getProjectStatus(p),
        progress: calculateProgress(p),
        qualityScore: calculateQualityScore(p),
        docsGenerated: p.documentation?.length || 0,
        lastUpdated: p.updatedAt,
        repository: {
          provider: 'github',
          url: p.repositoryUrl,
          branch: 'main',
          connected: !!p.repositoryUrl,
        },
        collaborators: p.members || [],
        insights: [],
        thumbnail: p.thumbnail,
      }));

      setProjects(transformedProjects);

      // Calculate stats
      const calculatedStats: DashboardStats = {
        totalProjects: transformedProjects.length,
        docsGenerated: transformedProjects.reduce((sum, p) => sum + p.docsGenerated, 0),
        aiInsights: transformedProjects.reduce((sum, p) => sum + p.insights.length, 0),
        teamCollaborators: new Set(transformedProjects.flatMap(p => p.collaborators.map(c => c.id))).size,
      };
      setStats(calculatedStats);

      // Generate mock insights (replace with real API call)
      setInsights(generateMockInsights(transformedProjects));

      // Generate mock activities (replace with real API call)
      setActivities(generateMockActivities(transformedProjects));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatus = (project: any): DashboardProject['status'] => {
    if (project.status === 'completed') return 'ready';
    if (project.status === 'analyzing' || project.status === 'processing') return 'analyzing';
    if (project.status === 'failed') return 'error';
    return 'needs_update';
  };

  const calculateProgress = (project: any): number => {
    // Simple calculation based on project status
    if (project.status === 'completed') return 100;
    if (project.status === 'processing') return 50;
    return 0;
  };

  const calculateQualityScore = (project: any): number => {
    // Mock calculation - replace with real quality metrics
    return Math.floor(Math.random() * 30) + 70; // 70-100
  };

  const generateMockInsights = (projects: DashboardProject[]): AIInsight[] => {
    if (projects.length === 0) return [];
    
    return [
      {
        id: '1',
        type: 'suggestion',
        title: '5 functions need better documentation',
        description: `Found in ${projects[0]?.name || 'your project'}`,
        priority: 'medium',
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'success',
        title: 'Great job! Code quality improved by 15%',
        description: 'Keep up the good work',
        priority: 'low',
        createdAt: new Date(),
      },
      {
        id: '3',
        type: 'warning',
        title: 'Consider splitting large files',
        description: 'UserService.js has grown too large',
        priority: 'high',
        createdAt: new Date(),
      },
    ];
  };

  const generateMockActivities = (projects: DashboardProject[]): ActivityItem[] => {
    if (projects.length === 0) return [];

    return [
      {
        id: '1',
        type: 'generated',
        projectName: projects[0]?.name || 'Project',
        description: 'Generated architecture diagram',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
      },
      {
        id: '2',
        type: 'insight',
        projectName: projects[0]?.name || 'Project',
        description: 'AI found 12 improvement suggestions',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
    ];
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewDocs = (projectId: string) => {
    navigate(`/app/projects/${projectId}`);
  };

  const handleRegenerate = (projectId: string) => {
    // Implement regeneration logic
    console.log('Regenerating docs for project:', projectId);
  };

  const handleShare = (projectId: string) => {
    // Implement share logic
    console.log('Sharing project:', projectId);
  };

  const handleImportGithub = () => {
    // Implement GitHub import
    console.log('Import from GitHub');
  };

  const handleUploadFiles = () => {
    // Implement file upload
    console.log('Upload files');
  };

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
            className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-slate-200 z-40"
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">VisualDocs</span>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-medium transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate('/app/projects')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <FolderKanban className="h-5 w-5" />
                  My Projects
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                  <Users className="h-5 w-5" />
                  Team Projects
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                  <Target className="h-5 w-5" />
                  AI Analysis
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                  <BarChart3 className="h-5 w-5" />
                  Diagram Generator
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors">
                  <Share2 className="h-5 w-5" />
                  Exports & Sharing
                </button>
                <button 
                  onClick={() => navigate('/app/settings')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </button>
              </nav>

              {/* User Profile */}
              <div className="px-4 py-4 border-t border-slate-200">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    U
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-slate-900">User Name</p>
                    <p className="text-xs text-slate-500">user@example.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/30">
                <Plus className="h-5 w-5" />
                New Project
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button 
                onClick={() => navigate('/app/settings')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FolderKanban}
              title="Projects Analyzed"
              value={stats.totalProjects}
              trend={{ value: 12.5, isPositive: true }}
              iconColor="text-indigo-600"
              iconBg="bg-indigo-100"
            />
            <StatCard
              icon={FileText}
              title="Docs Generated"
              value={stats.docsGenerated}
              trend={{ value: 8.2, isPositive: true }}
              iconColor="text-green-600"
              iconBg="bg-green-100"
            />
            <StatCard
              icon={Sparkles}
              title="AI Insights"
              value={stats.aiInsights}
              trend={{ value: 5.1, isPositive: false }}
              iconColor="text-purple-600"
              iconBg="bg-purple-100"
            />
            <StatCard
              icon={Users}
              title="Team Collaborators"
              value={stats.teamCollaborators}
              trend={{ value: 3.8, isPositive: true }}
              iconColor="text-cyan-600"
              iconBg="bg-cyan-100"
            />
          </div>

          {/* Filter Tabs */}
          {projects.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setFilterStatus('ready')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'ready'
                    ? 'bg-green-100 text-green-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Ready
              </button>
              <button
                onClick={() => setFilterStatus('analyzing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'analyzing'
                    ? 'bg-cyan-100 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Analyzing
              </button>
              <button
                onClick={() => setFilterStatus('needs_update')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === 'needs_update'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Needs Update
              </button>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                </div>
              ) : filteredProjects.length === 0 && !searchQuery ? (
                <EmptyState
                  onImportGithub={handleImportGithub}
                  onUploadFiles={handleUploadFiles}
                />
              ) : filteredProjects.length === 0 && searchQuery ? (
                <div className="text-center py-20">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects found</h3>
                  <p className="text-slate-600">Try adjusting your search or filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDocs={handleViewDocs}
                      onRegenerate={handleRegenerate}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <AIInsightsPanel insights={insights} />
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
