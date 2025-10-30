import { useState } from 'react';
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
}

export const AIAnalysisDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const { toast } = useToast();

  const qualityMetrics: QualityMetric[] = [
    { name: 'Documentation Coverage', score: 87, change: 12, status: 'improving' },
    { name: 'Code Complexity', score: 72, change: -5, status: 'declining' },
    { name: 'Test Coverage', score: 94, change: 3, status: 'improving' },
    { name: 'Type Safety', score: 91, change: 0, status: 'stable' },
    { name: 'Performance Score', score: 78, change: 8, status: 'improving' },
    { name: 'Security Score', score: 85, change: 2, status: 'improving' },
  ];

  const issues: Issue[] = [
    {
      id: '1',
      severity: 'critical',
      title: 'Potential memory leak in useEffect hook',
      file: 'Dashboard.tsx',
      line: 145,
      category: 'Performance',
      suggestion: 'Add cleanup function to prevent memory leaks'
    },
    {
      id: '2',
      severity: 'high',
      title: 'Missing error boundary for async operations',
      file: 'ProjectList.tsx',
      line: 89,
      category: 'Reliability',
      suggestion: 'Wrap async calls with try-catch or error boundary'
    },
    {
      id: '3',
      severity: 'medium',
      title: 'Unused imports detected',
      file: 'utils.ts',
      line: 12,
      category: 'Code Quality',
      suggestion: 'Remove unused imports to reduce bundle size'
    },
    {
      id: '4',
      severity: 'medium',
      title: 'Component complexity exceeds threshold',
      file: 'ProjectDetail.tsx',
      line: 0,
      category: 'Maintainability',
      suggestion: 'Consider breaking down into smaller components'
    },
    {
      id: '5',
      severity: 'low',
      title: 'Missing JSDoc comments',
      file: 'api.service.ts',
      line: 34,
      category: 'Documentation',
      suggestion: 'Add JSDoc comments for better code documentation'
    },
  ];

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

  const handleRunAnalysis = () => {
    toast({
      title: "Analysis Started",
      description: "AI is analyzing your codebase for issues and improvements...",
    });
    // TODO: Implement actual analysis functionality
    setTimeout(() => {
      toast({
        title: "Analysis Complete",
        description: "Found 24 issues and 47 AI suggestions!",
      });
    }, 3000);
  };

  const handleViewCode = (file: string, line: number) => {
    toast({
      title: "Opening Code",
      description: `${file}:${line}`,
    });
    console.log(`Opening: ${file}:${line}`);
  };

  const handleApplyFix = (issueTitle: string) => {
    toast({
      title: "Applying Fix",
      description: `AI is fixing: ${issueTitle}`,
    });
    setTimeout(() => {
      toast({
        title: "Fix Applied",
        description: "Code has been updated successfully!",
      });
    }, 1500);
  };

  const handleIgnoreIssue = (issueTitle: string) => {
    toast({
      title: "Issue Ignored",
      description: `"${issueTitle}" will not be shown again.`,
    });
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
              <div className="text-3xl font-bold text-neutral-900">84%</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-medium">+5.2% from last week</span>
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
              <div className="text-3xl font-bold text-neutral-900">24</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <TrendingDown className="h-3.5 w-3.5" />
                <span className="font-medium">-12% from last week</span>
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
              <div className="text-3xl font-bold text-brand-primary">47</div>
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
              <div className="text-3xl font-bold text-brand-primary">2.4s</div>
              <p className="mt-2 text-xs text-neutral-600">Average scan time</p>
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
                                  onClick={() => handleApplyFix(issue.title)}
                                >
                                  <Zap className="h-3 w-3" />
                                  Apply Fix
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 text-xs text-neutral-500 hover:bg-neutral-50"
                                  onClick={() => handleIgnoreIssue(issue.title)}
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

