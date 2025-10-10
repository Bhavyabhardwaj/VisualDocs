import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Code2, Users, Settings, LayoutDashboard, 
  FileCode, GitBranch, Clock, Star, TrendingUp, Sparkles,
  ChevronRight, MoreHorizontal, Trash2, Archive,
  Github, Upload, FolderGit2, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';
import { projectService } from '@/services';
import type { Project, UserPresence } from '@/types/api';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const socket = useSocket();
  
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<'all' | 'recent' | 'starred'>('all');
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeToday: 0,
    linesOfCode: 0,
    trending: 0
  });

  // Load projects
  useEffect(() => {
    loadProjects();
  }, []);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('user-presence-update', (users: UserPresence[]) => {
      setOnlineUsers(users);
    });

    socket.on('project-updated', (updatedProject: Project) => {
      setProjects(prev => prev.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ));
    });

    return () => {
      socket.off('user-presence-update');
      socket.off('project-updated');
    };
  }, [socket]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data.projects || []);
      
      // Calculate stats
      setStats({
        totalProjects: data.projects?.length || 0,
        activeToday: data.projects?.filter((p: Project) => 
          new Date(p.updatedAt).toDateString() === new Date().toDateString()
        ).length || 0,
        linesOfCode: data.projects?.reduce((acc: number, p: Project) => acc + (p.linesOfCode || 0), 0) || 0,
        trending: data.projects?.filter((p: Project) => p.starred).length || 0
      });
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesView = selectedView === 'all' || 
                        (selectedView === 'recent' && new Date(project.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
                        (selectedView === 'starred' && project.starred);
    return matchesSearch && matchesView;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-6">
            <Link to="/app/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-neutral-900 rounded-md flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">VisualDocs</span>
            </Link>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 h-8 bg-neutral-50 border-0 rounded-md text-sm focus:bg-white focus:ring-1 focus:ring-neutral-300 transition-all w-64"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <Link
              to="/app/analytics"
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Analytics
            </Link>
            
            <Link
              to="/app/team"
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Team
            </Link>
            
            <button
              onClick={() => navigate('/app/settings')}
              className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors"
            >
              <Settings className="w-4 h-4 text-neutral-600" />
            </button>
            
            <div className="w-px h-5 bg-neutral-200" />
            
            <div className="flex items-center gap-2">
              <div className="flex items-center -space-x-2">
                {onlineUsers.slice(0, 3).map((user) => (
                  <div
                    key={user.userId}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                    title={user.userName}
                  >
                    {user.userName?.charAt(0) || 'U'}
                  </div>
                ))}
              </div>
              {onlineUsers.length > 3 && (
                <span className="text-xs text-neutral-600">+{onlineUsers.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-14">
        <div className="max-w-7xl mx-auto px-6 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 mb-1">
              Projects
            </h1>
            <p className="text-neutral-600">
              Manage and collaborate on your documentation projects
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Total Projects</span>
                <LayoutDashboard className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-900">{stats.totalProjects}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Active Today</span>
                <Activity className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-900">{stats.activeToday}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Lines of Code</span>
                <FileCode className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-900">
                {(stats.linesOfCode / 1000).toFixed(1)}k
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-600">Starred</span>
                <Star className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="text-2xl font-semibold text-neutral-900">{stats.trending}</div>
            </motion.div>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedView('all')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  selectedView === 'all'
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                All
              </button>
              <button
                onClick={() => setSelectedView('recent')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  selectedView === 'recent'
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                Recent
              </button>
              <button
                onClick={() => setSelectedView('starred')}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  selectedView === 'starred'
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                )}
              >
                Starred
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {/* TODO: Import modal */}}
                className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                Import
              </button>
              <button
                onClick={() => {/* TODO: Upload modal */}}
                className="px-3 py-1.5 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCode className="w-6 h-6 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No projects found</h3>
              <p className="text-neutral-600 mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Get started by creating your first project'}
              </p>
              {!searchQuery && (
                <div className="flex items-center justify-center gap-3">
                  <button className="px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Project
                  </button>
                  <button className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    Import from GitHub
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onlineUsers={onlineUsers.filter(u => u.projectId === project.id)}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  index, 
  onlineUsers,
  onClick 
}: { 
  project: Project; 
  index: number;
  onlineUsers: UserPresence[];
  onClick: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group bg-white rounded-lg border border-neutral-200 p-5 hover:shadow-sm hover:border-neutral-300 transition-all cursor-pointer relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neutral-100 rounded-md flex items-center justify-center">
            <FileCode className="w-5 h-5 text-neutral-600" />
          </div>
          <div>
            <h3 className="font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-neutral-500">{project.language || 'Unknown'}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-10 w-40 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
        <div className="flex items-center gap-4 text-xs text-neutral-500">
          {project.branch && (
            <div className="flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5" />
              {project.branch}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {onlineUsers.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center -space-x-1.5">
              {onlineUsers.slice(0, 3).map((user) => (
                <div
                  key={user.userId}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-2 border-white flex items-center justify-center text-[10px] font-medium text-white"
                  title={user.userName}
                >
                  {user.userName?.charAt(0) || 'U'}
                </div>
              ))}
            </div>
            {onlineUsers.length > 3 && (
              <span className="text-xs text-neutral-500">+{onlineUsers.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-neutral-400" />
      </div>
    </motion.div>
  );
}
