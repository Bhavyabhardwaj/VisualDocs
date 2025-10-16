import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, GitBranch, FileText, Sparkles, Download, Share2,
  PlayCircle, Settings, Trash2, Archive, MoreVertical, FolderTree,
  Code2, FileJson, Eye, Copy, Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { projectService } from '@/services/project.service';
import { analysisService } from '@/services/analysis.service';
import { diagramService } from '@/services/diagram.service';
import type { Project, Analysis, Diagram } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

export const ShadcnProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(id!);
      console.log('📦 Project data received:', response);
      console.log('📦 Project dates:', {
        createdAt: response.data?.createdAt,
        updatedAt: response.data?.updatedAt,
        lastAnalyzedAt: response.data?.lastAnalyzedAt
      });
      setProject(response.data || null);
    } catch (error) {
      console.error('Failed to load project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (project?.githubUrl) {
      navigator.clipboard.writeText(project.githubUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunAnalysis = async () => {
    if (!id) return;
    
    try {
      setAnalyzing(true);
      toast({
        title: 'Analysis Started',
        description: 'Analyzing your project files...',
      });

      const response = await analysisService.analyzeProject(id);
      setAnalysis(response.data || null);
      
      // Reload project to get updated lastAnalyzedAt
      await loadProject();

      toast({
        title: 'Analysis Complete',
        description: 'Project analysis completed successfully!',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze project',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
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
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-2 border-neutral-900 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-neutral-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-neutral-600">Project not found</p>
          <Button onClick={() => navigate('/app/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-semibold text-neutral-900">{project.name}</h1>
                  {getStatusBadge(project.status || 'active')}
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  {project.description || 'No description'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Files</p>
                      <p className="text-2xl font-semibold mt-1">{project.fileCount || 0}</p>
                    </div>
                    <FileText className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Analyzed</p>
                      <p className="text-2xl font-semibold mt-1">
                        {project.lastAnalyzedAt ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <Sparkles className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">Docs</p>
                      <p className="text-2xl font-semibold mt-1">0</p>
                    </div>
                    <FileJson className="h-8 w-8 text-neutral-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b border-neutral-200 rounded-none bg-transparent h-auto p-0">
                <TabsTrigger 
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="files"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Files
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="documentation"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
                >
                  Documentation
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-600">Created</p>
                        <p className="text-sm font-medium mt-1">
                          {safeFormatDate(project.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Last Updated</p>
                        <p className="text-sm font-medium mt-1">
                          {safeFormatDate(project.updatedAt)}
                        </p>
                      </div>
                      {project.lastAnalyzedAt && (
                        <div className="col-span-2">
                          <p className="text-sm text-neutral-600">Last Analyzed</p>
                          <p className="text-sm font-medium mt-1">
                            {safeFormatDate(project.lastAnalyzedAt)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {project.githubUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Repository</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <GitBranch className="h-4 w-4 text-neutral-600 flex-shrink-0" />
                          <code className="text-sm text-neutral-900 truncate">
                            {project.githubUrl}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyUrl}
                          className="ml-2"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleRunAnalysis}
                      disabled={analyzing}
                    >
                      <PlayCircle className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                      {analyzing ? 'Analyzing...' : 'Run Analysis'}
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Documentation
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Diagrams
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">File Explorer</CardTitle>
                    <CardDescription>
                      Browse and analyze project files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded cursor-pointer">
                          <FolderTree className="h-4 w-4 text-neutral-600" />
                          <span className="text-sm">src/</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded cursor-pointer pl-6">
                          <Code2 className="h-4 w-4 text-neutral-600" />
                          <span className="text-sm">index.ts</span>
                          <Badge variant="outline" className="ml-auto text-xs">TypeScript</Badge>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded cursor-pointer pl-6">
                          <Code2 className="h-4 w-4 text-neutral-600" />
                          <span className="text-sm">app.ts</span>
                          <Badge variant="outline" className="ml-auto text-xs">TypeScript</Badge>
                        </div>
                        <div className="flex items-center gap-2 p-2 hover:bg-neutral-50 rounded cursor-pointer">
                          <FileJson className="h-4 w-4 text-neutral-600" />
                          <span className="text-sm">package.json</span>
                          <Badge variant="outline" className="ml-auto text-xs">JSON</Badge>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Code Analysis</CardTitle>
                    <CardDescription>
                      AI-powered insights and metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.lastAnalyzedAt ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-600">Code Quality</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-600">Documentation Coverage</span>
                            <span className="text-sm font-medium">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-600">Test Coverage</span>
                            <span className="text-sm font-medium">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-600 mb-4">
                          No analysis available yet
                        </p>
                        <Button>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Run First Analysis
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Documentation</CardTitle>
                    <CardDescription>
                      AI-generated project documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm text-neutral-600 mb-4">
                        No documentation generated yet
                      </p>
                      <Button>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Documentation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Project created</p>
                      <p className="text-xs text-neutral-600 mt-1">
                        {safeFormatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                  {project.lastAnalyzedAt && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Analysis completed</p>
                        <p className="text-xs text-neutral-600 mt-1">
                          {safeFormatDate(project.lastAnalyzedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600">
                  No team members yet
                </p>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Invite Team
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
