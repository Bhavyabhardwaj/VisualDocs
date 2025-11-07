import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  FolderGit2,
  FileText,
  Sparkles,
  Users,
  TrendingUp,
  Clock,
  GitBranch,
  Github,
  Upload,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileUploadDialog } from '@/components/app/FileUploadDialog';
import { GitHubImportDialog } from '@/components/app/GitHubImportDialog';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';

export const WorldClassDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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

  const stats = {
    totalProjects: projects.length,
    docsGenerated: projects.reduce((acc, p) => acc + (p.fileCount || 0), 0),
    aiInsights: 89,
    teamMembers: 8,
  };

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: 'Ready',
        className: 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100',
      },
      analyzing: {
        label: 'Analyzing',
        className: 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100',
      },
      archived: {
        label: 'Archived',
        className: 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100',
      },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={`${config.className} transition-colors`}>{config.label}</Badge>;
  };

  const getQualityScore = (project: Project) => {
    return Math.min(95, 60 + ((project.fileCount || 0) % 35));
  };

  return (
    <PremiumLayout>
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Page Header with Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-primary">Dashboard</h1>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-neutral-600">
                  Welcome back! Here's what's happening with your projects today.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-neutral-300 hover:bg-brand-bg flex-1 sm:flex-none text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedProjectId(projects.length > 0 ? projects[0].id : null);
                    setUploadDialogOpen(true);
                  }}
                >
                  <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Upload Files</span>
                  <span className="xs:hidden">Upload</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-gray-50 flex-1 sm:flex-none text-xs sm:text-sm"
                onClick={() => navigate('/app/analysis')}
              >
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Analytics</span>
                <span className="xs:hidden">Stats</span>
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-sm w-full sm:w-auto text-xs sm:text-sm"
                onClick={() => setGithubDialogOpen(true)}
              >
                <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Import from GitHub</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid - Responsive */}
        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 px-3 sm:px-4 md:px-6 max-w-[1400px] mx-auto">
          <Card
            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/app/projects')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-zinc-600">
                Projects
              </CardTitle>
              <div className="rounded-lg bg-zinc-100 p-1.5 sm:p-2.5">
                <FolderGit2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-zinc-700" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900">{stats.totalProjects}</div>
              <div className="mt-1 sm:mt-2 flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-zinc-600">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium hidden sm:inline">+12% from last month</span>
                <span className="font-medium sm:hidden">+12%</span>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/app/projects')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-zinc-600">Docs</CardTitle>
              <div className="rounded-lg bg-zinc-100 p-1.5 sm:p-2.5">
                <FileText className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-zinc-700" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900">{stats.docsGenerated}</div>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-zinc-600 hidden sm:block">Across all projects</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-zinc-600 sm:hidden">Total</p>
            </CardContent>
          </Card>

          <Card
            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/app/analysis')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">AI Insights</CardTitle>
              <div className="rounded-lg bg-amber-50 p-1.5 sm:p-2.5">
                <Zap className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.aiInsights}</div>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-600 hidden sm:block">Smart suggestions</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-600 sm:hidden">Tips</p>
            </CardContent>
          </Card>

          <Card
            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            onClick={() => navigate('/app/team')}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-zinc-600">Team</CardTitle>
              <div className="rounded-lg bg-zinc-100 p-1.5 sm:p-2.5">
                <Users className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-zinc-700" />
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900">{stats.teamMembers}</div>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-zinc-600 hidden sm:block">Active collaborators</p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-zinc-600 sm:hidden">Members</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section - Responsive */}
        <div className="space-y-4 sm:space-y-5 px-3 sm:px-4 md:px-6 max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900">
                Recent Projects
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                {filteredProjects.length}{' '}
                {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  filterStatus === 'all' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'
                }`}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  filterStatus === 'active'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                Ready
              </Button>
              <Button
                variant={filterStatus === 'analyzing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('analyzing')}
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  filterStatus === 'analyzing'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                Analyzing
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-gray-50 flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-gray-400 mb-3 sm:mb-4" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">Loading your projects...</p>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">This won't take long</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="border-zinc-200 border-2 border-dashed bg-zinc-50/50">
              <CardContent className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
                <div className="rounded-full bg-zinc-100 p-4 sm:p-5 mb-4 sm:mb-5">
                  <FolderGit2 className="h-10 w-10 sm:h-14 sm:w-14 text-zinc-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-zinc-900 mb-1.5 sm:mb-2 text-center">
                  {filterStatus !== 'all'
                    ? 'No projects found'
                    : 'Welcome to VisualDocs!'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 mb-6 sm:mb-8 text-center max-w-md leading-relaxed px-2">
                  {filterStatus !== 'all'
                    ? "Try adjusting your filter criteria to find what you're looking for."
                    : 'Transform your codebase into beautiful documentation. Start by importing your first repository from GitHub or uploading project files.'}
                </p>
                {filterStatus === 'all' && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto px-4 sm:px-0">
                    <Button
                      className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-md w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => setGithubDialogOpen(true)}
                    >
                      <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Import from GitHub
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 hover:bg-gray-50 w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => {
                        setSelectedProjectId(null);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Upload Files
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const qualityScore = getQualityScore(project);
                return (
                  <Card
                    key={project.id}
                    className="group cursor-pointer border-zinc-200 hover:shadow-xl hover:border-zinc-300 transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                  >
                    <CardHeader className="pb-3 p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="rounded-lg bg-zinc-900 p-2 sm:p-2.5 shadow-sm">
                          <FolderGit2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        {getStatusBadge(project.status || 'active')}
                      </div>
                      <CardTitle className="text-base sm:text-lg font-semibold group-hover:text-zinc-700 transition-colors leading-snug">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-1.5">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                      {/* Quality Score */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-600 font-medium">Code Quality</span>
                          <span className="font-bold text-zinc-900">{qualityScore}%</span>
                        </div>
                        <div className="relative h-2 bg-zinc-100 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-zinc-900 rounded-full transition-all duration-500"
                            style={{ width: `${qualityScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Repository Link */}
                      {project.githubUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                          <GitBranch className="h-3.5 w-3.5" />
                          <span className="truncate font-mono">
                            {project.githubUrl.split('/').pop()}
                          </span>
                        </div>
                      )}

                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{project.fileCount || 0} files</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {formatDistanceToNow(new Date(project.updatedAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Avatars & Action Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          {['AB', 'CD', 'EF', 'GH'].slice(0, 3).map((initials, i) => (
                            <Avatar
                              key={i}
                              className="h-7 w-7 border-2 border-white ring-1 ring-gray-200"
                            >
                              <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                            +5
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        {projects.length > 0 && (
          <div className="mt-10">
            <Card className="border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
                    <CardDescription className="text-sm mt-0.5">
                      Smart recommendations powered by AI
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/app/analysis')}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Documentation coverage improved
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your latest projects have 23% better documentation coverage compared to
                        last month
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/app/projects')}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        3 projects need attention
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Consider regenerating documentation for projects updated more than 30 days
                        ago
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate('/app/diagrams')}
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Try AI diagram generation
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Generate beautiful architecture diagrams automatically from your codebase
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        </div>

        {/* Dialogs */}
        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          projectId={selectedProjectId}
          onUploadComplete={loadProjects}
        />

        <GitHubImportDialog
          open={githubDialogOpen}
          onOpenChange={setGithubDialogOpen}
          onImportComplete={(projectId) => {
            loadProjects();
            navigate(`/app/projects/${projectId}`);
          }}
        />
    </PremiumLayout>
  );
};
