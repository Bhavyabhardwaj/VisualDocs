import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, TrendingUp, TrendingDown, Activity, Code2, Users,
  GitBranch, Clock, FileCode, Target, Zap, Award, AlertCircle,
  CheckCircle, XCircle, Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectService } from '@/services';
import type { Project } from '@/types/api';

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Mock analytics data - replace with real API calls
  const [analytics] = useState({
    overview: {
      totalProjects: 24,
      totalFiles: 1247,
      totalLines: 125430,
      codeQuality: 94,
      activeProjects: 8,
      contributors: 12
    },
    trends: {
      projects: { value: 15, trend: 'up' as const },
      lines: { value: 12.5, trend: 'up' as const },
      quality: { value: 3, trend: 'up' as const },
      activity: { value: 8, trend: 'down' as const }
    },
    languages: [
      { name: 'TypeScript', percentage: 45, lines: 56443, color: '#3178C6' },
      { name: 'JavaScript', percentage: 30, lines: 37629, color: '#F7DF1E' },
      { name: 'Python', percentage: 15, lines: 18815, color: '#3776AB' },
      { name: 'Go', percentage: 10, lines: 12543, color: '#00ADD8' }
    ],
    quality: {
      excellent: 18,
      good: 4,
      fair: 2,
      poor: 0
    },
    activity: [
      { date: 'Mon', commits: 12, reviews: 5, comments: 8 },
      { date: 'Tue', commits: 15, reviews: 7, comments: 12 },
      { date: 'Wed', commits: 8, reviews: 3, comments: 6 },
      { date: 'Thu', commits: 20, reviews: 9, comments: 15 },
      { date: 'Fri', commits: 18, reviews: 8, comments: 14 },
      { date: 'Sat', commits: 5, reviews: 2, comments: 3 },
      { date: 'Sun', commits: 3, reviews: 1, comments: 2 }
    ],
    topProjects: [
      { name: 'VisualDocs Frontend', quality: 96, lines: 45230, activity: 89 },
      { name: 'API Gateway', quality: 94, lines: 32450, activity: 76 },
      { name: 'Mobile App', quality: 92, lines: 28900, activity: 68 },
      { name: 'Admin Dashboard', quality: 88, lines: 19320, activity: 54 }
    ]
  });

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data || []);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600" />
            </button>
            <h1 className="text-sm font-semibold text-neutral-900">Analytics</h1>
          </div>

          <div className="flex items-center gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  timeRange === range
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-6 mt-6">
          
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard
              title="Total Projects"
              value={analytics.overview.totalProjects}
              trend={analytics.trends.projects}
              icon={<FileCode className="w-4 h-4" />}
            />
            <StatCard
              title="Total Files"
              value={analytics.overview.totalFiles.toLocaleString()}
              icon={<Code2 className="w-4 h-4" />}
            />
            <StatCard
              title="Lines of Code"
              value={`${(analytics.overview.totalLines / 1000).toFixed(0)}k`}
              trend={analytics.trends.lines}
              icon={<Activity className="w-4 h-4" />}
            />
            <StatCard
              title="Code Quality"
              value={`${analytics.overview.codeQuality}%`}
              trend={analytics.trends.quality}
              icon={<Target className="w-4 h-4" />}
            />
            <StatCard
              title="Active Projects"
              value={analytics.overview.activeProjects}
              icon={<Zap className="w-4 h-4" />}
            />
            <StatCard
              title="Contributors"
              value={analytics.overview.contributors}
              icon={<Users className="w-4 h-4" />}
            />
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Activity Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">Activity Overview</h2>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neutral-900 rounded"></div>
                    <span className="text-neutral-600">Commits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neutral-400 rounded"></div>
                    <span className="text-neutral-600">Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-neutral-200 rounded"></div>
                    <span className="text-neutral-600">Comments</span>
                  </div>
                </div>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2">
                {analytics.activity.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1 items-center justify-end h-full">
                      <div
                        className="w-full bg-neutral-900 rounded-t hover:bg-neutral-800 transition-colors cursor-pointer relative group"
                        style={{ height: `${(day.commits / 20) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {day.commits} commits
                        </div>
                      </div>
                      <div
                        className="w-full bg-neutral-400 hover:bg-neutral-500 transition-colors cursor-pointer relative group"
                        style={{ height: `${(day.reviews / 20) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {day.reviews} reviews
                        </div>
                      </div>
                      <div
                        className="w-full bg-neutral-200 rounded-b hover:bg-neutral-300 transition-colors cursor-pointer relative group"
                        style={{ height: `${(day.comments / 20) * 100}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          {day.comments} comments
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-neutral-500 mt-2">{day.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Quality Distribution */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Code Quality</h2>
              
              <div className="space-y-4">
                <QualityBar
                  label="Excellent"
                  count={analytics.quality.excellent}
                  total={analytics.overview.totalProjects}
                  color="bg-green-500"
                  icon={<CheckCircle className="w-4 h-4 text-green-600" />}
                />
                <QualityBar
                  label="Good"
                  count={analytics.quality.good}
                  total={analytics.overview.totalProjects}
                  color="bg-blue-500"
                  icon={<CheckCircle className="w-4 h-4 text-blue-600" />}
                />
                <QualityBar
                  label="Fair"
                  count={analytics.quality.fair}
                  total={analytics.overview.totalProjects}
                  color="bg-yellow-500"
                  icon={<AlertCircle className="w-4 h-4 text-yellow-600" />}
                />
                <QualityBar
                  label="Poor"
                  count={analytics.quality.poor}
                  total={analytics.overview.totalProjects}
                  color="bg-red-500"
                  icon={<XCircle className="w-4 h-4 text-red-600" />}
                />
              </div>
            </div>
          </div>

          {/* Language Distribution & Top Projects */}
          <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Language Distribution */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Languages</h2>
              
              <div className="space-y-4">
                {analytics.languages.map((lang, i) => (
                  <motion.div
                    key={lang.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-sm font-medium text-neutral-900">{lang.name}</span>
                      </div>
                      <span className="text-sm text-neutral-600">
                        {lang.lines.toLocaleString()} lines
                      </span>
                    </div>
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lang.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: lang.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Projects */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-6">Top Projects</h2>
              
              <div className="space-y-4">
                {analytics.topProjects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-neutral-100 rounded-md flex items-center justify-center group-hover:bg-neutral-200 transition-colors">
                        <Award className="w-4 h-4 text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-neutral-900">{project.name}</div>
                        <div className="text-xs text-neutral-500">
                          {project.lines.toLocaleString()} lines
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Quality</div>
                        <div className="text-sm font-semibold text-neutral-900">{project.quality}%</div>
                      </div>
                      <div className="w-12 h-12">
                        <svg className="transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#E5E5E5"
                            strokeWidth="3"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="#171717"
                            strokeWidth="3"
                            strokeDasharray={`${project.activity} 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  trend, 
  icon 
}: { 
  title: string; 
  value: string | number; 
  trend?: { value: number; trend: 'up' | 'down' };
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-neutral-500">{title}</span>
        <div className="text-neutral-400">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-neutral-900">{value}</div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend.trend === 'up' ? "text-green-600" : "text-red-600"
          )}>
            {trend.trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Quality Bar Component
function QualityBar({ 
  label, 
  count, 
  total, 
  color, 
  icon 
}: { 
  label: string; 
  count: number; 
  total: number; 
  color: string;
  icon: React.ReactNode;
}) {
  const percentage = (count / total) * 100;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium text-neutral-900">{label}</span>
        </div>
        <span className="text-sm text-neutral-600">{count} projects</span>
      </div>
      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8 }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}
