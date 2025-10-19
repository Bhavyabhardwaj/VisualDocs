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
      
      // First check if project has files
      const filesResponse = await projectService.getProjectFiles(id);
      console.log('📦 Files response:', filesResponse);
      
      // The response structure is { data: { files: [...] } }
      const files = filesResponse.data?.files || filesResponse.data || [];
      
      console.log('📁 Extracted files:', files);
      
      if (!files || files.length === 0) {
        toast({
          title: 'No Files Found',
          description: 'Please upload files to your project before running analysis.',
          variant: 'destructive',
        });
        setAnalyzing(false);
        return;
      }

      console.log(`📁 Found ${files.length} files to analyze`);
      
      toast({
        title: 'Analysis Started',
        description: `Analyzing ${files.length} file(s)...`,
      });

      const response = await analysisService.analyzeProject(id);
      console.log('📊 Analysis response:', response);
      console.log('📊 Analysis data:', response.data);
      
      // Backend returns { analysis: {...} }, extract the analysis object
      const analysisData = (response.data as any)?.analysis || response.data;
      console.log('📊 Extracted analysis:', analysisData);
      
      setAnalysis(analysisData);
      
      // Reload project to get updated lastAnalyzedAt
      await loadProject();

      toast({
        title: 'Analysis Complete',
        description: 'Project analysis completed successfully!',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      console.error('Error response:', (error as any)?.response?.data);
      toast({
        title: 'Analysis Failed',
        description: (error as any)?.response?.data?.error || (error instanceof Error ? error.message : 'Failed to analyze project'),
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
                    {analysis ? (
                      <div className="space-y-6">
                        {/* Analysis Header */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                          <div>
                            <p className="text-sm font-medium text-green-900">Analysis Complete</p>
                            <p className="text-xs text-green-700 mt-1">
                              Completed {analysis.completedAt ? new Date(analysis.completedAt).toLocaleString() : 'recently'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-green-600">
                            <Check className="h-5 w-5" />
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Lines of Code</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).totalLinesOfCode?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Total Files</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).totalFiles || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Functions</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).functionCount || 0}
                            </p>
                          </div>
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <p className="text-xs text-neutral-600">Classes</p>
                            <p className="text-2xl font-semibold text-neutral-900 mt-1">
                              {(analysis as any).classCount || 0}
                            </p>
                          </div>
                        </div>

                        {/* Complexity */}
                        {(analysis as any).complexity && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Complexity Analysis</h3>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-xs text-neutral-600">Total</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).complexity.total}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Average</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).complexity.average?.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Distribution</p>
                                <p className="text-sm text-neutral-700">
                                  {Object.keys((analysis as any).complexity.distribution || {}).length} levels
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Dependencies */}
                        {(analysis as any).dependencies && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Dependencies</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-neutral-600">External</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).dependencies.external?.length || 0}
                                </p>
                                {(analysis as any).dependencies.external?.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    {(analysis as any).dependencies.external.slice(0, 5).map((dep: string, idx: number) => (
                                      <p key={idx} className="text-xs text-neutral-600 font-mono truncate">
                                        {dep}
                                      </p>
                                    ))}
                                    {(analysis as any).dependencies.external.length > 5 && (
                                      <p className="text-xs text-neutral-500">
                                        +{(analysis as any).dependencies.external.length - 5} more
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-neutral-600">Internal</p>
                                <p className="text-lg font-semibold text-neutral-900">
                                  {(analysis as any).dependencies.internal?.length || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Language Distribution */}
                        {(analysis as any).languageDistribution && (
                          <div className="p-4 bg-neutral-50 rounded-lg border">
                            <h3 className="text-sm font-medium text-neutral-900 mb-3">Language Distribution</h3>
                            <div className="space-y-2">
                              {Object.entries((analysis as any).languageDistribution).map(([lang, count]) => (
                                <div key={lang} className="flex items-center justify-between">
                                  <span className="text-sm text-neutral-700 capitalize">{lang}</span>
                                  <span className="text-sm font-medium text-neutral-900">{count} files</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {(analysis as any).recommendations && (analysis as any).recommendations.length > 0 && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-sm font-medium text-blue-900 mb-2">
                              <Sparkles className="h-4 w-4 inline mr-2" />
                              AI Recommendations
                            </h3>
                            <ul className="space-y-2">
                              {(analysis as any).recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                  <span className="text-blue-600 mt-0.5">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Raw Data (for debugging) */}
                        <details className="text-xs">
                          <summary className="cursor-pointer text-neutral-600 hover:text-neutral-900">
                            View raw analysis data
                          </summary>
                          <pre className="mt-2 p-3 bg-neutral-100 rounded overflow-auto text-xs">
                            {JSON.stringify(analysis, null, 2)}
                          </pre>
                        </details>
                      </div>
                    ) : project.lastAnalyzedAt ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-neutral-600">Loading analysis...</span>
                          </div>
                          <Progress value={0} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Sparkles className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-600 mb-4">
                          No analysis available yet
                        </p>
                        <Button onClick={handleRunAnalysis} disabled={analyzing}>
                          <PlayCircle className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                          {analyzing ? 'Analyzing...' : 'Run First Analysis'}
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
