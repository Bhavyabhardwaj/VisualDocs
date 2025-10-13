import { useEffect, useState } from 'react';import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

import { import { 

  FolderGit2, FileText, Sparkles, Users, TrendingUp,   FolderGit2, FileText, Sparkles, Users, TrendingUp, 

  Clock, GitBranch, Plus, Search, Bell, Github,  Clock, GitBranch, Settings, Plus, Search, Bell, Github,

  Upload, BarChart3, CheckCircle2, AlertCircle, Loader2,  Upload, BarChart3, CheckCircle2, AlertCircle, Loader2,

  Filter, ArrowUpRight  Filter, MoreHorizontal, ArrowUpRight

} from 'lucide-react';} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Separator } from '@/components/ui/separator';import { Separator } from '@/components/ui/separator';

import { Input } from '@/components/ui/input';import { Input } from '@/components/ui/input';

import { Progress } from '@/components/ui/progress';import { Progress } from '@/components/ui/progress';

import { projectService } from '@/services/project.service';import { projectService } from '@/services/project.service';

import type { Project } from '@/types/api';import type { Project } from '@/types/api';

import { formatDistanceToNow } from 'date-fns';import { formatDistanceToNow } from 'date-fns';



export const ShadcnDashboard = () => {export const ShadcnDashboard = () => {

  const navigate = useNavigate();  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');  const [searchQuery, setSearchQuery] = useState('');

  const [filterStatus, setFilterStatus] = useState<string>('all');  const [filterStatus, setFilterStatus] = useState<string>('all');



  useEffect(() => {  // Load projects from backend

    loadProjects();  useEffect(() => {

  }, []);    loadProjects();

  }, []);

  const loadProjects = async () => {

    try {  const loadProjects = async () => {

      setLoading(true);    try {

      const response = await projectService.getProjects();      setLoading(true);

      setProjects(response.data.items || []);      const response = await projectService.getProjects();

    } catch (error) {      setProjects(response.data.items || []);

      console.error('Failed to load projects:', error);    } catch (error) {

      setProjects([]);      console.error('Failed to load projects:', error);

    } finally {      setProjects([]);

      setLoading(false);    } finally {

    }      setLoading(false);

  };    }

  };

  const stats = {

    totalProjects: projects.length,  // Calculate real stats from projects

    docsGenerated: projects.reduce((acc, p) => acc + (p.fileCount || 0), 0),  const stats = {

    aiInsights: 89,    totalProjects: projects.length,

    teamMembers: 8,    docsGenerated: projects.reduce((acc, p) => acc + (p.fileCount || 0), 0),

  };    aiInsights: 89,

    teamMembers: 8,

  const filteredProjects = projects.filter(project => {  };

    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());  // Filter projects based on search and status

    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;  const filteredProjects = projects.filter(project => {

    return matchesSearch && matchesFilter;    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

  });                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;

  const getStatusBadge = (status: string) => {    return matchesSearch && matchesFilter;

    const statusConfig = {  });

      active: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },

      analyzing: { label: 'Analyzing', className: 'bg-blue-50 text-blue-700 border-blue-200' },  const getStatusBadge = (status: string) => {

      archived: { label: 'Archived', className: 'bg-gray-50 text-gray-700 border-gray-200' },    const statusConfig = {

    };      active: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;      analyzing: { label: 'Analyzing', className: 'bg-blue-50 text-blue-700 border-blue-200' },

    return <Badge className={config.className}>{config.label}</Badge>;      archived: { label: 'Archived', className: 'bg-gray-50 text-gray-700 border-gray-200' },

  };    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

  const getQualityScore = (project: Project) => {    return <Badge className={config.className}>{config.label}</Badge>;

    return Math.min(95, 60 + (project.fileCount || 0) % 35);  };

  };

  const getQualityScore = (project: Project) => {

  return (    // Mock quality score based on file count

    <div className="min-h-screen bg-white">    return Math.min(95, 60 + (project.fileCount || 0) % 35);

      {/* Premium Header */}  };

      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">

        <div className="mx-auto max-w-7xl px-6">  return (

          <div className="flex h-16 items-center justify-between">    <div className="min-h-screen bg-white">

            {/* Logo & Navigation */}      {/* Premium Header */}

            <div className="flex items-center gap-8">      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">

              <div className="flex items-center gap-2">        <div className="mx-auto max-w-7xl px-6">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">          <div className="flex h-16 items-center justify-between">

                  <Sparkles className="h-4 w-4 text-white" />            {/* Logo & Navigation */}

                </div>            <div className="flex items-center gap-8">

                <span className="text-lg font-semibold tracking-tight">VisualDocs</span>              <div className="flex items-center gap-2">

              </div>                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">

              <nav className="hidden md:flex items-center gap-1">                  <Sparkles className="h-4 w-4 text-white" />

                <Button variant="ghost" size="sm" className="font-medium">                </div>

                  Dashboard                <span className="text-lg font-semibold tracking-tight">VisualDocs</span>

                </Button>              </div>

                <Button variant="ghost" size="sm" className="text-gray-600">              <nav className="hidden md:flex items-center gap-1">

                  Projects                <Button variant="ghost" size="sm" className="font-medium">

                </Button>                  Dashboard

                <Button variant="ghost" size="sm" className="text-gray-600">                </Button>

                  Analytics                <Button variant="ghost" size="sm" className="text-gray-600">

                </Button>                  Projects

                <Button variant="ghost" size="sm" className="text-gray-600">                </Button>

                  Team                <Button variant="ghost" size="sm" className="text-gray-600">

                </Button>                  Analytics

              </nav>                </Button>

            </div>                <Button variant="ghost" size="sm" className="text-gray-600">

                  Team

            {/* Search & Actions */}                </Button>

            <div className="flex items-center gap-3">              </nav>

              <div className="hidden lg:block">            </div>

                <div className="relative">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />            {/* Search & Actions */}

                  <Input            <div className="flex items-center gap-3">

                    placeholder="Search projects..."              <div className="hidden lg:block">

                    value={searchQuery}                <div className="relative">

                    onChange={(e) => setSearchQuery(e.target.value)}                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    className="w-64 pl-9 h-9 bg-gray-50 border-gray-200"                  <Input

                  />                    placeholder="Search projects..."

                </div>                    value={searchQuery}

              </div>                    onChange={(e) => setSearchQuery(e.target.value)}

                                  className="w-64 pl-9 h-9 bg-gray-50 border-gray-200"

              <Button variant="ghost" size="icon" className="relative">                  />

                <Bell className="h-4 w-4" />                </div>

                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />              </div>

              </Button>              

                            <Button variant="ghost" size="icon" className="relative">

              <Separator orientation="vertical" className="h-6" />                <Bell className="h-4 w-4" />

                              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />

              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all">              </Button>

                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">              

                  JD              <Separator orientation="vertical" className="h-6" />

                </AvatarFallback>              

              </Avatar>              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all">

            </div>                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">

          </div>                  JD

        </div>                </AvatarFallback>

      </header>              </Avatar>

            </div>

      {/* Main Content */}          </div>

      <main className="mx-auto max-w-7xl px-6 py-8">        </div>

        {/* Page Header */}      </header>

        <div className="mb-8">

          <div className="flex items-center justify-between">      {/* Main Content */}

            <div>      <main className="mx-auto max-w-7xl px-6 py-8">

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>        {/* Page Header */}

              <p className="mt-1 text-sm text-gray-600">        <div className="mb-8">

                Manage your documentation projects and AI insights          <div className="flex items-center justify-between">

              </p>            <div>

            </div>              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>

            <div className="flex items-center gap-3">              <p className="mt-1 text-sm text-gray-600">

              <Button variant="outline" size="sm" className="gap-2">                Manage your documentation projects and AI insights

                <Upload className="h-4 w-4" />              </p>

                Upload Files            </div>

              </Button>            <div className="flex items-center gap-3">

              <Button variant="outline" size="sm" className="gap-2">              <Button variant="outline" size="sm" className="gap-2">

                <BarChart3 className="h-4 w-4" />                <Upload className="h-4 w-4" />

                View Analytics                Upload Files

              </Button>              </Button>

              <Button size="sm" className="gap-2 bg-black hover:bg-gray-800">              <Button variant="outline" size="sm" className="gap-2">

                <Github className="h-4 w-4" />                <BarChart3 className="h-4 w-4" />

                Import from GitHub                View Analytics

              </Button>              </Button>

            </div>              <Button size="sm" className="gap-2 bg-black hover:bg-gray-800">

          </div>                <Github className="h-4 w-4" />

        </div>                Import from GitHub

              </Button>

        {/* Stats Cards */}            </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">          </div>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">        </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-gray-600">Projects Analyzed</CardTitle>        {/* Stats Cards */}

              <div className="rounded-lg bg-blue-50 p-2">        <div className="mb-8 grid gap-4 md:grid-cols-4">

                <FolderGit2 className="h-4 w-4 text-blue-600" />          <Card className="border-gray-200 hover:shadow-md transition-shadow">

              </div>            <CardHeader className="flex flex-row items-center justify-between pb-2">

            </CardHeader>              <CardTitle className="text-sm font-medium text-gray-600">Projects Analyzed</CardTitle>

            <CardContent>              <div className="rounded-lg bg-blue-50 p-2">

              <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>                <FolderGit2 className="h-4 w-4 text-blue-600" />

              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">              </div>

                <TrendingUp className="h-3 w-3" />            </CardHeader>

                <span className="font-medium">+12% from last month</span>            <CardContent>

              </div>              <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>

            </CardContent>              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">

          </Card>                <TrendingUp className="h-3 w-3" />

                <span className="font-medium">+12% from last month</span>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">              </div>

            <CardHeader className="flex flex-row items-center justify-between pb-2">            </CardContent>

              <CardTitle className="text-sm font-medium text-gray-600">Docs Generated</CardTitle>          </Card>

              <div className="rounded-lg bg-purple-50 p-2">

                <FileText className="h-4 w-4 text-purple-600" />          <Card className="border-gray-200 hover:shadow-md transition-shadow">

              </div>            <CardHeader className="flex flex-row items-center justify-between pb-2">

            </CardHeader>              <CardTitle className="text-sm font-medium text-gray-600">Docs Generated</CardTitle>

            <CardContent>              <div className="rounded-lg bg-purple-50 p-2">

              <div className="text-3xl font-bold text-gray-900">{stats.docsGenerated}</div>                <FileText className="h-4 w-4 text-purple-600" />

              <p className="mt-2 text-xs text-gray-600">Across all projects</p>              </div>

            </CardContent>            </CardHeader>

          </Card>            <CardContent>

              <div className="text-3xl font-bold text-gray-900">{stats.docsGenerated}</div>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">              <p className="mt-2 text-xs text-gray-600">Across all projects</p>

            <CardHeader className="flex flex-row items-center justify-between pb-2">            </CardContent>

              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>          </Card>

              <div className="rounded-lg bg-amber-50 p-2">

                <Sparkles className="h-4 w-4 text-amber-600" />          <Card className="border-gray-200 hover:shadow-md transition-shadow">

              </div>            <CardHeader className="flex flex-row items-center justify-between pb-2">

            </CardHeader>              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>

            <CardContent>              <div className="rounded-lg bg-amber-50 p-2">

              <div className="text-3xl font-bold text-gray-900">{stats.aiInsights}</div>                <Sparkles className="h-4 w-4 text-amber-600" />

              <p className="mt-2 text-xs text-gray-600">Suggestions generated</p>              </div>

            </CardContent>            </CardHeader>

          </Card>            <CardContent>

              <div className="text-3xl font-bold text-gray-900">{stats.aiInsights}</div>

          <Card className="border-gray-200 hover:shadow-md transition-shadow">              <p className="mt-2 text-xs text-gray-600">Suggestions generated</p>

            <CardHeader className="flex flex-row items-center justify-between pb-2">            </CardContent>

              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>          </Card>

              <div className="rounded-lg bg-emerald-50 p-2">

                <Users className="h-4 w-4 text-emerald-600" />          <Card className="border-gray-200 hover:shadow-md transition-shadow">

              </div>            <CardHeader className="flex flex-row items-center justify-between pb-2">

            </CardHeader>              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>

            <CardContent>              <div className="rounded-lg bg-emerald-50 p-2">

              <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>                <Users className="h-4 w-4 text-emerald-600" />

              <p className="mt-2 text-xs text-gray-600">Active collaborators</p>              </div>

            </CardContent>            </CardHeader>

          </Card>            <CardContent>

        </div>              <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>

              <p className="mt-2 text-xs text-gray-600">Active collaborators</p>

        {/* Projects Section */}            </CardContent>

        <div className="space-y-4">          </Card>

          <div className="flex items-center justify-between">        </div>

            <div>            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Recent Projects</h2>              <CardTitle className="text-sm font-medium">AI Insights</CardTitle>

              <p className="text-sm text-gray-600 mt-0.5">              <Sparkles className="h-4 w-4 text-neutral-600" />

                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}            </CardHeader>

              </p>            <CardContent>

            </div>              <div className="text-2xl font-bold">{stats.aiInsights}</div>

            <div className="flex items-center gap-2">              <p className="text-xs text-neutral-600 mt-1">

              <Button                Suggestions generated

                variant={filterStatus === 'all' ? 'default' : 'outline'}              </p>

                size="sm"            </CardContent>

                onClick={() => setFilterStatus('all')}          </Card>

                className={filterStatus === 'all' ? 'bg-black hover:bg-gray-800' : ''}

              >          <Card>

                All            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

              </Button>              <CardTitle className="text-sm font-medium">Team Members</CardTitle>

              <Button              <Users className="h-4 w-4 text-neutral-600" />

                variant={filterStatus === 'active' ? 'default' : 'outline'}            </CardHeader>

                size="sm"            <CardContent>

                onClick={() => setFilterStatus('active')}              <div className="text-2xl font-bold">{stats.teamMembers}</div>

                className={filterStatus === 'active' ? 'bg-black hover:bg-gray-800' : ''}              <p className="text-xs text-neutral-600 mt-1">

              >                Active collaborators

                Ready              </p>

              </Button>            </CardContent>

              <Button          </Card>

                variant={filterStatus === 'analyzing' ? 'default' : 'outline'}        </div>

                size="sm"

                onClick={() => setFilterStatus('analyzing')}        {/* Actions Bar */}

                className={filterStatus === 'analyzing' ? 'bg-black hover:bg-gray-800' : ''}        <div className="flex items-center justify-between mb-6">

              >          <div className="flex gap-2">

                Analyzing            <Button variant="outline" size="sm">All</Button>

              </Button>            <Button variant="ghost" size="sm">Ready</Button>

              <Separator orientation="vertical" className="h-6 mx-1" />            <Button variant="ghost" size="sm">Analyzing</Button>

              <Button variant="outline" size="icon">            <Button variant="ghost" size="sm">Failed</Button>

                <Filter className="h-4 w-4" />          </div>

              </Button>          <Button onClick={() => navigate('/app/projects/new')}>

            </div>            <Plus className="h-4 w-4 mr-2" />

          </div>            New Project

          </Button>

          {loading ? (        </div>

            <div className="flex flex-col items-center justify-center py-16">

              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-4" />        {/* Projects Grid */}

              <p className="text-sm text-gray-600">Loading your projects...</p>        {loading ? (

            </div>          <div className="text-center py-12">

          ) : filteredProjects.length === 0 ? (            <div className="animate-spin h-8 w-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full mx-auto mb-4" />

            <Card className="border-gray-200 border-dashed">            <p className="text-neutral-600">Loading projects...</p>

              <CardContent className="flex flex-col items-center justify-center py-16">          </div>

                <div className="rounded-full bg-gray-50 p-4 mb-4">        ) : projects.length === 0 ? (

                  <FolderGit2 className="h-12 w-12 text-gray-400" />          <Card className="p-12 text-center">

                </div>            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-neutral-400" />

                <h3 className="text-lg font-semibold text-gray-900 mb-2">            <h3 className="font-semibold mb-2">No projects yet</h3>

                  {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}            <p className="text-sm text-neutral-600 mb-4">

                </h3>              Get started by creating your first project

                <p className="text-sm text-gray-600 mb-6 text-center max-w-sm">            </p>

                  {searchQuery || filterStatus !== 'all'             <Button onClick={() => navigate('/app/projects/new')}>

                    ? 'Try adjusting your search or filter criteria'              <Plus className="h-4 w-4 mr-2" />

                    : 'Get started by importing your first repository from GitHub or uploading project files'}              Create Project

                </p>            </Button>

                {!searchQuery && filterStatus === 'all' && (          </Card>

                  <div className="flex items-center gap-3">        ) : (

                    <Button className="gap-2 bg-black hover:bg-gray-800">          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                      <Github className="h-4 w-4" />            {projects.map((project) => (

                      Import from GitHub              <Card

                    </Button>                key={project.id}

                    <Button variant="outline" className="gap-2">                className="hover:shadow-md transition-shadow cursor-pointer"

                      <Upload className="h-4 w-4" />                onClick={() => navigate(`/app/projects/${project.id}`)}

                      Upload Files              >

                    </Button>                <CardHeader>

                  </div>                  <div className="flex items-start justify-between">

                )}                    <div className="flex-1">

              </CardContent>                      <CardTitle className="text-base mb-1">{project.name}</CardTitle>

            </Card>                      <CardDescription className="line-clamp-2">

          ) : (                        {project.description || 'No description'}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">                      </CardDescription>

              {filteredProjects.map((project) => {                    </div>

                const qualityScore = getQualityScore(project);                    {getStatusBadge(project.status || 'active')}

                return (                  </div>

                  <Card                </CardHeader>

                    key={project.id}                <CardContent>

                    className="group cursor-pointer border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200"                  <div className="space-y-3">

                    onClick={() => navigate(`/app/projects/${project.id}`)}                    {/* Repository Info */}

                  >                    {project.githubUrl && (

                    <CardHeader>                      <div className="flex items-center gap-2 text-sm text-neutral-600">

                      <div className="flex items-start justify-between mb-2">                        <GitBranch className="h-4 w-4" />

                        <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2">                        <span className="truncate">{project.githubUrl.split('/').pop()}</span>

                          <FolderGit2 className="h-4 w-4 text-white" />                      </div>

                        </div>                    )}

                        {getStatusBadge(project.status || 'active')}

                      </div>                    {/* Metrics */}

                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">                    <div className="flex items-center gap-4 text-sm text-neutral-600">

                        {project.name}                      <div className="flex items-center gap-1">

                      </CardTitle>                        <FileText className="h-3.5 w-3.5" />

                      <CardDescription className="line-clamp-2 text-sm">                        <span>{project.fileCount || 0} files</span>

                        {project.description || 'No description provided'}                      </div>

                      </CardDescription>                      <div className="flex items-center gap-1">

                    </CardHeader>                        <Clock className="h-3.5 w-3.5" />

                    <CardContent className="space-y-4">                        <span>{formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>

                      {/* Quality Score */}                      </div>

                      <div className="space-y-2">                    </div>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-gray-600">Code Quality</span>                    {/* Team Avatars */}

                          <span className="font-semibold text-gray-900">{qualityScore}%</span>                    <div className="flex items-center gap-2">

                        </div>                      <div className="flex -space-x-2">

                        <Progress value={qualityScore} className="h-1.5" />                        <Avatar className="h-6 w-6 border-2 border-white">

                      </div>                          <AvatarFallback className="text-xs">JD</AvatarFallback>

                        </Avatar>

                      {/* Repository Link */}                        <Avatar className="h-6 w-6 border-2 border-white">

                      {project.githubUrl && (                          <AvatarFallback className="text-xs">SM</AvatarFallback>

                        <div className="flex items-center gap-2 text-xs text-gray-600">                        </Avatar>

                          <GitBranch className="h-3.5 w-3.5" />                      </div>

                          <span className="truncate">{project.githubUrl.split('/').pop()}</span>                      <span className="text-xs text-neutral-600">2 members</span>

                        </div>                    </div>

                      )}                  </div>

                </CardContent>

                      {/* Stats */}              </Card>

                      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">            ))}

                        <div className="flex items-center gap-4">          </div>

                          <div className="flex items-center gap-1">        )}

                            <FileText className="h-3.5 w-3.5" />      </main>

                            <span>{project.fileCount || 0} files</span>    </div>

                          </div>  );

                          <div className="flex items-center gap-1">};

                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Team Avatars */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-2">
                          {['AB', 'CD', 'EF'].slice(0, 3).map((initials, i) => (
                            <Avatar key={i} className="h-6 w-6 border-2 border-white">
                              <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* AI Insights Sidebar */}
        {projects.length > 0 && (
          <div className="mt-8">
            <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">AI Insights</CardTitle>
                </div>
                <CardDescription>Smart recommendations for your projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Documentation coverage improved
                      </p>
                      <p className="text-xs text-gray-600">
                        Your latest projects have 23% better documentation coverage
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        3 projects need updates
                      </p>
                      <p className="text-xs text-gray-600">
                        Consider regenerating docs for older projects
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Try diagram generation
                      </p>
                      <p className="text-xs text-gray-600">
                        AI can create architecture diagrams automatically
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
