import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, FileText, Sparkles, Users, TrendingUp, 
  Clock, GitBranch, Settings, Plus, Search, Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

export const ShadcnDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Load projects from backend
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data.items || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats from projects
  const stats = {
    totalProjects: projects.length,
    docsGenerated: projects.reduce((acc, p) => acc + (p.fileCount || 0), 0),
    aiInsights: Math.floor(Math.random() * 50) + 20, // Mock for now
    teamMembers: 8, // Mock for now
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>;
      case 'analyzing':
        return <Badge className="bg-blue-500/10 text-blue-700 border-blue-200">Analyzing</Badge>;
      case 'archived':
        return <Badge className="bg-neutral-500/10 text-neutral-700 border-neutral-200">Archived</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold">VisualDocs</h1>
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium">Projects</button>
                <button className="text-sm text-neutral-600">Analytics</button>
                <button className="text-sm text-neutral-600">Team</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Avatar className="h-8 w-8">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight mb-2">Projects</h2>
          <p className="text-neutral-600">Manage your documentation projects and AI insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Analyzed</CardTitle>
              <FolderGit2 className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-neutral-600 mt-1">
                <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Docs Generated</CardTitle>
              <FileText className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.docsGenerated}</div>
              <p className="text-xs text-neutral-600 mt-1">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
              <Sparkles className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiInsights}</div>
              <p className="text-xs text-neutral-600 mt-1">
                Suggestions generated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-neutral-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teamMembers}</div>
              <p className="text-xs text-neutral-600 mt-1">
                Active collaborators
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="ghost" size="sm">Ready</Button>
            <Button variant="ghost" size="sm">Analyzing</Button>
            <Button variant="ghost" size="sm">Failed</Button>
          </div>
          <Button onClick={() => navigate('/app/projects/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full mx-auto mb-4" />
            <p className="text-neutral-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <h3 className="font-semibold mb-2">No projects yet</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Get started by creating your first project
            </p>
            <Button onClick={() => navigate('/app/projects/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/app/projects/${project.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description || 'No description'}
                      </CardDescription>
                    </div>
                    {getStatusBadge(project.status || 'active')}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Repository Info */}
                    {project.githubUrl && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <GitBranch className="h-4 w-4" />
                        <span className="truncate">{project.githubUrl.split('/').pop()}</span>
                      </div>
                    )}

                    {/* Metrics */}
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        <span>{project.fileCount || 0} files</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Team Avatars */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-white">
                          <AvatarFallback className="text-xs">SM</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-xs text-neutral-600">2 members</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
