import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Folder,
  GitBranch,
  Clock,
  TrendingUp,
  Users,
  Settings,
  MoreHorizontal,
  FileText,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { projectService } from '@/services/project.service';
import { useSocket } from '@/hooks/useSocket';
import type { DashboardProject, DashboardStats } from '@/types/dashboard';
import { cn } from '@/lib/utils';

export const PremiumRedesignedDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    docsGenerated: 0,
    aiInsights: 0,
    teamCollaborators: 0
  });

  useSocket();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      const projectData = response.data.items || [];
      
      const dashboardProjects: DashboardProject[] = projectData.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        status: (p.analysisStatus || 'ready') as any,
        progress: 100,
        qualityScore: 85,
        docsGenerated: Math.floor(Math.random() * 50) + 10,
        lastUpdated: new Date(p.updatedAt || Date.now()),
        repository: {
          provider: 'github',
          url: p.repositoryUrl,
          branch: 'main',
          connected: true
        },
        collaborators: [],
        insights: []
      }));
      
      setProjects(dashboardProjects);
      setStats({
        totalProjects: dashboardProjects.length,
        docsGenerated: dashboardProjects.reduce((sum, p) => sum + p.docsGenerated, 0),
        aiInsights: dashboardProjects.length * 3,
        teamCollaborators: 5
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'analyzing':
        return <Clock className="h-3 w-3 animate-spin" />;
      case 'needs_update':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-success-muted text-success border-success/20';
      case 'analyzing':
        return 'bg-info-muted text-info border-info/20';
      case 'needs_update':
        return 'bg-warning-muted text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-foreground" />
            <span className="text-sm font-semibold">VisualDocs</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-1.5 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/20 focus:ring-1 focus:ring-foreground/20 transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => navigate('/app/settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>

            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-[1400px] space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              label="Total Projects"
              value={stats.totalProjects}
              icon={<Folder className="h-4 w-4" />}
              trend="+12%"
            />
            <StatCard
              label="Documentation Pages"
              value={stats.docsGenerated}
              icon={<FileText className="h-4 w-4" />}
              trend="+18%"
            />
            <StatCard
              label="AI Insights"
              value={stats.aiInsights}
              icon={<TrendingUp className="h-4 w-4" />}
              trend="+24%"
            />
            <StatCard
              label="Team Members"
              value={stats.teamCollaborators}
              icon={<Users className="h-4 w-4" />}
              trend="+2"
            />
          </div>

          {/* Projects Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Projects</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                View all
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-6 w-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                    getStatusIcon={getStatusIcon}
                    getStatusStyles={getStatusStyles}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onCreateProject={() => console.log('Create project')} />
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Recent Activity</h2>
            <div className="rounded-lg border border-border bg-background">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">Documentation updated</p>
                    <p className="text-xs text-muted-foreground">Project Alpha • 2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ label, value, icon, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-border bg-background p-4 hover:border-foreground/20 transition-colors"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-muted-foreground">{icon}</div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-xs text-success">{trend}</span>
    </div>
  </motion.div>
);

// Project Card Component
const ProjectCard = ({ project, index, onClick, getStatusIcon, getStatusStyles }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    onClick={onClick}
    className="group rounded-lg border border-border bg-background p-4 hover:border-foreground/20 cursor-pointer transition-all"
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
          <Folder className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-medium truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground truncate">{project.description}</p>
        </div>
      </div>
      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>

    {/* Stats */}
    <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        {project.docsGenerated} docs
      </div>
      <div className="flex items-center gap-1">
        <GitBranch className="h-3 w-3" />
        {project.repository.branch}
      </div>
    </div>

    {/* Status */}
    <div className="flex items-center justify-between">
      <div className={cn(
        "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border",
        getStatusStyles(project.status)
      )}>
        {getStatusIcon(project.status)}
        {project.status}
      </div>
      <span className="text-xs text-muted-foreground">
        {new Date(project.lastUpdated).toLocaleDateString()}
      </span>
    </div>
  </motion.div>
);

// Empty State Component
const EmptyState = ({ onCreateProject }: any) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
      <Folder className="h-6 w-6 text-muted-foreground" />
    </div>
    <h3 className="text-sm font-medium mb-1">No projects yet</h3>
    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
      Get started by creating your first project and generating AI-powered documentation
    </p>
    <button
      onClick={onCreateProject}
      className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
    >
      <Plus className="h-4 w-4" />
      Create Project
    </button>
  </div>
);
