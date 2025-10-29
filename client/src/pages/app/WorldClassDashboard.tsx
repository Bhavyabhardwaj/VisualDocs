import { useState, useEffect } from 'react';import { useEffect, useState } from 'react';

import { motion } from 'framer-motion';import { useNavigate } from 'react-router-dom';

import { PremiumLayout } from '@/components/layout/PremiumLayout';import { 

import { LiveActivityFeed } from '@/components/collaboration/LiveActivityFeed';  FolderGit2, FileText, Sparkles, Users, TrendingUp, 

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';  Clock, GitBranch, Search, Bell, Github,

import { Button } from '@/components/ui/button';  Upload, BarChart3, CheckCircle2, AlertCircle, Loader2,

import { Badge } from '@/components/ui/badge';  Filter, ArrowUpRight, Zap

import { Progress } from '@/components/ui/progress';} from 'lucide-react';

import { Users, TrendingUp, GitBranch, Zap, Plus, ArrowRight, Sparkles } from 'lucide-react';import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';import { Button } from '@/components/ui/button';

import { useNavigate } from 'react-router-dom';import { Badge } from '@/components/ui/badge';

import { projectService } from '@/services/project.service';import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Separator } from '@/components/ui/separator';

interface Project {import { Input } from '@/components/ui/input';

  id: string;import { FileUploadDialog } from '@/components/app/FileUploadDialog';

  name: string;import { GitHubImportDialog } from '@/components/app/GitHubImportDialog';

  status: string;import { projectService } from '@/services/project.service';

  updatedAt: Date;import type { Project } from '@/types/api';

  collaborators: number;import { formatDistanceToNow } from 'date-fns';

  progress: number;

  isAIActive?: boolean;export const WorldClassDashboard = () => {

}  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);

export const WorldClassDashboard = () => {  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();  const [searchQuery, setSearchQuery] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [loading, setLoading] = useState(true);  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  // Mock live activity data - replace with real WebSocket data  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [activities] = useState([

    {  useEffect(() => {

      id: '1',    loadProjects();

      type: 'edit' as const,  }, []);

      user: { name: 'Sarah Adams', avatar: undefined, color: '#3b82f6' },

      action: 'is editing',  const loadProjects = async () => {

      target: 'API Documentation',    try {

      timestamp: new Date(Date.now() - 30000),      setLoading(true);

    },      const response = await projectService.getProjects();

    {      setProjects(response.data.items || []);

      id: '2',    } catch (error) {

      type: 'diagram' as const,      console.error('Failed to load projects:', error);

      user: { name: 'Mike Chen', avatar: undefined, color: '#8b5cf6' },      setProjects([]);

      action: 'generated architecture diagram for',    } finally {

      target: 'microservices-app',      setLoading(false);

      timestamp: new Date(Date.now() - 300000),    }

    },  };

    {

      id: '3',  const stats = {

      type: 'analysis' as const,    totalProjects: projects.length,

      user: { name: 'AI Assistant', avatar: undefined, color: '#ec4899' },    docsGenerated: projects.reduce((acc, p) => acc + (p.fileCount || 0), 0),

      action: 'completed analysis for',    aiInsights: 89,

      target: 'visualdocs',    teamMembers: 8,

      timestamp: new Date(Date.now() - 720000),  };

    },

    {  const filteredProjects = projects.filter(project => {

      id: '4',    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

      type: 'upload' as const,                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      user: { name: 'You', avatar: undefined, color: '#10b981' },    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;

      action: 'uploaded 15 files to',    return matchesSearch && matchesFilter;

      target: 'project-x',  });

      timestamp: new Date(Date.now() - 1380000),

    },  const getStatusBadge = (status: string) => {

  ]);    const statusConfig = {

      active: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },

  useEffect(() => {      analyzing: { label: 'Analyzing', className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },

    fetchProjects();      archived: { label: 'Archived', className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100' },

  }, []);    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

  const fetchProjects = async () => {    return <Badge className={`${config.className} transition-colors`}>{config.label}</Badge>;

    try {  };

      const response = await projectService.getProjects({ limit: 3 });

      if (response.data) {  const getQualityScore = (project: Project) => {

        const formattedProjects = response.data.map(p => ({    return Math.min(95, 60 + (project.fileCount || 0) % 35);

          id: p.id,  };

          name: p.name,

          status: p.status,  return (

          updatedAt: new Date(p.updatedAt),    <div className="min-h-screen bg-white">

          collaborators: Math.floor(Math.random() * 3) + 1, // Mock      {/* Premium Sticky Header */}

          progress: p.status === 'COMPLETED' ? 100 : Math.floor(Math.random() * 60) + 30,      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">

          isAIActive: p.status === 'ANALYZING',        <div className="mx-auto max-w-[1400px] px-6">

        }));          <div className="flex h-16 items-center justify-between">

        setProjects(formattedProjects);            {/* Logo & Navigation */}

      }            <div className="flex items-center gap-8">

    } catch (error) {              <div className="flex items-center gap-2.5">

      console.error('Failed to fetch projects:', error);                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-sm">

    } finally {                  <Sparkles className="h-4 w-4 text-white" />

      setLoading(false);                </div>

    }                <span className="text-lg font-semibold tracking-tight">VisualDocs</span>

  };              </div>

              <nav className="hidden md:flex items-center gap-1">

  const stats = [                <Button 

    {                  variant="ghost" 

      icon: Users,                  size="sm" 

      label: 'Team Online',                  className="font-medium text-gray-900"

      value: '3/8',                  onClick={() => navigate('/app/dashboard')}

      subtext: '2 editing now',                >

      color: 'from-blue-500 to-cyan-500',                  Dashboard

      iconBg: 'bg-blue-50',                </Button>

      iconColor: 'text-blue-600',                <Button 

    },                  variant="ghost" 

    {                  size="sm" 

      icon: TrendingUp,                  className="text-gray-600 hover:text-gray-900"

      label: 'Insights Ready',                  onClick={() => navigate('/app/projects')}

      value: '12 new',                >

      subtext: 'From last analysis',                  Projects

      color: 'from-purple-500 to-pink-500',                </Button>

      iconBg: 'bg-purple-50',                <Button 

      iconColor: 'text-purple-600',                  variant="ghost" 

    },                  size="sm" 

    {                  className="text-gray-600 hover:text-gray-900"

      icon: GitBranch,                  onClick={() => navigate('/app/analysis')}

      label: 'Diagrams Generated',                >

      value: '23 total',                  Analytics

      subtext: '5 this week',                </Button>

      color: 'from-green-500 to-emerald-500',                <Button 

      iconBg: 'bg-green-50',                  variant="ghost" 

      iconColor: 'text-green-600',                  size="sm" 

    },                  className="text-gray-600 hover:text-gray-900"

    {                  onClick={() => navigate('/app/team')}

      icon: Zap,                >

      label: 'Quick Actions',                  Team

      value: '',                </Button>

      subtext: 'Create new project',              </nav>

      color: 'from-orange-500 to-amber-500',            </div>

      iconBg: 'bg-orange-50',

      iconColor: 'text-orange-600',            {/* Search & Actions */}

      action: () => navigate('/app/projects'),            <div className="flex items-center gap-3">

    },              <div className="hidden lg:block">

  ];                <div className="relative">

                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

  return (                  <Input

    <PremiumLayout>                    placeholder="Search projects..."

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">                    value={searchQuery}

        {/* Header */}                    onChange={(e) => setSearchQuery(e.target.value)}

        <div className="border-b border-neutral-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">                    className="w-64 pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-colors"

          <div className="mx-auto px-8 py-6">                  />

            <motion.div                  <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100 sm:flex">

              initial={{ opacity: 0, y: -20 }}                    <span className="text-xs">⌘</span>K

              animate={{ opacity: 1, y: 0 }}                  </kbd>

              transition={{ duration: 0.5 }}                </div>

            >              </div>

              <h1 className="text-3xl font-bold tracking-tight text-neutral-900">              

                Dashboard              <Button 

              </h1>                variant="ghost" 

              <p className="text-neutral-600 mt-1 text-[15px]">                size="icon" 

                Welcome back! Here's what's happening with your projects.                className="relative hover:bg-gray-100"

              </p>                onClick={() => navigate('/app/settings')}

            </motion.div>              >

          </div>                <Bell className="h-4 w-4" />

        </div>                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />

              </Button>

        <div className="mx-auto px-8 py-8 max-w-7xl">              

          <div className="space-y-8">              <Separator orientation="vertical" className="h-6" />

            {/* Live Activity Feed - TOP PRIORITY */}              

            <motion.div              <Avatar 

              initial={{ opacity: 0, y: 20 }}                className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-gray-200 transition-all"

              animate={{ opacity: 1, y: 0 }}                onClick={() => navigate('/app/settings')}

              transition={{ delay: 0.1 }}              >

            >                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-medium">

              <LiveActivityFeed activities={activities} />                  JD

            </motion.div>                </AvatarFallback>

              </Avatar>

            {/* Stats Grid */}            </div>

            <motion.div          </div>

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"        </div>

              initial={{ opacity: 0, y: 20 }}      </header>

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.2 }}      {/* Main Content */}

            >      <main className="mx-auto max-w-[1400px] px-6 py-8">

              {stats.map((stat, index) => {        {/* Page Header with Quick Actions */}

                const Icon = stat.icon;        <div className="mb-8">

                return (          <div className="flex items-start justify-between">

                  <motion.div            <div>

                    key={stat.label}              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Dashboard</h1>

                    initial={{ opacity: 0, scale: 0.9 }}              <p className="mt-2 text-sm text-gray-600">

                    animate={{ opacity: 1, scale: 1 }}                Welcome back! Here's what's happening with your projects today.

                    transition={{ delay: 0.2 + index * 0.05 }}              </p>

                    whileHover={{ scale: 1.02, y: -4 }}            </div>

                  >            <div className="flex items-center gap-3">

                    <Card               <Button 

                      className={cn(                variant="outline" 

                        "border-neutral-200 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden group",                size="sm" 

                        stat.action && "cursor-pointer"                className="gap-2 hover:bg-gray-50"

                      )}                onClick={() => {

                      onClick={stat.action}                  setSelectedProjectId(projects.length > 0 ? projects[0].id : null);

                    >                  setUploadDialogOpen(true);

                      <CardHeader className="pb-3">                }}

                        <div className="flex items-center justify-between">              >

                          <div className={cn(                <Upload className="h-4 w-4" />

                            "h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",                Upload Files

                            stat.iconBg              </Button>

                          )}>              <Button 

                            <Icon className={cn("h-5 w-5", stat.iconColor)} />                variant="outline" 

                          </div>                size="sm" 

                          {stat.value && (                className="gap-2 hover:bg-gray-50"

                            <div className="text-right">                onClick={() => navigate('/app/analysis')}

                              <div className="text-2xl font-bold text-neutral-900">              >

                                {stat.value}                <BarChart3 className="h-4 w-4" />

                              </div>                Analytics

                            </div>              </Button>

                          )}              <Button 

                        </div>                size="sm" 

                      </CardHeader>                className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-sm"

                      <CardContent>                onClick={() => setGithubDialogOpen(true)}

                        <div className="space-y-1">              >

                          <p className="text-sm font-medium text-neutral-700">                <Github className="h-4 w-4" />

                            {stat.label}                Import from GitHub

                          </p>              </Button>

                          <p className="text-xs text-neutral-500">            </div>

                            {stat.subtext}          </div>

                          </p>        </div>

                        </div>

                        {stat.action && (        {/* Premium Stats Grid */}

                          <Button size="sm" className="w-full mt-3 group-hover:bg-primary">        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                            <Plus className="h-4 w-4 mr-1" />          <Card 

                            New            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"

                          </Button>            onClick={() => navigate('/app/projects')}

                        )}          >

                      </CardContent>            <CardHeader className="flex flex-row items-center justify-between pb-2">

                    </Card>              <CardTitle className="text-sm font-medium text-gray-600">Projects Analyzed</CardTitle>

                  </motion.div>              <div className="rounded-lg bg-blue-50 p-2.5">

                );                <FolderGit2 className="h-5 w-5 text-blue-600" />

              })}              </div>

            </motion.div>            </CardHeader>

            <CardContent>

            {/* Active Projects */}              <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>

            <motion.div              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">

              initial={{ opacity: 0, y: 20 }}                <TrendingUp className="h-3.5 w-3.5" />

              animate={{ opacity: 1, y: 0 }}                <span className="font-medium">+12% from last month</span>

              transition={{ delay: 0.3 }}              </div>

            >            </CardContent>

              <Card className="border-neutral-200 shadow-sm">          </Card>

                <CardHeader>

                  <div className="flex items-center justify-between">          <Card 

                    <CardTitle className="text-lg font-semibold">            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"

                      📁 Active Projects            onClick={() => navigate('/app/projects')}

                    </CardTitle>          >

                    <Button            <CardHeader className="flex flex-row items-center justify-between pb-2">

                      variant="ghost"              <CardTitle className="text-sm font-medium text-gray-600">Docs Generated</CardTitle>

                      size="sm"              <div className="rounded-lg bg-purple-50 p-2.5">

                      onClick={() => navigate('/app/projects')}                <FileText className="h-5 w-5 text-purple-600" />

                      className="gap-1"              </div>

                    >            </CardHeader>

                      View All            <CardContent>

                      <ArrowRight className="h-4 w-4" />              <div className="text-3xl font-bold text-gray-900">{stats.docsGenerated}</div>

                    </Button>              <p className="mt-2 text-xs text-gray-600">Across all projects</p>

                  </div>            </CardContent>

                </CardHeader>          </Card>

                <CardContent>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">          <Card 

                    {loading ? (            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"

                      <div className="col-span-3 text-center py-8 text-neutral-500">            onClick={() => navigate('/app/analysis')}

                        Loading projects...          >

                      </div>            <CardHeader className="flex flex-row items-center justify-between pb-2">

                    ) : projects.length === 0 ? (              <CardTitle className="text-sm font-medium text-gray-600">AI Insights</CardTitle>

                      <div className="col-span-3 text-center py-8 text-neutral-500">              <div className="rounded-lg bg-amber-50 p-2.5">

                        No projects yet. Create your first one!                <Zap className="h-5 w-5 text-amber-600" />

                      </div>              </div>

                    ) : (            </CardHeader>

                      projects.map((project, index) => (            <CardContent>

                        <motion.div              <div className="text-3xl font-bold text-gray-900">{stats.aiInsights}</div>

                          key={project.id}              <p className="mt-2 text-xs text-gray-600">Smart suggestions</p>

                          initial={{ opacity: 0, scale: 0.9 }}            </CardContent>

                          animate={{ opacity: 1, scale: 1 }}          </Card>

                          transition={{ delay: 0.3 + index * 0.1 }}

                          whileHover={{ scale: 1.03, y: -4 }}          <Card 

                          className="group"            className="border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer"

                        >            onClick={() => navigate('/app/team')}

                          <Card          >

                            className="border-neutral-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"            <CardHeader className="flex flex-row items-center justify-between pb-2">

                            onClick={() => navigate(`/app/projects/${project.id}`)}              <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>

                          >              <div className="rounded-lg bg-emerald-50 p-2.5">

                            <CardHeader className="pb-3">                <Users className="h-5 w-5 text-emerald-600" />

                              <div className="flex items-start justify-between">              </div>

                                <div className="flex-1 min-w-0">            </CardHeader>

                                  <h3 className="font-semibold text-neutral-900 truncate group-hover:text-blue-600 transition-colors">            <CardContent>

                                    {project.name}              <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>

                                  </h3>              <p className="mt-2 text-xs text-gray-600">Active collaborators</p>

                                  <div className="flex items-center gap-2 mt-2">            </CardContent>

                                    <div className="flex -space-x-2">          </Card>

                                      {[...Array(project.collaborators)].map((_, i) => (        </div>

                                        <div

                                          key={i}        {/* Projects Section */}

                                          className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-medium"        <div className="space-y-5">

                                        >          <div className="flex items-center justify-between">

                                          {String.fromCharCode(65 + i)}            <div>

                                        </div>              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Recent Projects</h2>

                                      ))}              <p className="text-sm text-gray-600 mt-1">

                                    </div>                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}

                                    <span className="text-xs text-neutral-500">              </p>

                                      {project.collaborators === 1 ? 'viewing' : 'editing'}            </div>

                                    </span>            <div className="flex items-center gap-2">

                                  </div>              <Button

                                </div>                variant={filterStatus === 'all' ? 'default' : 'outline'}

                                {project.isAIActive && (                size="sm"

                                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">                onClick={() => setFilterStatus('all')}

                                    <Sparkles className="h-3 w-3 mr-1" />                className={filterStatus === 'all' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}

                                    AI              >

                                  </Badge>                All

                                )}              </Button>

                              </div>              <Button

                            </CardHeader>                variant={filterStatus === 'active' ? 'default' : 'outline'}

                            <CardContent className="space-y-2">                size="sm"

                              <div className="space-y-1">                onClick={() => setFilterStatus('active')}

                                <div className="flex items-center justify-between text-xs">                className={filterStatus === 'active' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}

                                  <span className="text-neutral-600">Progress</span>              >

                                  <span className="font-medium text-neutral-900">                Ready

                                    {project.progress}%              </Button>

                                  </span>              <Button

                                </div>                variant={filterStatus === 'analyzing' ? 'default' : 'outline'}

                                <Progress value={project.progress} className="h-2" />                size="sm"

                              </div>                onClick={() => setFilterStatus('analyzing')}

                              <p className="text-xs text-neutral-500">                className={filterStatus === 'analyzing' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}

                                Updated {new Date(project.updatedAt).toLocaleDateString('en-US', {              >

                                  month: 'short',                Analyzing

                                  day: 'numeric',              </Button>

                                  hour: '2-digit',              <Separator orientation="vertical" className="h-6 mx-1" />

                                  minute: '2-digit'              <Button variant="outline" size="icon" className="hover:bg-gray-50">

                                })}                <Filter className="h-4 w-4" />

                              </p>              </Button>

                            </CardContent>            </div>

                          </Card>          </div>

                        </motion.div>

                      ))          {loading ? (

                    )}            <div className="flex flex-col items-center justify-center py-20">

                  </div>              <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />

                </CardContent>              <p className="text-sm font-medium text-gray-600">Loading your projects...</p>

              </Card>              <p className="text-xs text-gray-500 mt-1">This won't take long</p>

            </motion.div>            </div>

          </div>          ) : filteredProjects.length === 0 ? (

        </div>            <Card className="border-gray-200 border-2 border-dashed bg-gray-50/50">

      </div>              <CardContent className="flex flex-col items-center justify-center py-20">

    </PremiumLayout>                <div className="rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-5 mb-5">

  );                  <FolderGit2 className="h-14 w-14 text-gray-400" />

};                </div>

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
                    <Button 
                      className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-md"
                      onClick={() => setGithubDialogOpen(true)}
                    >
                      <Github className="h-4 w-4" />
                      Import from GitHub
                    </Button>
                    <Button 
                      variant="outline" 
                      className="gap-2 hover:bg-gray-50"
                      onClick={() => {
                        setSelectedProjectId(null);
                        setUploadDialogOpen(true);
                      }}
                    >
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
                        Your latest projects have 23% better documentation coverage compared to last month
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
                        Consider regenerating documentation for projects updated more than 30 days ago
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
      </main>

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
    </div>
  );
};
