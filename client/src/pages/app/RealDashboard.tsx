import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Upload, FileCode, BarChart3,
  Clock, Folder, Activity, ArrowRight, Plus, Github, Search,
  MoreHorizontal, Eye, Trash2, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { FileUploadDialog } from '@/components/app/FileUploadDialog';
import { GitHubImportDialog } from '@/components/app/GitHubImportDialog';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { projectService } from '@/services/project.service';
import { authService } from '@/services/auth.service';
import type { Project, UserStats } from '@/types/api';
import { cn } from '@/lib/utils';

export const RealDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, statsResponse] = await Promise.all([
        projectService.getProjects({ limit: 100 }),
        authService.getUserStats(),
      ]);
      
      setProjects(projectsResponse.data.items || []);
      setStats(statsResponse.data || null);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setProjects([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadDashboardData();
    setUploadDialogOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const getQualityScore = (project: Project) => {
    // Simple quality score based on available data
    const baseScore = 70;
    const fileBonus = Math.min((project.fileCount || 0) * 2, 20);
    const analysisBonus = project.status === 'active' ? 10 : 0;
    return Math.min(baseScore + fileBonus + analysisBonus, 100);
  };

  const filteredProjects = recentProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Dashboard</h1>
                <p className="text-neutral-600 mt-2 text-[15px]">
                  Welcome back! Here's what's happening with your projects.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-9 text-sm">
                  <Github className="w-4 h-4 mr-2" />
                  Import from GitHub
                </Button>
                <Button onClick={() => setUploadDialogOpen(true)} className="h-9 text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto px-8 py-8">
        {/* Stats Grid - Premium Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border border-neutral-200 shadow-sm">
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-10 w-16 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-neutral-100 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-600">Total Projects</p>
                    <div className="text-4xl font-semibold tracking-tight text-neutral-900">
                      {stats.projectCount}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {stats.projectCount > 0 ? 'Active projects' : 'Get started'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Folder className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-600">Diagrams Created</p>
                    <div className="text-4xl font-semibold tracking-tight text-neutral-900">
                      {stats.diagramCount}
                    </div>
                    <p className="text-xs text-neutral-500">
                      Across all projects
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <FileCode className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-600">Analyses Complete</p>
                    <div className="text-4xl font-semibold tracking-tight text-neutral-900">
                      {stats.analysisCount}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {stats.analysisCount > 0 
                        ? `${Math.round((stats.analysisCount / Math.max(stats.projectCount, 1)) * 100)}% completion rate`
                        : 'No analyses yet'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-neutral-200 shadow-sm">
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-neutral-600">Last Activity</p>
                    <div className="text-4xl font-semibold tracking-tight text-neutral-900">
                      {stats.lastActivity 
                        ? formatDistanceToNow(new Date(stats.lastActivity), { addSuffix: false })
                        : 'Never'}
                    </div>
                    <p className="text-xs text-neutral-500">
                      {stats.lastActivity ? 'ago' : 'No activity yet'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Activity className="w-5 h-5 text-neutral-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Recent Projects Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900">Recent Projects</h2>
              <p className="text-neutral-600 text-sm mt-1">
                {recentProjects.length} {recentProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 border-neutral-200 bg-white"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/app/projects')}
                className="h-9 text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse border border-neutral-200">
                  <CardHeader className="pb-3">
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-100 rounded w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-neutral-100 rounded w-1/2" />
                      <div className="h-2 bg-neutral-100 rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="border-2 border-dashed border-neutral-200">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Folder className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                  {searchQuery ? 'No projects found' : 'No projects yet'}
                </h3>
                <p className="text-neutral-600 text-center max-w-md mb-6 text-sm">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by uploading your code or importing from GitHub'}
                </p>
                {!searchQuery && (
                  <div className="flex gap-3">
                    <Button onClick={() => setUploadDialogOpen(true)} className="h-9">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Files
                    </Button>
                    <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-9">
                      <Github className="w-4 h-4 mr-2" />
                      Import from GitHub
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const qualityScore = getQualityScore(project);
                
                return (
                  <Card
                    key={project.id}
                    className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-neutral-200 bg-white"
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate group-hover:text-blue-600 transition-colors font-semibold">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2 mt-1.5 text-sm text-neutral-600">
                            {project.description || 'No description provided'}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/projects/${project.id}`);
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(project.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-neutral-600">
                          <FileCode className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-neutral-900">
                            {project.fileCount || 0}
                          </span>
                          <span className="text-neutral-500">
                            {project.fileCount === 1 ? 'file' : 'files'}
                          </span>
                        </div>
                        <Badge
                          variant={
                            project.status === 'active'
                              ? 'default'
                              : project.status === 'analyzing'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={cn(
                            'text-xs',
                            project.status === 'analyzing' && 'animate-pulse'
                          )}
                        >
                          {project.status === 'active'
                            ? 'Ready'
                            : project.status === 'analyzing'
                            ? 'Analyzing'
                            : project.status || 'Pending'}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-neutral-600">
                          <span className="font-medium">Code Quality</span>
                          <span className="font-semibold text-neutral-900">{qualityScore}%</span>
                        </div>
                        <Progress value={qualityScore} className="h-1.5" />
                      </div>

                      <Separator className="bg-neutral-200" />

                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!loading && projects.length > 0 && (
          <Card className="mt-10 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100">
            <CardContent className="py-8 px-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-neutral-900">Ready to analyze more code?</h3>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Upload new files or import from GitHub to generate comprehensive documentation
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-9">
                    <Github className="w-4 h-4 mr-2" />
                    Import Repository
                  </Button>
                  <Button onClick={() => setUploadDialogOpen(true)} className="h-9">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      {/* Dialogs */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadSuccess}
      />
      <GitHubImportDialog
        open={githubDialogOpen}
        onOpenChange={setGithubDialogOpen}
        onImportComplete={handleUploadSuccess}
      />
    </PremiumLayout>
  );
};