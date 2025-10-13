import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderGit2, FileText, Sparkles, Users, TrendingUp, 
  Clock, GitBranch, Plus, Search, Bell, Github,
  Upload, BarChart3, CheckCircle2, AlertCircle, Loader2,
  Filter, ArrowUpRight, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

export const WorldClassDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
      analyzing: { label: 'Analyzing', className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
      archived: { label: 'Archived', className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={`${config.className} transition-colors`}>{config.label}</Badge>;
  };

  const getQualityScore = (project: Project) => {
    return Math.min(95, 60 + (project.fileCount || 0) % 35);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Navigation */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight">VisualDocs</span>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" size="sm" className="font-medium text-gray-900">
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Projects
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Team
                </Button>
              </nav>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                  <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">
                  JD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Page Header with Quick Actions */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back! Here's what's happening with your projects today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </Button>
              <Button size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-sm">
                <Github className="h-4 w-4" />
                Import from GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Projects Analyzed</CardTitle>
              <div className="rounded-lg bg-blue-50 p-2.5">
                <FolderGit2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-medium">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Docs Generated</CardTitle>
              <div className="rounded-lg bg-purple-50 p-2.5">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.docsGenerated}</div>
              <p className="mt-2 text-xs text-gray-600">Across all projects</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.aiInsights}</div>
              <p className="mt-2 text-xs text-gray-600">Smart suggestions</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>
              <p className="mt-2 text-xs text-gray-600">Active collaborators</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Recent Projects</h2>
              <p className="text-sm text-gray-600 mt-1">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                Ready
              </Button>
              <Button
                variant={filterStatus === 'analyzing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('analyzing')}
                className={filterStatus === 'analyzing' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                Analyzing
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button variant="outline" size="icon" className="hover:bg-gray-50">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />
              <p className="text-sm font-medium text-gray-600">Loading your projects...</p>
              <p className="text-xs text-gray-500 mt-1">This won't take long</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <Card className="border-gray-200 border-2 border-dashed bg-gray-50/50">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-5 mb-5">
                  <FolderGit2 className="h-14 w-14 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'Welcome to VisualDocs!'}
                </h3>
                <p className="text-sm text-gray-600 mb-8 text-center max-w-md leading-relaxed">
                  {searchQuery || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Transform your codebase into beautiful documentation. Start by importing your first repository from GitHub or uploading project files.'}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <div className="flex items-center gap-3">
                    <Button className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-md">
                      <Github className="h-4 w-4" />
                      Import from GitHub
                    </Button>
                    <Button variant="outline" className="gap-2 hover:bg-gray-50">
                      <Upload className="h-4 w-4" />
                      Upload Files
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const qualityScore = getQualityScore(project);
                return (
                  <Card
                    key={project.id}
                    className="group cursor-pointer border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 hover:scale-[1.02]"
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2.5 shadow-sm">
                          <FolderGit2 className="h-5 w-5 text-white" />
                        </div>
                        {getStatusBadge(project.status || 'active')}
                      </div>
                      <CardTitle className="text-lg font-semibold group-hover:text-blue-600 transition-colors leading-snug">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-1.5">
                        {project.description || 'No description provided'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Quality Score with gradient */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">Code Quality</span>
                          <span className="font-bold text-gray-900">{qualityScore}%</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                            style={{ width: `${qualityScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Repository Link */}
                      {project.githubUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors">
                          <GitBranch className="h-3.5 w-3.5" />
                          <span className="truncate font-mono">{project.githubUrl.split('/').pop()}</span>
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
                            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Team Avatars & Action Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          {['AB', 'CD', 'EF', 'GH'].slice(0, 3).map((initials, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white ring-1 ring-gray-200">
                              <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                            +5
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100">
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
                    <CardDescription className="text-sm mt-0.5">Smart recommendations powered by AI</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Documentation coverage improved
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your latest projects have 23% better documentation coverage compared to last month
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        3 projects need attention
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Consider regenerating documentation for projects updated more than 30 days ago
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
      </main>
    </div>
  );
};
