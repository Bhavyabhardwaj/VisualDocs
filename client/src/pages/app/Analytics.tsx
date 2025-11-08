import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Clock,
  GitBranch,
  Activity,
  Zap
} from 'lucide-react';

export const Analytics = () => {
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Diagrams',
      value: '18',
      change: '+8%',
      trend: 'up',
      icon: GitBranch,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Team Members',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Avg. Response Time',
      value: '2.4s',
      change: '-15%',
      trend: 'up',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const activityData = [
    { date: 'Nov 1', projects: 5, diagrams: 8, analyses: 3 },
    { date: 'Nov 2', projects: 7, diagrams: 12, analyses: 5 },
    { date: 'Nov 3', projects: 4, diagrams: 6, analyses: 4 },
    { date: 'Nov 4', projects: 9, diagrams: 15, analyses: 7 },
    { date: 'Nov 5', projects: 6, diagrams: 10, analyses: 6 },
    { date: 'Nov 6', projects: 8, diagrams: 14, analyses: 8 },
    { date: 'Nov 7', projects: 11, diagrams: 18, analyses: 9 },
  ];

  const topProjects = [
    { name: 'E-commerce Platform', activity: 156, members: 8, status: 'active' },
    { name: 'Mobile App Redesign', activity: 142, members: 6, status: 'active' },
    { name: 'API Integration', activity: 98, members: 4, status: 'in-progress' },
    { name: 'Database Migration', activity: 87, members: 5, status: 'in-progress' },
    { name: 'Security Audit', activity: 73, members: 3, status: 'active' },
  ];

  const recentActivity = [
    { user: 'John Doe', action: 'created a new diagram', project: 'E-commerce Platform', time: '5 min ago' },
    { user: 'Jane Smith', action: 'ran AI analysis', project: 'Mobile App Redesign', time: '12 min ago' },
    { user: 'Mike Johnson', action: 'updated project', project: 'API Integration', time: '25 min ago' },
    { user: 'Sarah Williams', action: 'added team member', project: 'Database Migration', time: '1 hour ago' },
    { user: 'Tom Brown', action: 'exported diagram', project: 'Security Audit', time: '2 hours ago' },
  ];

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-8 w-8 text-brand-primary" />
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            </div>
            <p className="text-gray-600">
              Track your team's productivity and project insights
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">{stat.change}</span>
                          <span className="text-sm text-gray-600">vs last week</span>
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Activity Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Your team's activity over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                    {activityData.map((day, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex flex-col gap-1 items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                            style={{ height: `${(day.projects / 11) * 200}px` }}
                            title={`Projects: ${day.projects}`}
                          />
                          <div 
                            className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                            style={{ height: `${(day.diagrams / 18) * 200}px` }}
                            title={`Diagrams: ${day.diagrams}`}
                          />
                          <div 
                            className="w-full bg-purple-500 rounded-t transition-all hover:bg-purple-600"
                            style={{ height: `${(day.analyses / 9) * 200}px` }}
                            title={`Analyses: ${day.analyses}`}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{day.date}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded" />
                      <span className="text-sm text-gray-600">Projects</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded" />
                      <span className="text-sm text-gray-600">Diagrams</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded" />
                      <span className="text-sm text-gray-600">AI Analyses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className="p-2 bg-brand-bg rounded-full">
                          <Zap className="h-4 w-4 text-brand-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>{' '}
                            <span className="text-gray-600">{activity.action}</span>{' '}
                            <span className="font-medium text-brand-primary">{activity.project}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Top Projects by Activity</CardTitle>
                  <CardDescription>Most active projects this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topProjects.map((project, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-2xl font-bold text-gray-400">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{project.name}</h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-600">{project.activity} activities</span>
                              <span className="text-sm text-gray-600">{project.members} members</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Individual contributor statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown'].map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold">
                            {member.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-medium">{member}</h3>
                            <p className="text-sm text-gray-600">{Math.floor(Math.random() * 50) + 20} contributions this week</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-primary rounded-full"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PremiumLayout>
  );
};
