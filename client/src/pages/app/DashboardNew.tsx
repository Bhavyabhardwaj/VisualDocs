import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Mail,
  Phone,
  DollarSign,
  Activity,
  Code2,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, Bar, BarChart, XAxis, YAxis } from 'recharts';

const emailData = [
  { date: 'Sep 1-7', contacted: 225, replied: 162 },
  { date: 'Sep 8-14', contacted: 225, replied: 162 },
  { date: 'Sep 15-21', contacted: 225, replied: 162 },
  { date: 'Sep 22-28', contacted: 300, replied: 180 },
  { date: 'Sep 29-30', contacted: 200, replied: 145 },
];

const pipelineData = [
  { name: 'Sep 1', value: 42 },
  { name: 'Sep 5', value: 45 },
  { name: 'Sep 10', value: 48 },
  { name: 'Sep 15', value: 52 },
  { name: 'Sep 20', value: 50 },
  { name: 'Sep 25', value: 55 },
  { name: 'Sep 30', value: 42 },
];

const salesData = [
  { name: 'Sep 1', value: 38 },
  { name: 'Sep 5', value: 35 },
  { name: 'Sep 10', value: 42 },
  { name: 'Sep 12', value: 48 },
  { name: 'Sep 20', value: 45 },
  { name: 'Sep 25', value: 38 },
  { name: 'Sep 30', value: 38 },
];

const closedDealsData = [
  { name: 'Sep 1', value: 12 },
  { name: 'Sep 5', value: 10 },
  { name: 'Sep 10', value: 11 },
  { name: 'Sep 15', value: 13 },
  { name: 'Sep 20', value: 11 },
  { name: 'Sep 25', value: 10 },
  { name: 'Sep 30', value: 12 },
];

export default function DashboardNew() {
  const [isDark, setIsDark] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'agents', icon: Users, label: 'AI Agents' },
    { id: 'docs', icon: FileText, label: 'Documents' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const stats = [
    {
      label: 'Contacted Leads',
      value: '1,234',
      change: '+12.2%',
      trend: 'up',
      icon: Mail,
    },
    {
      label: 'Positive Replies',
      value: '670',
      change: '+24%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      label: 'Booked Calls',
      value: '42',
      change: '-12.2%',
      trend: 'down',
      icon: Phone,
    },
    {
      label: 'Cash Collected',
      value: '$125,400',
      change: '+28%',
      trend: 'up',
      icon: DollarSign,
    },
  ];

  return (
    <div className={`flex h-screen ${isDark ? 'dark' : ''}`}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-[280px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-violet-600 rounded-lg blur-sm opacity-70" />
              <div className="relative bg-gradient-to-br from-emerald-400 to-violet-600 p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Lunar Workspace</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs text-gray-600 dark:text-gray-400">
              /
            </kbd>
          </div>
        </div>

        {/* AI Consultant Badge */}
        <div className="px-4 mb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-violet-600/20 rounded-xl blur opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-emerald-500/10 to-violet-600/10 border border-emerald-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">AI Consultant</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Ready to assist you</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                whileHover={{ x: 4 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
          {/* Acquisition Section */}
          <div>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Acquisition</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">john@example.com</p>
            </div>
            <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <LogOut className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Good evening, John!</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Here's your business performance overview</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-violet-600 text-white rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                New Project
              </motion.button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Tab Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-medium text-gray-900 dark:text-white shadow-sm">
              <Mail className="w-4 h-4 inline mr-2" />
              Cold Email
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Activity className="w-4 h-4 inline mr-2" />
              Meta Ads
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Cold Email Conversions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cold Email Conversions</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-900 dark:bg-white rounded-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Contacted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Replies</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={emailData}>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                      border: '1px solid',
                      borderColor: isDark ? '#374151' : '#E5E7EB',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="contacted" fill={isDark ? '#FFFFFF' : '#000000'} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="replied" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Conversion Rates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversion Rates</h3>
                <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                  View Details
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-6">Key performance indicators</p>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Positive Reply Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">9.1%</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">-3.1%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Target: 12%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" style={{ width: '76%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Booked Call Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">22.6%</span>
                      <span className="text-sm text-red-600 dark:text-red-400">-1.0%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>Target: 25%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-500 rounded-full" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pipeline Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Pipeline Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Booked Calls', value: '42', percentage: '3.4%', data: pipelineData },
                { label: 'Sales Calls', value: '38', percentage: '3.1%', data: salesData },
                { label: 'Closed Deals', value: '12', percentage: '1.1%', data: closedDealsData },
              ].map((metric, idx) => (
                <div key={metric.label} className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{metric.percentage}</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={80}>
                    <LineChart data={metric.data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={idx === 0 ? '#3B82F6' : idx === 1 ? '#8B5CF6' : '#10B981'}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Sales Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sales Performance</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sales Calls Taken</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">22.6%</span>
                      <span className="text-sm text-red-600 dark:text-red-400">-1.2%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: '22.6%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Close Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">31.6%</span>
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">+2.7%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '31.6%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-violet-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Upgrade to Pro</h3>
              <p className="text-sm text-white/80 mb-4">
                Get access to advanced analytics, unlimited projects, and priority support.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
              >
                Upgrade Now
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
