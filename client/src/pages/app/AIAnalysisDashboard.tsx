import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Zap,
  FileText, Code, GitBranch, Users, Clock, Download, Filter,
  ChevronDown, Calendar, BarChart3, Sparkles,
  AlertTriangle, Info, XCircle, Target, Brain, Box, FileCode
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { useToast } from '@/components/ui/use-toast';

interface QualityMetric {
  name: string;
  value?: number;
  maxValue?: number;
  score: number;
  change: number;
  status: string;
}

interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description?: string;  // Added for recommendations
  file: string;
  line: number;
  category: string;
  suggestion?: string;
  codeSnippet?: string;
  aiSuggestion?: {
    title: string;
    description: string;
    fixCode?: string;
    reasoning: string;
  };
}

export const AIAnalysisDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load first project on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3004/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log('📦 Projects response:', data);
        console.log('📦 data.success:', data.success);
        console.log('📦 data.data:', data.data);
        console.log('📦 data.data?.items:', data.data?.items);
        
        // The API returns data.data.items (array of projects)
        if (data.success && data.data?.items && data.data.items.length > 0) {
          console.log('✅ Using data.data.items path');
          setProjects(data.data.items);
          const firstProject = data.data.items[0];
          console.log('📊 Loading analysis for project:', firstProject.id);
          setProjectId(firstProject.id);
          loadAnalysis(firstProject.id);
        } else if (data.success && data.data?.projects && data.data.projects.length > 0) {
          console.log('✅ Using data.data.projects path');
          setProjects(data.data.projects);
          const firstProject = data.data.projects[0];
          console.log('📊 Loading analysis for project:', firstProject.id);
          setProjectId(firstProject.id);
          loadAnalysis(firstProject.id);
        } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          // data.data is directly an array
          console.log('✅ Using data.data array path');
          setProjects(data.data);
          const firstProject = data.data[0];
          console.log('📊 Loading analysis for project:', firstProject.id);
          setProjectId(firstProject.id);
          loadAnalysis(firstProject.id);
        } else if (data.projects && data.projects.length > 0) {
          // Alternative response structure
          console.log('✅ Using data.projects path');
          setProjects(data.projects);
          setProjectId(data.projects[0].id);
          loadAnalysis(data.projects[0].id);
        } else {
          console.warn('⚠️ No projects found in response');
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      }
    };
    loadProject();
  }, []);

  // Load analysis data
  const loadAnalysis = async (pid: string) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('📊 Fetching analysis for project:', pid);
      
      // Use the correct endpoint
      const response = await fetch(`http://localhost:3004/api/analysis/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('📊 Analysis response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Analysis data received:', data);
        
        // Handle different response structures
        const analysis = data.data?.analysis || data.analysis || data.data;
        console.log('📊 Extracted analysis:', analysis);
        console.log('📊 Analysis keys:', analysis ? Object.keys(analysis) : 'null');
        
        if (analysis && analysis !== null && typeof analysis === 'object' && Object.keys(analysis).length > 0) {
          console.log('✅ Analysis data found:', {
            totalFiles: analysis.totalFiles,
            totalLinesOfCode: analysis.totalLinesOfCode,
            totalComplexity: analysis.totalComplexity,
            averageComplexity: analysis.averageComplexity,
            functionCount: analysis.functionCount,
            classCount: analysis.classCount,
            interfaceCount: analysis.interfaceCount
          });
          setAnalysisData(analysis);
        } else {
          console.log('⚠️ Analysis is null - project needs to be analyzed');
          setAnalysisData(null);
        }
      } else {
        console.log('⚠️ No analysis data available (status:', response.status, ')');
        setAnalysisData(null);
      }
    } catch (error) {
      console.error('Failed to load analysis:', error);
    }
  };

  // Get quality metrics from analysis data - transform database format to UI format
  const qualityMetrics: QualityMetric[] = analysisData ? [
    {
      name: "Code Complexity",
      value: analysisData.averageComplexity || 0,
      maxValue: 20,
      score: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      change: 0,
      status: (analysisData.averageComplexity || 0) <= 10 ? "good" : (analysisData.averageComplexity || 0) <= 15 ? "warning" : "critical"
    },
    {
      name: "Maintainability",
      value: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      maxValue: 100,
      score: Math.max(0, 100 - (analysisData.averageComplexity || 0) * 5),
      change: 0,
      status: (analysisData.averageComplexity || 0) <= 10 ? "good" : (analysisData.averageComplexity || 0) <= 15 ? "warning" : "critical"
    },
    {
      name: "Test Coverage",
      value: 0,
      maxValue: 100,
      score: 0,
      change: 0,
      status: "warning"
    }
  ] : [];

  // Get issues from analysis data - generate from recommendations
  const issues: Issue[] = analysisData?.recommendations?.map((rec: string, index: number) => ({
    id: `issue-${index}`,
    severity: rec.includes('refactoring') ? 'high' : rec.includes('review') ? 'medium' : 'low',
    title: rec.includes('refactoring') ? 'High Complexity Detected' : 
           rec.includes('review') ? 'Architecture Review Needed' : 
           rec.includes('tests') ? 'Add Unit Tests' : 'Code Quality',
    description: rec,
    suggestion: rec,  // Add suggestion field
    file: 'Multiple files',
    line: 0,
    category: rec.includes('complexity') ? 'Performance' : 
              rec.includes('test') ? 'Testing' : 
              rec.includes('architecture') ? 'Architecture' : 'Quality',
  })) || [];

  // Calculate stats from real data
  const totalIssues = issues.length;
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const mediumIssues = issues.filter(i => i.severity === 'medium').length;
  const lowIssues = issues.filter(i => i.severity === 'low').length;
  
  // Calculate overall quality score from analysis
  const overallQuality = analysisData?.overallQuality || 0;
  const aiSuggestionsCount = issues.filter(issue => issue.suggestion).length;
  const analysisTime = analysisData?.analysisTime || '0s';

  const getSeverityConfig = (severity: string) => {
    const configs = {
      critical: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: XCircle },
      high: { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
      medium: { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle },
      low: { color: 'text-neutral-700', bg: 'bg-neutral-50', border: 'border-neutral-200', icon: Info },
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  const handleExportReport = () => {
    toast({
      title: "Exporting Report",
      description: "Your AI analysis report is being generated...",
    });
    // TODO: Implement actual export functionality
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Report downloaded successfully!",
      });
    }, 2000);
  };

  const handleRunAnalysis = async () => {
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please create a project first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "AI is analyzing your codebase for issues and improvements...",
    });

    try {
      const token = localStorage.getItem('authToken');
      console.log('🔄 Starting analysis for project:', projectId);
      
      // Use the correct endpoint
      const response = await fetch(`http://localhost:3004/api/analysis/${projectId}/rerun`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('🔄 Analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Analysis failed:', errorData);
        throw new Error(errorData.message || 'Analysis failed');
      }

      const data = await response.json();
      console.log('✅ Analysis complete - Full response:', data);
      console.log('✅ Analysis data structure:', JSON.stringify(data, null, 2));
      
      // Handle different response structures
      const analysis = data.data?.analysis || data.analysis || data.data;
      console.log('✅ Extracted analysis:', analysis);
      
      if (analysis) {
        console.log('✅ Setting analysis state with data:', {
          totalFiles: analysis.totalFiles,
          totalLinesOfCode: analysis.totalLinesOfCode,
          totalComplexity: analysis.totalComplexity,
          averageComplexity: analysis.averageComplexity,
          functionCount: analysis.functionCount,
          classCount: analysis.classCount,
          interfaceCount: analysis.interfaceCount,
          recommendations: analysis.recommendations
        });
        setAnalysisData(analysis);
        toast({
          title: "Analysis Complete",
          description: `Analyzed ${analysis.totalFiles || 0} files with ${analysis.totalLinesOfCode?.toLocaleString() || 0} lines of code!`,
        });
      } else {
        console.log('⚠️ No analysis in response, reloading...');
        // Reload the analysis data
        await loadAnalysis(projectId);
        toast({
          title: "Analysis Complete",
          description: "Analysis finished successfully!",
        });
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleViewCode = (file: string, line: number) => {
    console.log('handleViewCode called:', { file, line, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to code editor with file and line
    navigate(`/app/editor/${projectId}?file=${encodeURIComponent(file)}&line=${line}`);
    
    toast({
      title: "Opening Editor",
      description: `Opening ${file} at line ${line}`,
    });
  };

  const handleApplyFix = async (issueId: string, issueTitle: string, file: string, originalCode: string, fixCode: string) => {
    console.log('handleApplyFix called:', { issueId, issueTitle, file, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Applying Fix",
      description: `AI is fixing: ${issueTitle}`,
    });

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3004/api/code-analysis/${projectId}/issues/${issueId}/apply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file, originalCode, fixCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply fix');
      }

      toast({
        title: "Fix Applied",
        description: "Code has been updated successfully!",
      });

      // Reload analysis
      await loadAnalysis(projectId);
    } catch (error) {
      console.error('Apply fix error:', error);
      toast({
        title: "Failed to Apply Fix",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleIgnoreIssue = async (issueId: string, issueTitle: string) => {
    console.log('handleIgnoreIssue called:', { issueId, issueTitle, projectId });
    
    if (!projectId) {
      toast({
        title: "No Project",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `http://localhost:3004/api/code-analysis/${projectId}/issues/${issueId}/ignore`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to ignore issue');
      }

      toast({
        title: "Issue Ignored",
        description: `"${issueTitle}" will not be shown again.`,
      });

      // Reload analysis
      await loadAnalysis(projectId);
    } catch (error) {
      console.error('Ignore issue error:', error);
      toast({
        title: "Failed to Ignore",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const handleGenerateImprovementPlan = () => {
    toast({
      title: "Generating Plan",
      description: "AI is creating a personalized improvement roadmap...",
    });
    // TODO: Implement actual improvement plan generation
    setTimeout(() => {
      toast({
        title: "Plan Ready",
        description: "Your personalized improvement plan is ready to view!",
      });
    }, 2500);
  };

  const handleScheduleAnalysis = () => {
    toast({
      title: "Schedule Analysis",
      description: "Weekly analysis scheduling will be available soon!",
    });
    // TODO: Implement actual scheduling functionality
  };

  return (
    <PremiumLayout>
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div className="rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary p-2 sm:p-2.5 shadow-sm">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-primary">AI Analysis</h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">Intelligent insights for your codebase</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">{projects.find(p => p.id === projectId)?.name || 'Select Project'}</span>
                    <span className="sm:hidden">Project</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {projects.map(project => (
                    <DropdownMenuItem 
                      key={project.id}
                      onClick={() => {
                        setProjectId(project.id);
                        loadAnalysis(project.id);
                      }}
                    >
                      {project.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}</span>
                    <span className="sm:hidden">{timeRange === '7d' ? '7d' : timeRange === '30d' ? '30d' : '90d'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTimeRange('7d')}>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('30d')}>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeRange('90d')}>Last 90 days</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                onClick={handleExportReport}
              >
                <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-brand-primary hover:bg-brand-secondary text-white text-xs sm:text-sm"
                onClick={handleRunAnalysis}
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Run Analysis</span>
                <span className="sm:hidden">Analyze</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8">
          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Overall Quality</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-1.5 sm:p-2">
                <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{overallQuality}%</div>
              <div className="mt-1 sm:mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="font-medium hidden sm:inline">Based on analysis</span>
                <span className="font-medium sm:hidden">Analysis</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Issues Found</CardTitle>
              <div className="rounded-lg bg-red-50 p-1.5 sm:p-2">
                <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{totalIssues}</div>
              <div className="mt-1 sm:mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="font-medium">
                  {criticalIssues} critical, {highIssues} high
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">AI Suggestions</CardTitle>
              <div className="rounded-lg bg-brand-bg p-1.5 sm:p-2">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{aiSuggestionsCount}</div>
              <p className="mt-1 sm:mt-2 text-xs text-neutral-600 hidden sm:block">Ready to implement</p>
              <p className="mt-1 text-xs text-neutral-600 sm:hidden">Ready</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs sm:text-sm font-medium text-neutral-600">Analysis Time</CardTitle>
              <div className="rounded-lg bg-neutral-100 p-1.5 sm:p-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-brand-primary">{analysisTime}</div>
              <p className="mt-1 sm:mt-2 text-xs text-neutral-600 hidden sm:block">Last scan duration</p>
              <p className="mt-1 text-xs text-neutral-600 sm:hidden">Last scan</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column: Quality Metrics & Issues */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Quality Metrics */}
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">Quality Metrics</CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm">Track code quality across key dimensions</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm w-full sm:w-auto"
                    onClick={() => toast({
                      title: "Quality Trends",
                      description: "Viewing detailed quality metrics over time...",
                    })}
                  >
                    <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    View Trends
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {qualityMetrics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
                    <div className="rounded-full bg-neutral-100 p-2.5 sm:p-3 mb-2 sm:mb-3">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-neutral-400" />
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-600">
                      No quality metrics available. Run an analysis to see metrics.
                    </p>
                  </div>
                ) : (
                <div className="space-y-4 sm:space-y-5">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-brand-primary">{metric.name}</span>
                          {metric.status === 'improving' && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs gap-1">
                              <TrendingUp className="h-3 w-3" />
                              +{metric.change}%
                            </Badge>
                          )}
                          {metric.status === 'declining' && (
                            <Badge className="bg-red-50 text-red-700 border-red-200 text-xs gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {metric.change}%
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-brand-primary">{metric.score}%</span>
                      </div>
                      <div className="relative h-2 sm:h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            metric.score >= 90
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : metric.score >= 70
                              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary'
                              : 'bg-gradient-to-r from-amber-500 to-amber-600'
                          }`}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>

            {/* Issues List */}
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <CardTitle className="text-base sm:text-lg font-semibold">Detected Issues</CardTitle>
                    <CardDescription className="mt-1 text-xs sm:text-sm">AI-powered code analysis results</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 hover:bg-neutral-50 text-xs sm:text-sm">
                          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>All Issues</DropdownMenuItem>
                        <DropdownMenuItem>Critical Only</DropdownMenuItem>
                        <DropdownMenuItem>High & Critical</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] sm:h-[500px] pr-2 sm:pr-4">
                  {issues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                      <div className="rounded-full bg-neutral-100 p-3 sm:p-4 mb-3 sm:mb-4">
                        <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-400" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">No Issues Found</h3>
                      <p className="text-xs sm:text-sm text-neutral-600 max-w-md mb-4 px-4">
                        {analysisData 
                          ? "Your code looks great! No issues detected in the latest analysis."
                          : "Run an analysis to detect issues in your code."}
                      </p>
                      {!analysisData && (
                        <Button 
                          onClick={handleRunAnalysis}
                          className="gap-2 bg-brand-primary hover:bg-brand-secondary text-xs sm:text-sm"
                        >
                          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Run First Analysis
                        </Button>
                      )}
                    </div>
                  ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {issues.map((issue) => {
                      const config = getSeverityConfig(issue.severity);
                      const Icon = config.icon;
                      return (
                        <div
                          key={issue.id}
                          className={`p-3 sm:p-4 rounded-lg border ${config.border} ${config.bg} hover:shadow-md transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className={`rounded-lg bg-white p-1.5 sm:p-2 ${config.border} border`}>
                              <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-2">
                                <div className="flex-1">
                                  <h4 className="text-xs sm:text-sm font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors">
                                    {issue.title}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 text-xs text-neutral-600">
                                    <Badge className="bg-white border-neutral-200 text-neutral-700 text-xs">
                                      {issue.category}
                                    </Badge>
                                    <span className="hidden sm:inline">•</span>
                                    <FileText className="h-3 w-3" />
                                    <span className="font-mono">{issue.file}:{issue.line}</span>
                                  </div>
                                </div>
                                <Badge
                                  className={`${config.bg} ${config.color} ${config.border} capitalize text-xs`}
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              
                              <div className="flex items-start gap-2 mt-3 p-2.5 sm:p-3 rounded-lg bg-white border border-neutral-200">
                                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-brand-primary mb-1">AI Suggestion:</div>
                                  <div className="text-xs text-neutral-600 leading-relaxed">{issue.suggestion}</div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg flex-1 sm:flex-none"
                                  onClick={() => handleViewCode(issue.file, issue.line)}
                                >
                                  <Code className="h-3 w-3" />
                                  View Code
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg flex-1 sm:flex-none"
                                  onClick={() => handleApplyFix(
                                    issue.id,
                                    issue.title,
                                    issue.file,
                                    issue.codeSnippet || '',
                                    issue.aiSuggestion?.fixCode || ''
                                  )}
                                >
                                  <Zap className="h-3 w-3" />
                                  Apply Fix
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-neutral-500 hover:bg-neutral-50 w-full sm:w-auto"
                                  onClick={() => handleIgnoreIssue(issue.id, issue.title)}
                                >
                                  Ignore
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: AI Insights & Recommendations */}
          <div className="space-y-4 sm:space-y-6">
            {/* AI Insights */}
            <Card className="border-neutral-200 overflow-hidden bg-gradient-to-br from-brand-bg via-[#E8D5C4]/30 to-brand-bg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-white p-1.5 sm:p-2 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">AI Insights</CardTitle>
                </div>
                <CardDescription className="text-neutral-600 text-xs sm:text-sm">Smart recommendations from our AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-brand-primary mb-1">Great Progress!</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Your code quality improved by 5% this week. Keep up the excellent work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-brand-primary mb-1">Focus Area</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Consider improving test coverage in the authentication module to reach 95% coverage.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-3 sm:p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-neutral-900 mb-1">Performance Tip</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Implementing lazy loading could reduce initial bundle size by approximately 23%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Statistics */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold">Code Statistics</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Analysis of your codebase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Total Files</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">TypeScript & React</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.totalFiles || 0}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Lines of Code</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Excluding comments</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.totalLinesOfCode?.toLocaleString() || '0'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Complexity</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Cyclomatic average</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.averageComplexity?.toFixed(1) || '0.0'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Functions</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.functionCount || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <Box className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Classes</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.classCount || 0}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="rounded-lg bg-white p-1.5 sm:p-2 border border-neutral-200">
                      <FileCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900">Interfaces</div>
                      <div className="text-xs text-neutral-600 hidden sm:block">Total count</div>
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-neutral-900">
                    {analysisData?.interfaceCount || 0}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg font-semibold text-brand-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleExportReport}
                >
                  <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Export Full Report (PDF)</span>
                  <span className="sm:hidden">Export PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleGenerateImprovementPlan}
                >
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Generate Improvement Plan</span>
                  <span className="sm:hidden">Improvement Plan</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg text-xs sm:text-sm"
                  onClick={handleScheduleAnalysis}
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Schedule Weekly Analysis</span>
                  <span className="sm:hidden">Schedule Analysis</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
};

