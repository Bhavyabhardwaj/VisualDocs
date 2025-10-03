import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { PageWrapper } from '@/components/app/PageWrapper';
import { 
  Plus,
  Github,
  BarChart3,
  Clock,
  Users,
  FileText,
  Workflow,
  TrendingUp,
  Activity,
  Star,
  GitBranch,
  Calendar
} from 'lucide-react';

// Mock data - replace with real API calls
const stats = [
  {
    name: 'Total Projects',
    value: '12',
    change: '+2 this week',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    name: 'Code Quality Score',
    value: '94/100',
    change: '+3 points',
    changeType: 'positive' as const,
    icon: BarChart3,
  },
  {
    name: 'Documentation Coverage',
    value: '87%',
    change: '+12% this month',
    changeType: 'positive' as const,
    icon: FileText,
  },
  {
    name: 'Active Collaborators',
    value: '8',
    change: '+1 this week',
    changeType: 'positive' as const,
    icon: Users,
  },
];

const recentProjects = [
  {
    id: '1',
    name: 'VisualDocs Frontend',
    description: 'React TypeScript frontend application',
    language: 'TypeScript',
    qualityScore: 94,
    lastUpdated: '2 hours ago',
    status: 'analyzing' as const,
  },
  {
    id: '2',
    name: 'API Gateway Service',
    description: 'Node.js REST API with Express',
    language: 'JavaScript',
    qualityScore: 89,
    lastUpdated: '1 day ago',
    status: 'completed' as const,
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'React Native mobile application',
    language: 'TypeScript',
    qualityScore: 91,
    lastUpdated: '3 days ago',
    status: 'completed' as const,
  },
];

const recentActivity = [
  {
    id: '1',
    type: 'analysis_completed',
    message: 'Code analysis completed for VisualDocs Frontend',
    time: '2 hours ago',
    icon: BarChart3,
  },
  {
    id: '2',
    type: 'diagram_generated',
    message: 'Architecture diagram generated for API Gateway',
    time: '1 day ago',
    icon: Workflow,
  },
  {
    id: '3',
    type: 'project_imported',
    message: 'New project imported: Mobile App',
    time: '3 days ago',
    icon: Github,
  },
  {
    id: '4',
    type: 'collaboration',
    message: 'Sarah Johnson joined API Gateway project',
    time: '1 week ago',
    icon: Users,
  },
];

export const Dashboard: React.FC = () => {
  return (
    <PageWrapper
      title="Dashboard"
      description="Welcome back! Here's what's happening with your projects."
      actions={
        <>
          <Button variant="outline" icon={<Github className="w-4 h-4" />}>
            Import Repository
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        </>
      }
    >
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.name} variant="elevated" hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
                      {stat.name}
                    </p>
                    <p className="text-3xl font-bold text-light-text dark:text-dark-text">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${
                      stat.changeType === 'positive' 
                        ? 'text-success-600' 
                        : 'text-error-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your most recently updated projects
                  </CardDescription>
                </div>
                <Link to="/app/projects">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className={`p-6 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors cursor-pointer ${
                        index !== recentProjects.length - 1 ? 'border-b app-border' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                                {project.name}
                              </p>
                              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                                {project.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-light-text dark:text-dark-text">
                              {project.qualityScore}/100
                            </p>
                            <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              Quality Score
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {project.status === 'analyzing' ? (
                              <div className="w-2 h-2 bg-warning-500 rounded-full animate-pulse" />
                            ) : (
                              <div className="w-2 h-2 bg-success-500 rounded-full" />
                            )}
                            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                              {project.lastUpdated}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates from your projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-light-bg-secondary dark:bg-dark-bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-light-text-secondary dark:text-dark-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-light-text dark:text-dark-text">
                        {activity.message}
                      </p>
                      <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card variant="flat" className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">
                  Ready to analyze your next project?
                </h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  Import a repository from GitHub or upload your codebase to get started.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" icon={<Github className="w-4 h-4" />}>
                  Import from GitHub
                </Button>
                <Button icon={<Plus className="w-4 h-4" />}>
                  New Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};
