import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, FolderGit2, Search, Plus, FileCode, Users,
  Settings, LogOut, MoreHorizontal, Clock, Star, TrendingUp
} from 'lucide-react';
import { authService, projectService } from '@/services';
import type { Project } from '@/types/api';
import { cn } from '@/lib/utils';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

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
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar - Cal.com/Notion Premium Style */}
      <aside className="w-[260px] flex flex-col bg-white border-r border-neutral-200/80">
        {/* Logo */}
        <div className="px-5 py-6 border-b border-neutral-200/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center">
              <FileCode className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">VisualDocs</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <NavItem icon={FolderGit2} label="Projects" active />
          <NavItem icon={TrendingUp} label="Analytics" />
          <NavItem icon={Users} label="Team" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-neutral-200/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-all duration-150"
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200/80">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">
                  Projects
                </h1>
                <p className="text-[13px] text-neutral-500 mt-1">
                  Manage and organize your documentation projects
                </p>
              </div>

              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-all duration-150 shadow-sm"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                New Project
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
                <p className="text-sm text-neutral-500">Loading projects...</p>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState onCreateProject={() => setShowUploadModal(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={loadDashboard}
        />
      )}
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150",
        active
          ? "bg-neutral-100 text-neutral-900"
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
      )}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

// Empty State
function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">
        <FolderGit2 className="w-7 h-7 text-neutral-400" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>
      <p className="text-[13px] text-neutral-500 mb-6 max-w-sm leading-relaxed">
        Get started by creating your first project. Upload your codebase or import from GitHub.
      </p>
      <button
        onClick={onCreateProject}
        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" strokeWidth={2.5} />
        Create Your First Project
      </button>
    </div>
  );
}

// Project Card
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative bg-white border border-neutral-200/80 rounded-xl p-5 hover:shadow-md hover:border-neutral-300 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
          <FileCode className="w-5 h-5 text-neutral-700" strokeWidth={2} />
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded-md transition-all">
          <MoreHorizontal className="w-4 h-4 text-neutral-500" strokeWidth={2} />
        </button>
      </div>

      <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 line-clamp-1">
        {project.name}
      </h3>
      <p className="text-[13px] text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
        {project.description || 'No description provided'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px] text-neutral-400">
          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
          <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded transition-all">
            <Star className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Upload Modal
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
    }