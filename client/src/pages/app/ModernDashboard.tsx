import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Code2, Users, Settings, LayoutDashboard, 
  FileCode, TrendingUp, TrendingDown,
  ChevronRight, MoreHorizontal, Activity,
  Bell, Menu, X,
  BarChart3, Folder, Database, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';
import { projectService } from '@/services';
import type { Project } from '@/types/api';

export default function ModernDashboard() {
  const navigate = useNavigate();
  const socket = useSocket();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery] = useState('');
  const [selectedView] = useState<'all' | 'recent' | 'starred'>('all');
  const [timeRange, setTimeRange] = useState('90d');
  
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeToday: 0,
    linesOfCode: 0,
    collaborators: 0
  });

  // Chart data for visualization
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadProjects();
    generateChartData();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.onUserJoined(() => {
      // Handle user joined
    });

    socket.onUserLeft(() => {
      // Handle user left
    });
  }, [socket]);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      const projectsData = response.data?.items || [];
      setProjects(projectsData);
      
      setStats({
        totalProjects: projectsData.length,
        activeToday: projectsData.filter((p: Project) => 
          new Date(p.updatedAt).toDateString() === new Date().toDateString()
        ).length,
        linesOfCode: projectsData.reduce((acc: number, p: any) => acc + (p.linesOfCode || 0), 0),
        collaborators: new Set(projectsData.flatMap((p: any) => p.collaborators || [])).size
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    }
  };

  const generateChartData = () => {
    const data = [];
    const now = new Date();
    const days = timeRange === '90d' ? 90 : timeRange === '30d' ? 30 : 7;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        projects: Math.floor(Math.random() * 100) + 50,
        commits: Math.floor(Math.random() * 80) + 30
      });
    }
    setChartData(data);
  };

  useEffect(() => {
    generateChartData();
  }, [timeRange]);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView = selectedView === 'all' || 
                        (selectedView === 'recent' && new Date(project.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
                        (selectedView === 'starred' && (project as any).starred);
    return matchesSearch && matchesView;
  });

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/app/dashboard' },
    { name: 'Analytics', icon: BarChart3, href: '/app/analytics' },
    { name: 'Projects', icon: Folder, href: '/app/projects' },
    { name: 'Team', icon: Users, href: '/app/team' },
  ];

  const documentItems = [
    { name: 'Data Library', icon: Database },
    { name: 'Reports', icon: FileText },
    { name: 'Documentation', icon: FileCode },
  ];

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 288 : 64 }}
        className="bg-white border-r border-neutral-200 flex flex-col transition-all duration-300"
      >
        {/* Sidebar Header */}
        <div className="h-12 border-b border-neutral-200 flex items-center justify-between px-4">
          {sidebarOpen && (
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-neutral-900 rounded-md flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-neutral-900 text-sm">Acme Inc.</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Create Button */}
        <div className="p-2">
          <button
            onClick={() => navigate('/app/projects/new')}
            className="w-full flex items-center gap-2 px-3 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            {sidebarOpen && <span>Quick Create</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  item.name === 'Dashboard'
                    ? "bg-neutral-100 text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          {sidebarOpen && (
            <>
              <div className="mt-6 mb-2 px-3">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Documents
                </div>
              </div>
              <div className="space-y-0.5">
                {documentItems.map((item) => (
                  <button
                    key={item.name}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-neutral-200 p-2">
          <button
            onClick={() => navigate('/app/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </button>
          
          {sidebarOpen && (
            <div className="mt-2 px-3 py-2 bg-neutral-50 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  CN
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-neutral-900 truncate">shadcn</div>
                  <div className="text-xs text-neutral-600 truncate">m@example.com</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-semibold text-neutral-900">Documents</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
              <Bell className="w-4 h-4 text-neutral-600" />
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors">
              GitHub
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-t from-primary/5 to-white border border-neutral-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-600">Total Projects</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded">
                    <TrendingUp className="w-3 h-3" />
                    +12.5%
                  </div>
                </div>
                <div className="text-3xl font-semibold text-neutral-900 mb-1 tabular-nums">
                  {stats.totalProjects}
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-neutral-700">
                    Trending up this month <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-neutral-500">
                    Active development projects
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-t from-primary/5 to-white border border-neutral-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-600">Active Today</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded">
                    <TrendingDown className="w-3 h-3" />
                    -5%
                  </div>
                </div>
                <div className="text-3xl font-semibold text-neutral-900 mb-1 tabular-nums">
                  {stats.activeToday}
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-neutral-700">
                    Projects updated today <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-neutral-500">
                    Collaboration in progress
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-t from-primary/5 to-white border border-neutral-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-600">Lines of Code</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded">
                    <TrendingUp className="w-3 h-3" />
                    +8.2%
                  </div>
                </div>
                <div className="text-3xl font-semibold text-neutral-900 mb-1 tabular-nums">
                  {(stats.linesOfCode / 1000).toFixed(1)}k
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-neutral-700">
                    Strong codebase growth <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-neutral-500">
                    Across all repositories
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-t from-primary/5 to-white border border-neutral-200 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-neutral-600">Team Members</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded">
                    <TrendingUp className="w-3 h-3" />
                    +4.5%
                  </div>
                </div>
                <div className="text-3xl font-semibold text-neutral-900 mb-1 tabular-nums">
                  {stats.collaborators || 12}
                </div>
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center gap-2 font-medium text-neutral-700">
                    Active collaborators <Users className="w-4 h-4" />
                  </div>
                  <div className="text-neutral-500">
                    Contributing to projects
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chart */}
            <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">Activity Overview</h2>
                  <p className="text-sm text-neutral-600 mt-1">
                    {timeRange === '90d' ? 'Total for the last 3 months' : timeRange === '30d' ? 'Last 30 days' : 'Last 7 days'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Last 3 months', value: '90d' },
                    { label: 'Last 30 days', value: '30d' },
                    { label: 'Last 7 days', value: '7d' }
                  ].map((period) => (
                    <button
                      key={period.value}
                      onClick={() => setTimeRange(period.value)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                        timeRange === period.value
                          ? "bg-neutral-100 text-neutral-900"
                          : "text-neutral-600 hover:bg-neutral-50"
                      )}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Area Chart Visualization */}
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" className="text-neutral-400" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-neutral-400" />
                    </linearGradient>
                  </defs>
                  
                  {/* Generate path */}
                  <path
                    d={`M 0,${200 - (chartData[0]?.projects || 50)} ${chartData.map((d, i) => 
                      `L ${(i / (chartData.length - 1)) * 800},${200 - (d.projects || 50)}`
                    ).join(' ')} L 800,200 L 0,200 Z`}
                    fill="url(#areaGradient)"
                  />
                  <path
                    d={`M 0,${200 - (chartData[0]?.projects || 50)} ${chartData.map((d, i) => 
                      `L ${(i / (chartData.length - 1)) * 800},${200 - (d.projects || 50)}`
                    ).join(' ')}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-neutral-600"
                  />
                </svg>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${chartData.length}, 1fr)` }}>
                  {chartData.map((_, i) => (
                    <div key={i} className="hover:bg-neutral-100/50 transition-colors cursor-pointer" />
                  ))}
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-neutral-900">Recent Projects</h2>
                  <Link
                    to="/app/projects"
                    className="text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/50">
                      <th className="text-left text-xs font-medium text-neutral-600 px-4 py-3">Project</th>
                      <th className="text-left text-xs font-medium text-neutral-600 px-4 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-neutral-600 px-4 py-3">Last Updated</th>
                      <th className="text-left text-xs font-medium text-neutral-600 px-4 py-3">Members</th>
                      <th className="text-right text-xs font-medium text-neutral-600 px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.slice(0, 5).map((project, index) => (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileCode className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-neutral-900">{project.name}</div>
                              <div className="text-xs text-neutral-600">{project.description || 'No description'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-neutral-700">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
