import { useState } from 'react';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Zap,
  FileText, Code, GitBranch, Users, Clock, Download, Filter,
  ChevronDown, Calendar, BarChart3, PieChart, Activity, Sparkles,
  ArrowUpRight, AlertTriangle, Info, XCircle, Target, Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      low: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Info },
    };
    return configs[severity as keyof typeof configs] || configs.low;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2.5 shadow-sm">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-gray-900">AI Analysis</h1>
                  <p className="text-sm text-gray-600 mt-1">Intelligent insights for your codebase</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
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
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800">
                <Sparkles className="h-4 w-4" />
                Run Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Quality</CardTitle>
              <div className="rounded-lg bg-emerald-50 p-2">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">84%</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="font-medium">+5.2% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Issues Found</CardTitle>
              <div className="rounded-lg bg-red-50 p-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">24</div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <TrendingDown className="h-3.5 w-3.5" />
                <span className="font-medium">-12% from last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">AI Suggestions</CardTitle>
              <div className="rounded-lg bg-purple-50 p-2">
                <Sparkles className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">47</div>
              <p className="mt-2 text-xs text-gray-600">Ready to implement</p>
            </CardContent>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Analysis Time</CardTitle>
              <div className="rounded-lg bg-blue-50 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">2.4s</div>
              <p className="mt-2 text-xs text-gray-600">Average scan time</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Quality Metrics & Issues */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quality Metrics */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Quality Metrics</CardTitle>
                    <CardDescription className="mt-1">Track code quality across key dimensions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
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
                          <span className="text-sm font-medium text-gray-900">{metric.name}</span>
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
                        <span className="text-sm font-bold text-gray-900">{metric.score}%</span>
                      </div>
                      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                            metric.score >= 90
                              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                              : metric.score >= 70
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
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
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Detected Issues</CardTitle>
                    <CardDescription className="mt-1">AI-powered code analysis results</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
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
                                  <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {issue.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-600">
                                    <Badge className="bg-white border-gray-200 text-gray-700 text-xs">
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
                              
                              <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-white border border-gray-200">
                                <Sparkles className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="text-xs font-medium text-gray-900 mb-1">AI Suggestion:</div>
                                  <div className="text-xs text-gray-600 leading-relaxed">{issue.suggestion}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 mt-3">
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 hover:bg-white">
                                  <Code className="h-3 w-3" />
                                  View Code
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5 hover:bg-white">
                                  <Sparkles className="h-3 w-3" />
                                  Apply Fix
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs hover:bg-white">
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
            <Card className="border-gray-200 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
                </div>
                <CardDescription>Smart recommendations from our AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Great Progress!</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Your code quality improved by 5% this week. Keep up the excellent work!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Focus Area</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Consider improving test coverage in the authentication module to reach 95% coverage.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">Performance Tip</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Implementing lazy loading could reduce initial bundle size by approximately 23%.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Statistics */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Code Statistics</CardTitle>
                <CardDescription>Analysis of your codebase</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-gray-200">
                      <FileText className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Total Files</div>
                      <div className="text-xs text-gray-600">TypeScript & React</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">247</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-gray-200">
                      <Code className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Lines of Code</div>
                      <div className="text-xs text-gray-600">Excluding comments</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">18.5K</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-gray-200">
                      <GitBranch className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Complexity</div>
                      <div className="text-xs text-gray-600">Cyclomatic average</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">4.2</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white p-2 border border-gray-200">
                      <Users className="h-4 w-4 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Contributors</div>
                      <div className="text-xs text-gray-600">Last 30 days</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-900">12</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Export Full Report (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                  <Sparkles className="h-4 w-4" />
                  Generate Improvement Plan
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2 hover:bg-gray-50">
                  <Calendar className="h-4 w-4" />
                  Schedule Weekly Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
