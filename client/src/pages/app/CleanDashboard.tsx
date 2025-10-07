import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FolderGit2, Search, Plus, FileCode, Users,
  Settings, LogOut, MoreHorizontal, Clock,
  Eye, Trash2, LayoutGrid, LayoutList
} from 'lucide-react';
import { authService, projectService } from '@/services';
import type { Project } from '@/types/api';
import { cn } from '@/lib/utils';

export default function CleanDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });
      
      if (Array.isArray(projectsData.data)) {
        setProjects(projectsData.data);
      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {
        setProjects((projectsData.data as { projects: Project[] }).projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Notion style */}
      <aside className="w-60 border-r border-gray-200 flex flex-col bg-gray-50">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FileCode className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">VisualDocs</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <NavItem icon={LayoutGrid} label="Projects" active />
          <NavItem icon={Users} label="Collaboration" />
          <NavItem icon={Clock} label="Recent" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-600 mt-1">
                {projects.length} {projects.length === 1 ? 'project' : 'projects'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 text-gray-600",
                    viewMode === 'grid' && "bg-gray-100 text-gray-900"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 text-gray-600 border-l border-gray-300",
                    viewMode === 'list' && "bg-gray-100 text-gray-900"
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>

              {/* New project button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                return (
                  <div className="flex h-screen bg-neutral-50">
                    {/* Sidebar - Premium Notion/Cal.com style */}
                    <aside className="w-64 flex flex-col bg-white border-r border-neutral-200 shadow-sm">
                      {/* Logo */}
                      <div className="px-6 py-5 border-b border-neutral-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shadow-sm">
                            <FileCode className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-bold text-lg tracking-tight text-neutral-900">VisualDocs</span>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-64">
                      {/* Navigation */}
                      <nav className="flex-1 px-3 py-6 space-y-1">
                        <NavItem icon={LayoutGrid} label="Projects" active />
                        <NavItem icon={Users} label="Collaboration" />
                        <NavItem icon={Clock} label="Recent" />
                        <NavItem icon={Settings} label="Settings" />
                      </nav>

                      {/* User section */}
                      <div className="px-6 py-4 border-t border-neutral-200">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </aside>
}

// Navigation Item Component
function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
        active
          ? "bg-white text-gray-900 font-medium shadow-sm"
          : "text-gray-700 hover:bg-gray-200"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}

// Empty State
function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <FolderGit2 className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
      <p className="text-gray-600 mb-6 max-w-sm">
        Get started by creating your first project. Upload code or import from GitHub.
      </p>
      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Project
      </button>
    </div>
  );
}

// Projects Grid
function ProjectsGrid({ projects, viewMode }: { projects: Project[]; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  );
}

// Project Card (Grid view)
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <FileCode className="w-5 h-5 text-blue-600" />
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description || 'No description'}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{new Date(project.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="w-3 h-3" />
          <Trash2 className="w-3 h-3 hover:text-red-600 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

// Project List Item (List view)
function ProjectListItem({ project }: { project: Project }) {
  return (
    <div className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all cursor-pointer bg-white">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <FileCode className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
          <p className="text-sm text-gray-600 truncate">
            {project.description || 'No description'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-500">
        <span className="whitespace-nowrap">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Trash2 className="w-4 h-4 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload Modal Component
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const projectResponse = await projectService.createProject({ name, description, language });
      
      if (files && files.length > 0 && projectResponse.data) {
        const filesArray = Array.from(files);
        await projectService.uploadFiles(projectResponse.data.id, filesArray);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400"
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white placeholder-gray-400"
              placeholder="What's this project about?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Programming Language *
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              required
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="kotlin">Kotlin</option>
              <option value="swift">Swift</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Files (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {files && files.length > 0
                    ? `${files.length} file(s) selected`
                    : 'Click to upload or drag and drop'}
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
