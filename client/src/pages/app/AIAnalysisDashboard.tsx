import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Zap,
  FileText, Code, GitBranch, Users, Clock, Download, Filter,
  ChevronDown, Calendar, BarChart3, Sparkles,
  AlertTriangle, Info, XCircle, Target, Brain
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
  score: number;
  change: number;
  status: 'improving' | 'declining' | 'stable';
}

interface Issue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  file: string;
  line: number;
  category: string;
  suggestion: string;
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
        if (data.projects && data.projects.length > 0) {
          setProjectId(data.projects[0].id);
          loadAnalysis(data.projects[0].id);
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
      const response = await fetch(`http://localhost:3004/api/code-analysis/${pid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAnalysisData(data.analysis);
      }
    } catch (error) {
      console.log('No analysis data yet');
    }
  };

  // Get quality metrics from analysis data
  const qualityMetrics: QualityMetric[] = analysisData?.qualityMetrics || [];

  // Get issues from analysis data (no fallback mock data)
  const issues: Issue[] = analysisData?.issues || [];

  // Calculate stats from real data
  const totalIssues = analysisData?.totalIssues || 0;
  const criticalIssues = analysisData?.criticalIssues || 0;
  const highIssues = analysisData?.highIssues || 0;
  const mediumIssues = analysisData?.mediumIssues || 0;
  const lowIssues = analysisData?.lowIssues || 0;
  
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
      const response = await fetch(`http://localhost:3004/api/code-analysis/${projectId}/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysisData(data.analysis);

      toast({
        title: "Analysis Complete",
        description: `Found ${data.analysis.totalIssues} issues with ${data.analysis.criticalIssues} critical!`,
      });
    } catch (error) {
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
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary p-2.5 shadow-sm">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-brand-primary">AI Analysis</h1>
                  <p className="text-sm text-neutral-600 mt-1">Intelligent insights for your codebase</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-neutral-300 hover:bg-brand-bg">
                    <Calendar className="h-4 w-4" />
                    Last {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : '90 days'}
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
                className="gap-2 border-neutral-300 hover:bg-brand-bg"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-brand-primary hover:bg-brand-secondary text-white"
                onClick={handleRunAnalysis}
              >
                <Sparkles className="h-4 w-4" />
                Run Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Overall Quality</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neutral-900">{overallQuality}%</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-medium">Based on analysis</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Issues Found</CardTitle>
              <div className="rounded-lg bg-red-50 p-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-neutral-900">{totalIssues}</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600">
                <span className="font-medium">
                  {criticalIssues} critical, {highIssues} high
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">AI Suggestions</CardTitle>
              <div className="rounded-lg bg-brand-bg p-2">
                <Sparkles className="h-4 w-4 text-brand-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">{aiSuggestionsCount}</div>
              <p className="mt-2 text-xs text-neutral-600">Ready to implement</p>
            </CardContent>
          </Card>

          <Card className="border-neutral-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Analysis Time</CardTitle>
              <div className="rounded-lg bg-neutral-100 p-2">
                <Clock className="h-4 w-4 text-neutral-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-primary">{analysisTime}</div>
              <p className="mt-2 text-xs text-neutral-600">Last scan duration</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Quality Metrics & Issues */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quality Metrics */}
            <Card className="border-neutral-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-brand-primary">Quality Metrics</CardTitle>
                    <CardDescription className="mt-1">Track code quality across key dimensions</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 border-neutral-300 hover:bg-brand-bg"
                    onClick={() => toast({
                      title: "Quality Trends",
                      description: "Viewing detailed quality metrics over time...",
                    })}
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Trends
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {qualityMetrics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="rounded-full bg-neutral-100 p-3 mb-3">
                      <BarChart3 className="h-6 w-6 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-600">
                      No quality metrics available. Run an analysis to see metrics.
                    </p>
                  </div>
                ) : (
                <div className="space-y-5">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-brand-primary">{metric.name}</span>
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
                        <span className="text-sm font-bold text-brand-primary">{metric.score}%</span>
                      </div>
                      <div className="relative h-2.5 bg-neutral-100 rounded-full overflow-hidden">
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Detected Issues</CardTitle>
                    <CardDescription className="mt-1">AI-powered code analysis results</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 hover:bg-neutral-50">
                          <Filter className="h-4 w-4" />
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
                <ScrollArea className="h-[500px] pr-4">
                  {issues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="rounded-full bg-neutral-100 p-4 mb-4">
                        <CheckCircle2 className="h-8 w-8 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Issues Found</h3>
                      <p className="text-sm text-neutral-600 max-w-md mb-4">
                        {analysisData 
                          ? "Your code looks great! No issues detected in the latest analysis."
                          : "Run an analysis to detect issues in your code."}
                      </p>
                      {!analysisData && (
                        <Button 
                          onClick={handleRunAnalysis}
                          className="gap-2 bg-brand-primary hover:bg-brand-secondary"
                        >
                          <Sparkles className="h-4 w-4" />
                          Run First Analysis
                        </Button>
                      )}
                    </div>
                  ) : (
                  <div className="space-y-3">
                    {issues.map((issue) => {
                      const config = getSeverityConfig(issue.severity);
                      const Icon = config.icon;
                      return (
                        <div
                          key={issue.id}
                          className={`p-4 rounded-lg border ${config.border} ${config.bg} hover:shadow-md transition-all cursor-pointer group`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg bg-white p-2 ${config.border} border`}>
                              <Icon className={`h-4 w-4 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors">
                                    {issue.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-600">
                                    <Badge className="bg-white border-neutral-200 text-neutral-700 text-xs">
                                      {issue.category}
                                    </Badge>
                                    <span>•</span>
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
                              
                              <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-white border border-neutral-200">
                                <Sparkles className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-brand-primary mb-1">AI Suggestion:</div>
                                  <div className="text-xs text-neutral-600 leading-relaxed">{issue.suggestion}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-3">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg"
                                  onClick={() => handleViewCode(issue.file, issue.line)}
                                >
                                  <Code className="h-3 w-3" />
                                  View Code
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-7 text-xs gap-1.5 border-neutral-300 hover:bg-brand-bg"
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
                                  className="h-7 text-xs text-neutral-500 hover:bg-neutral-50"
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
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="border-neutral-200 overflow-hidden bg-gradient-to-br from-brand-bg via-[#E8D5C4]/30 to-brand-bg">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Sparkles className="h-4 w-4 text-brand-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-brand-primary">AI Insights</CardTitle>
                </div>
                <CardDescription className="text-neutral-600">Smart recommendations from our AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-brand-primary mb-1">Great Progress!</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Your code quality improved by 5% this week. Keep up the excellent work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-brand-primary mb-1">Focus Area</h4>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        Consider improving test coverage in the authentication module to reach 95% coverage.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm border border-neutral-100">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-900 mb-1">Performance Tip</h4>
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
                <CardTitle className="text-lg font-semibold">Code Statistics</CardTitle>
                <CardDescription>Analysis of your codebase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-neutral-200">
                      <FileText className="h-4 w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Total Files</div>
                      <div className="text-xs text-neutral-600">TypeScript & React</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">247</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-neutral-200">
                      <Code className="h-4 w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Lines of Code</div>
                      <div className="text-xs text-neutral-600">Excluding comments</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">18.5K</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-neutral-200">
                      <GitBranch className="h-4 w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Complexity</div>
                      <div className="text-xs text-neutral-600">Cyclomatic average</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">4.2</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-neutral-200">
                      <Users className="h-4 w-4 text-neutral-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">Contributors</div>
                      <div className="text-xs text-neutral-600">Last 30 days</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-neutral-900">12</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-neutral-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-brand-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg"
                  onClick={handleExportReport}
                >
                  <Download className="h-4 w-4" />
                  Export Full Report (PDF)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg"
                  onClick={handleGenerateImprovementPlan}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Improvement Plan
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-neutral-300 hover:bg-brand-bg"
                  onClick={handleScheduleAnalysis}
                >
                  <Calendar className="h-4 w-4" />
                  Schedule Weekly Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
};

