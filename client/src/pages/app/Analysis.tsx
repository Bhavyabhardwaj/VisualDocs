import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PageWrapper } from '@/components/app/PageWrapper';
import { 
  BarChart3,
  Download,
  Share,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Users,
  Target
} from 'lucide-react';

// Mock data - replace with real API
const analysisData = {
  overallScore: 94,
  previousScore: 91,
  lastAnalyzed: '2 hours ago',
  totalFiles: 247,
  linesOfCode: 15420,
  
  metrics: [
    {
      name: 'Maintainability',
      score: 92,
      previousScore: 89,
      description: 'How easy it is to modify and extend the code',
      status: 'good',
      details: [
        'Low cyclomatic complexity',
        'Good separation of concerns',
        'Consistent naming conventions'
      ]
    },
    {
      name: 'Reliability',
      score: 96,
      previousScore: 94,
      description: 'Code quality and error handling',
      status: 'excellent',
      details: [
        'Comprehensive error handling',
        'High test coverage',
        'Minimal code duplication'
      ]
    },
    {
      name: 'Security',
      score: 89,
      previousScore: 92,
      description: 'Security vulnerabilities and best practices',
      status: 'warning',
      details: [
        '2 minor vulnerabilities found',
        'Missing input validation in 3 files',
        'Good authentication practices'
      ]
    },
    {
      name: 'Performance',
      score: 91,
      previousScore: 88,
      description: 'Runtime performance and optimization',
      status: 'good',
      details: [
        'Efficient algorithms used',
        'Some optimization opportunities',
        'Good memory management'
      ]
    }
  ],

  issues: [
    {
      type: 'error',
      severity: 'high',
      file: 'src/utils/api.ts',
      line: 45,
      message: 'Potential SQL injection vulnerability',
      suggestion: 'Use parameterized queries'
    },
    {
      type: 'warning',
      severity: 'medium',
      file: 'src/components/UserForm.tsx',
      line: 23,
      message: 'Missing input validation',
      suggestion: 'Add form validation for email field'
    },
    {
      type: 'info',
      severity: 'low',
      file: 'src/hooks/useAuth.ts',
      line: 67,
      message: 'Consider memoization for performance',
      suggestion: 'Use useMemo for expensive calculations'
    }
  ],

  trends: [
    { period: 'Jan', score: 78 },
    { period: 'Feb', score: 82 },
    { period: 'Mar', score: 85 },
    { period: 'Apr', score: 87 },
    { period: 'May', score: 89 },
    { period: 'Jun', score: 91 },
    { period: 'Jul', score: 94 }
  ]
};

export const Analysis: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState(analysisData.metrics[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-success-600 bg-success-50 dark:bg-success-900/20';
      case 'good': return 'text-primary-600 bg-primary-50 dark:bg-primary-900/20';
      case 'warning': return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20';
      case 'error': return 'text-error-600 bg-error-50 dark:bg-error-900/20';
      default: return 'text-light-text-secondary bg-light-bg-secondary dark:bg-dark-bg-tertiary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <PageWrapper
      title="Code Analysis"
      description="AI-powered insights into your code quality and architecture"
      actions={
        <>
          <Button 
            variant="outline" 
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Analyzing...' : 'Refresh'}
          </Button>
          <Button variant="outline" icon={<Share className="w-4 h-4" />}>
            Share Report
          </Button>
          <Button icon={<Download className="w-4 h-4" />}>
            Export Report
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Overall Score */}
        <Card variant="elevated" className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">
                  Overall Quality Score
                </h2>
                <p className="text-light-text-secondary dark:text-dark-text-secondary mb-4">
                  Last analyzed {analysisData.lastAnalyzed}
                </p>
                <div className="flex items-center space-x-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{analysisData.totalFiles} files</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-4 h-4" />
                    <span>{analysisData.linesOfCode.toLocaleString()} lines</span>
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-current text-light-bg-tertiary dark:text-dark-bg-tertiary"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="stroke-current text-primary-500"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={`${analysisData.overallScore}, 100`}
                      d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-light-text dark:text-dark-text">
                        {analysisData.overallScore}
                      </div>
                      <div className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        /100
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <TrendingUp className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-success-600 font-medium">
                    +{analysisData.overallScore - analysisData.previousScore} from last analysis
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Metrics */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>
                  Detailed breakdown of code quality aspects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {analysisData.metrics.map((metric, index) => (
                  <div
                    key={metric.name}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      selectedMetric.name === metric.name
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-light-border-secondary dark:border-dark-border-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                    }`}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                          {getStatusIcon(metric.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-light-text dark:text-dark-text">
                            {metric.name}
                          </h4>
                          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-light-text dark:text-dark-text">
                          {metric.score}
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          {metric.score >= metric.previousScore ? (
                            <TrendingUp className="w-3 h-3 text-success-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-error-600" />
                          )}
                          <span className={
                            metric.score >= metric.previousScore 
                              ? 'text-success-600' 
                              : 'text-error-600'
                          }>
                            {metric.score >= metric.previousScore ? '+' : ''}
                            {metric.score - metric.previousScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Metric Details */}
          <div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>{selectedMetric.name} Details</CardTitle>
                <CardDescription>
                  Score: {selectedMetric.score}/100
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-light-text dark:text-dark-text mb-3">
                    Key Findings
                  </h4>
                  <ul className="space-y-2">
                    {selectedMetric.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-success-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          {detail}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t app-border">
                  <Button variant="outline" size="sm" className="w-full">
                    View Detailed Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Issues & Recommendations */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Issues & Recommendations</CardTitle>
            <CardDescription>
              AI-identified areas for improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData.issues.map((issue, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-tertiary"
                >
                  <div className={`p-2 rounded-lg ${
                    issue.severity === 'high' ? 'bg-error-100 dark:bg-error-900/20 text-error-600' :
                    issue.severity === 'medium' ? 'bg-warning-100 dark:bg-warning-900/20 text-warning-600' :
                    'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                  }`}>
                    {issue.severity === 'high' ? <XCircle className="w-4 h-4" /> :
                     issue.severity === 'medium' ? <AlertTriangle className="w-4 h-4" /> :
                     <FileText className="w-4 h-4" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-light-text dark:text-dark-text">
                        {issue.message}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        issue.severity === 'high' ? 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400' :
                        issue.severity === 'medium' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                      }`}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
                      {issue.file}:{issue.line}
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Fix
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trends Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Quality Trends</CardTitle>
            <CardDescription>
              Code quality score over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analysisData.trends.map((point, index) => (
                <div key={point.period} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="text-sm font-medium text-light-text dark:text-dark-text">
                    {point.score}
                  </div>
                  <div
                    className="w-full bg-primary-500 rounded-t-md transition-all duration-300 hover:bg-primary-600"
                    style={{ 
                      height: `${(point.score / 100) * 200}px`,
                      minHeight: '8px'
                    }}
                  />
                  <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                    {point.period}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};
