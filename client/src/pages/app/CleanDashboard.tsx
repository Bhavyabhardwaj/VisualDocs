import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';import { useNavigate } from 'react-router-dom';

import {

  Upload,import { motion, AnimatePresence } from 'framer-motion';import { useNavigate } from 'react-router-dom';

  FolderGit2,

  Search,import {

  Plus,

  FileCode,  Upload, FolderGit2, Search, Plus, FileCode, Users,import { motion, AnimatePresence } from 'framer-motion';import { useNavigate } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

  Users,

  Settings,  Settings, LogOut, MoreHorizontal, Clock, Star, TrendingUp,

  LogOut,

  MoreHorizontal,  Home, LayoutDashboard, Ximport {

  Clock,

  Star,} from 'lucide-react';

  TrendingUp,

  LayoutDashboard,import { authService, projectService } from '@/services';  Upload, FolderGit2, Search, Plus, FileCode, Users,import {import {

  X

} from 'lucide-react';import type { Project } from '@/types/api';

import { authService, projectService } from '@/services';

import type { Project } from '@/types/api';import { cn } from '@/lib/utils';  Settings, LogOut, MoreHorizontal, Clock, Star, TrendingUp, X

import { cn } from '@/lib/utils';



export default function CleanDashboard() {

  const navigate = useNavigate();export default function CleanDashboard() {} from 'lucide-react';  Upload, FolderGit2, Search, Plus, FileCode, Users,  Upload, FolderGit2, Search, Plus, FileCode, Users,

  const [projects, setProjects] = useState<Project[]>([]);

  const [loading, setLoading] = useState(true);  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);  const [projects, setProjects] = useState<Project[]>([]);import { authService, projectService } from '@/services';



  useEffect(() => {  const [loading, setLoading] = useState(true);

    loadDashboard();

  }, []);  const [searchQuery, setSearchQuery] = useState('');import type { Project } from '@/types/api';  Settings, LogOut, MoreHorizontal, Clock, Star, TrendingUp  Settings, LogOut, MoreHorizontal, Clock,



  const loadDashboard = async () => {  const [showUploadModal, setShowUploadModal] = useState(false);

    try {

      setLoading(true);import { cn } from '@/lib/utils';

      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });

        useEffect(() => {

      if (Array.isArray(projectsData.data)) {

        setProjects(projectsData.data);    loadDashboard();} from 'lucide-react';  Eye, Trash2, LayoutGrid, LayoutList

      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {

        setProjects((projectsData.data as { projects: Project[] }).projects);  }, []);

      } else {

        setProjects([]);export default function CleanDashboard() {

      }

    } catch (error) {  const loadDashboard = async () => {

      console.error('Failed to load dashboard:', error);

      setProjects([]);    try {  const navigate = useNavigate();import { authService, projectService } from '@/services';} from 'lucide-react';

    } finally {

      setLoading(false);      setLoading(true);

    }

  };      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });  const [projects, setProjects] = useState<Project[]>([]);



  const handleLogout = () => {      

    authService.logout();

    navigate('/login');      if (Array.isArray(projectsData.data)) {  const [loading, setLoading] = useState(true);import type { Project } from '@/types/api';import { authService, projectService } from '@/services';

  };

        setProjects(projectsData.data);

  const filteredProjects = projects.filter(p => 

    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {  const [searchQuery, setSearchQuery] = useState('');

    p.description?.toLowerCase().includes(searchQuery.toLowerCase())

  );        setProjects((projectsData.data as { projects: Project[] }).projects);



  return (      } else {  const [showUploadModal, setShowUploadModal] = useState(false);import { cn } from '@/lib/utils';import type { Project } from '@/types/api';

    <div className="flex h-screen bg-neutral-50">

      <aside className="w-[260px] flex flex-col bg-white border-r border-neutral-200/80 shadow-sm">        setProjects([]);

        <div className="px-6 py-5 border-b border-neutral-200/60">

          <div className="flex items-center gap-3">      }

            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">

              <FileCode className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />    } catch (error) {

            </div>

            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">VisualDocs</span>      console.error('Failed to load dashboard:', error);  useEffect(() => {import { cn } from '@/lib/utils';

          </div>

        </div>      setProjects([]);



        <nav className="flex-1 px-3 py-4 space-y-1">    } finally {    loadDashboard();

          <NavItem icon={LayoutDashboard} label="Dashboard" active />

          <NavItem icon={FolderGit2} label="Projects" />      setLoading(false);

          <NavItem icon={TrendingUp} label="Analytics" />

          <NavItem icon={Users} label="Team" />    }  }, []);export default function CleanDashboard() {

          <NavItem icon={Settings} label="Settings" />

        </nav>  };



        <div className="px-3 py-4 border-t border-neutral-200/60">

          <button

            onClick={handleLogout}  const handleLogout = () => {

            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-150"

          >    authService.logout();  const loadDashboard = async () => {  const navigate = useNavigate();export default function CleanDashboard() {

            <LogOut className="w-4 h-4" strokeWidth={2} />

            <span>Sign out</span>    navigate('/login');

          </button>

        </div>  };    try {

      </aside>



      <main className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-white border-b border-neutral-200/80">  const filteredProjects = projects.filter(p =>       setLoading(true);  const [projects, setProjects] = useState<Project[]>([]);  const navigate = useNavigate();

          <div className="px-8 py-6">

            <div className="flex items-center justify-between mb-5">    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

              <div>

                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">    p.description?.toLowerCase().includes(searchQuery.toLowerCase())      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });

                  Projects

                </h1>  );

                <p className="text-sm text-neutral-500">

                  Manage and organize your documentation projects        const [loading, setLoading] = useState(true);  const [projects, setProjects] = useState<Project[]>([]);

                </p>

              </div>  return (



              <motion.button    <div className="flex h-screen bg-neutral-50">      if (Array.isArray(projectsData.data)) {

                whileHover={{ scale: 1.02 }}

                whileTap={{ scale: 0.98 }}      {/* Sidebar - Premium Cal.com/Notion Style */}

                onClick={() => setShowUploadModal(true)}

                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"      <aside className="w-[260px] flex flex-col bg-white border-r border-neutral-200/80 shadow-sm">        setProjects(projectsData.data);  const [searchQuery, setSearchQuery] = useState('');  const [loading, setLoading] = useState(true);

              >

                <Plus className="w-4 h-4" strokeWidth={2.5} />        {/* Logo */}

                New Project

              </motion.button>        <div className="px-6 py-5 border-b border-neutral-200/60">      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {

            </div>

          <div className="flex items-center gap-3">

            <div className="relative max-w-md">

              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">        setProjects((projectsData.data as { projects: Project[] }).projects);  const [showUploadModal, setShowUploadModal] = useState(false);  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

              <input

                type="text"              <FileCode className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />

                placeholder="Search projects..."

                value={searchQuery}            </div>      } else {

                onChange={(e) => setSearchQuery(e.target.value)}

                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">VisualDocs</span>

              />

            </div>          </div>        setProjects([]);  const [showUploadModal, setShowUploadModal] = useState(false);

          </div>

        </header>        </div>



        <div className="flex-1 overflow-y-auto px-8 py-6">      }

          {loading ? (

            <LoadingState />        {/* Navigation */}

          ) : filteredProjects.length === 0 ? (

            <EmptyState onCreateProject={() => setShowUploadModal(true)} />        <nav className="flex-1 px-3 py-4 space-y-1">    } catch (error) {  useEffect(() => {  const [searchQuery, setSearchQuery] = useState('');

          ) : (

                      <NavItem icon={LayoutDashboard} label="Dashboard" active />

          <NavItem icon={FolderGit2} label="Projects" />      console.error('Failed to load dashboard:', error);

          <NavItem icon={TrendingUp} label="Analytics" />

          <NavItem icon={Users} label="Team" />      setProjects([]);    loadDashboard();

          <NavItem icon={Settings} label="Settings" />

        </nav>    } finally {



        {/* User section */}      setLoading(false);  }, []);  useEffect(() => {

        <div className="px-3 py-4 border-t border-neutral-200/60">

          <button    }

            onClick={handleLogout}

            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all duration-150"  };    loadDashboard();

          >

            <LogOut className="w-4 h-4" strokeWidth={2} />

            <span>Sign out</span>

          </button>  const handleLogout = () => {  const loadDashboard = async () => {  }, []);

        </div>

      </aside>    authService.logout();



      {/* Main Content */}    navigate('/login');    try {

      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}  };

        <header className="bg-white border-b border-neutral-200/80">

          <div className="px-8 py-6">      setLoading(true);  const loadDashboard = async () => {

            <div className="flex items-center justify-between mb-5">

              <div>  const filteredProjects = projects.filter(p => 

                <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-1">

                  Projects    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });    try {

                </h1>

                <p className="text-sm text-neutral-500">    p.description?.toLowerCase().includes(searchQuery.toLowerCase())

                  Manage and organize your documentation projects

                </p>  );            setLoading(true);

              </div>



              <motion.button

                whileHover={{ scale: 1.02 }}  return (      if (Array.isArray(projectsData.data)) {      const projectsData = await projectService.getProjects({ page: 1, limit: 20 });

                whileTap={{ scale: 0.98 }}

                onClick={() => setShowUploadModal(true)}    <div className="flex h-screen bg-neutral-50 font-['Inter',system-ui,sans-serif]">

                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"

              >      {/* Sidebar - Cal.com/Notion Premium Style */}        setProjects(projectsData.data);      

                <Plus className="w-4 h-4" strokeWidth={2.5} />

                New Project      <motion.aside 

              </motion.button>

            </div>        initial={{ x: -20, opacity: 0 }}      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {      if (Array.isArray(projectsData.data)) {



            {/* Search */}        animate={{ x: 0, opacity: 1 }}

            <div className="relative max-w-md">

              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />        className="w-[260px] flex flex-col bg-white border-r border-neutral-200/80"        setProjects((projectsData.data as { projects: Project[] }).projects);        setProjects(projectsData.data);

              <input

                type="text"      >

                placeholder="Search projects..."

                value={searchQuery}        {/* Logo */}      } else {      } else if (projectsData.data && typeof projectsData.data === 'object' && 'projects' in projectsData.data) {

                onChange={(e) => setSearchQuery(e.target.value)}

                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"        <div className="px-5 py-6 border-b border-neutral-200/60">

              />

            </div>          <div className="flex items-center gap-2.5">        setProjects([]);        setProjects((projectsData.data as { projects: Project[] }).projects);

          </div>

        </header>            <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center">



        {/* Content Area */}              <FileCode className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />      }      } else {

        <div className="flex-1 overflow-y-auto px-8 py-6">

          {loading ? (            </div>

            <LoadingState />

          ) : filteredProjects.length === 0 ? (            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">VisualDocs</span>    } catch (error) {        setProjects([]);

            <EmptyState onCreateProject={() => setShowUploadModal(true)} />

          ) : (          </div>

            <motion.div

              initial={{ opacity: 0 }}        </div>      console.error('Failed to load dashboard:', error);      }

              animate={{ opacity: 1 }}

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

            >

              {filteredProjects.map((project, index) => (        {/* Navigation */}      setProjects([]);    } catch (error) {

                <ProjectCard key={project.id} project={project} index={index} />

              ))}        <nav className="flex-1 px-3 py-4 space-y-0.5">

            </motion.div>

          )}          <NavItem icon={FolderGit2} label="Projects" active />    } finally {      console.error('Failed to load dashboard:', error);

        </div>

      </main>          <NavItem icon={TrendingUp} label="Analytics" />



      {/* Upload Modal */}          <NavItem icon={Users} label="Team" />      setLoading(false);      setProjects([]);

      <AnimatePresence>

        {showUploadModal && (          <NavItem icon={Settings} label="Settings" />

          <UploadModal

            onClose={() => setShowUploadModal(false)}        </nav>    }    } finally {

            onSuccess={loadDashboard}

          />

        )}

      </AnimatePresence>        {/* User section */}  };      setLoading(false);

    </div>

  );        <div className="px-3 py-4 border-t border-neutral-200/60">

}

          <button    }

// Navigation Item Component

function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {            onClick={handleLogout}

  return (

    <motion.button            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-all duration-150"  const handleLogout = () => {  };

      whileHover={{ x: 2 }}

      className={cn(          >

        "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150",

        active            <LogOut className="w-4 h-4" strokeWidth={2} />    authService.logout();

          ? "bg-neutral-100 text-neutral-900"

          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"            <span>Sign out</span>

      )}

    >          </button>    navigate('/login');  const handleLogout = () => {

      <Icon className="w-4 h-4" strokeWidth={2} />

      <span>{label}</span>        </div>

    </motion.button>

  );      </motion.aside>  };    authService.logout();

}



// Loading State

function LoadingState() {      {/* Main Content */}    navigate('/login');

  return (

    <div className="flex items-center justify-center h-96">      <main className="flex-1 flex flex-col overflow-hidden">

      <div className="flex flex-col items-center gap-4">

        <motion.div        {/* Header */}  const filteredProjects = projects.filter(p =>   };

          animate={{ rotate: 360 }}

          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}        <motion.header 

          className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full"

        />          initial={{ y: -20, opacity: 0 }}    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

        <p className="text-sm text-neutral-500 font-medium">Loading projects...</p>

      </div>          animate={{ y: 0, opacity: 1 }}

    </div>

  );          transition={{ delay: 0.1 }}    p.description?.toLowerCase().includes(searchQuery.toLowerCase())  const filteredProjects = projects.filter(p => 

}

          className="bg-white border-b border-neutral-200/80"

// Empty State

function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {        >  );    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

  return (

    <motion.div          <div className="px-8 py-5">

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}            <div className="flex items-center justify-between mb-4">    p.description?.toLowerCase().includes(searchQuery.toLowerCase())

      className="flex flex-col items-center justify-center py-24 text-center"

    >              <div>

      <motion.div

        initial={{ scale: 0.9 }}                <h1 className="text-[28px] font-semibold tracking-tight text-neutral-900">  return (  );

        animate={{ scale: 1 }}

        transition={{ delay: 0.1 }}                  Projects

        className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5"

      >                </h1>    <div className="flex h-screen bg-neutral-50">

        <FolderGit2 className="w-8 h-8 text-neutral-400" strokeWidth={2} />

      </motion.div>                <p className="text-[13px] text-neutral-500 mt-1">

      <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>

      <p className="text-sm text-neutral-500 mb-6 max-w-sm leading-relaxed">                  Manage and organize your documentation projects      {/* Sidebar - Cal.com/Notion Premium Style */}  return (

        Get started by creating your first project. Upload your codebase or import from GitHub.

      </p>                </p>

      <motion.button

        whileHover={{ scale: 1.02 }}              </div>      <aside className="w-[260px] flex flex-col bg-white border-r border-neutral-200/80">    <div className="flex h-screen bg-white">

        whileTap={{ scale: 0.98 }}

        onClick={onCreateProject}

        className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors shadow-sm"

      >              <button        {/* Logo */}      {/* Sidebar - Notion style */}

        <Plus className="w-4 h-4" strokeWidth={2.5} />

        Create Your First Project                onClick={() => setShowUploadModal(true)}

      </motion.button>

    </motion.div>                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-all duration-150 shadow-sm"        <div className="px-5 py-6 border-b border-neutral-200/60">      <aside className="w-60 border-r border-gray-200 flex flex-col bg-gray-50">

  );

}              >



// Project Card                <Plus className="w-4 h-4" strokeWidth={2.5} />          <div className="flex items-center gap-2.5">        {/* Logo */}

function ProjectCard({ project, index }: { project: Project; index: number }) {

  return (                New Project

    <motion.div

      initial={{ opacity: 0, y: 20 }}              </button>            <div className="w-8 h-8 rounded-md bg-neutral-900 flex items-center justify-center">        <div className="p-4 border-b border-gray-200">

      animate={{ opacity: 1, y: 0 }}

      transition={{ delay: index * 0.05 }}            </div>

      whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}

      className="group relative bg-white border border-neutral-200/80 rounded-xl p-6 hover:border-neutral-300 transition-all duration-200 cursor-pointer"              <FileCode className="w-4 h-4 text-white" strokeWidth={2.5} />          <div className="flex items-center gap-2">

    >

      <div className="flex items-start justify-between mb-4">            {/* Search */}

        <div className="w-11 h-11 rounded-lg bg-neutral-100 flex items-center justify-center">

          <FileCode className="w-5 h-5 text-neutral-700" strokeWidth={2} />            <div className="relative max-w-md">            </div>            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">

        </div>

        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-neutral-100 rounded-lg transition-all">              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={2} />

          <MoreHorizontal className="w-4 h-4 text-neutral-500" strokeWidth={2} />

        </button>              <input            <span className="font-semibold text-[15px] tracking-tight text-neutral-900">VisualDocs</span>              <FileCode className="w-5 h-5 text-white" />

      </div>

                type="text"

      <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-1">

        {project.name}                placeholder="Search projects..."          </div>            </div>

      </h3>

      <p className="text-sm text-neutral-500 mb-5 line-clamp-2 leading-relaxed">                value={searchQuery}

        {project.description || 'No description provided'}

      </p>                onChange={(e) => setSearchQuery(e.target.value)}        </div>            <span className="font-semibold text-gray-900">VisualDocs</span>



      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"

        <div className="flex items-center gap-2 text-xs text-neutral-400">

          <Clock className="w-3.5 h-3.5" strokeWidth={2} />              />          </div>

          <span className="font-medium">

            {new Date(project.createdAt).toLocaleDateString('en-US', {             </div>

              month: 'short', 

              day: 'numeric',          </div>        {/* Navigation */}        </div>

              year: 'numeric'

            })}        </motion.header>

          </span>

        </div>        <nav className="flex-1 px-3 py-4 space-y-0.5">

        <motion.button

          whileHover={{ scale: 1.1 }}        {/* Content Area */}

          whileTap={{ scale: 0.9 }}

          className="p-1.5 hover:bg-neutral-100 rounded transition-all"        <div className="flex-1 overflow-y-auto px-8 py-6">          <NavItem icon={FolderGit2} label="Projects" active />        {/* Navigation */}

        >

          <Star className="w-4 h-4 text-neutral-400" strokeWidth={2} />          {loading ? (

        </motion.button>

      </div>            <div className="flex items-center justify-center h-96">          <NavItem icon={TrendingUp} label="Analytics" />        <nav className="flex-1 p-3 space-y-1">

    </motion.div>

  );              <motion.div 

}

                initial={{ opacity: 0, scale: 0.9 }}          <NavItem icon={Users} label="Team" />          <NavItem icon={LayoutGrid} label="Projects" active />

// Upload Modal

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {                animate={{ opacity: 1, scale: 1 }}

  const [name, setName] = useState('');

  const [description, setDescription] = useState('');                className="flex flex-col items-center gap-3"          <NavItem icon={Settings} label="Settings" />          <NavItem icon={Users} label="Collaboration" />

  const [language, setLanguage] = useState('javascript');

  const [files, setFiles] = useState<FileList | null>(null);              >

  const [loading, setLoading] = useState(false);

                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>        </nav>          <NavItem icon={Clock} label="Recent" />

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();                <p className="text-sm text-neutral-500">Loading projects...</p>

    if (!name.trim()) return;

              </motion.div>          <NavItem icon={Settings} label="Settings" />

    try {

      setLoading(true);            </div>

      const projectResponse = await projectService.createProject({ name, description, language });

                ) : filteredProjects.length === 0 ? (        {/* User section */}        </nav>

      if (files && files.length > 0 && projectResponse.data) {

        const filesArray = Array.from(files);            <EmptyState onCreateProject={() => setShowUploadModal(true)} />

        await projectService.uploadFiles(projectResponse.data.id, filesArray);

      }          ) : (        <div className="px-3 py-4 border-t border-neutral-200/60">



      onSuccess();            <motion.div 

      onClose();

    } catch (error) {              initial={{ opacity: 0, y: 20 }}          <button        {/* User section */}

      console.error('Failed to create project:', error);

    } finally {              animate={{ opacity: 1, y: 0 }}

      setLoading(false);

    }              transition={{ delay: 0.2 }}            onClick={handleLogout}        <div className="p-3 border-t border-gray-200">

  };

              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

  return (

    <motion.div            >            className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-all duration-150"          <button

      initial={{ opacity: 0 }}

      animate={{ opacity: 1 }}              {filteredProjects.map((project, index) => (

      exit={{ opacity: 0 }}

      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"                <ProjectCard key={project.id} project={project} index={index} />          >            onClick={handleLogout}

      onClick={onClose}

    >              ))}

      <motion.div

        initial={{ scale: 0.95, opacity: 0 }}            </motion.div>            <LogOut className="w-4 h-4" strokeWidth={2} />            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"

        animate={{ scale: 1, opacity: 1 }}

        exit={{ scale: 0.95, opacity: 0 }}          )}

        transition={{ type: "spring", duration: 0.3 }}

        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"        </div>            <span>Sign out</span>          >

        onClick={(e) => e.stopPropagation()}

      >      </main>

        {/* Header */}

        <div className="px-6 py-5 border-b border-neutral-200/60 flex items-center justify-between">          </button>            <LogOut className="w-4 h-4" />

          <div>

            <h2 className="text-lg font-semibold text-neutral-900">Create New Project</h2>      {/* Upload Modal */}

            <p className="text-sm text-neutral-500 mt-0.5">Add a new project to your workspace</p>

          </div>      <AnimatePresence>        </div>            <span>Logout</span>

          <button

            onClick={onClose}        {showUploadModal && (

            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"

          >          <UploadModal      </aside>          </button>

            <X className="w-4 h-4 text-neutral-500" strokeWidth={2} />

          </button>            onClose={() => setShowUploadModal(false)}

        </div>

            onSuccess={loadDashboard}        </div>

        {/* Form */}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">          />

          {/* Project Name */}

          <div>        )}      {/* Main Content */}      </aside>

            <label className="block text-sm font-medium text-neutral-700 mb-2">

              Project Name *      </AnimatePresence>

            </label>

            <input    </div>      <main className

              type="text"

              value={name}  );      {/* Main content */}

              onChange={(e) => setName(e.target.value)}

              className="w-full px-4 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"}      <main className="flex-1 flex flex-col overflow-hidden">

              placeholder="My Awesome Project"

              required        {/* Header */}

            />

          </div>// Navigation Item Component        <header className="border-b border-gray-200 bg-white">



          {/* Description */}function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {          <div className="flex items-center justify-between px-8 py-4">

          <div>

            <label className="block text-sm font-medium text-neutral-700 mb-2">  return (            <div>

              Description

            </label>    <button              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>

            <textarea

              value={description}      className={cn(              <p className="text-sm text-gray-600 mt-1">

              onChange={(e) => setDescription(e.target.value)}

              rows={3}        "w-full flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150",                {projects.length} {projects.length === 1 ? 'project' : 'projects'}

              className="w-full px-4 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none transition-all"

              placeholder="What's this project about?"        active              </p>

            />

          </div>          ? "bg-neutral-100 text-neutral-900"            </div>



          {/* Programming Language */}          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"

          <div>

            <label className="block text-sm font-medium text-neutral-700 mb-2">      )}            <div className="flex items-center gap-3">

              Programming Language *

            </label>    >              {/* Search */}

            <select

              value={language}      <Icon className="w-4 h-4" strokeWidth={2} />              <div className="relative">

              onChange={(e) => setLanguage(e.target.value)}

              className="w-full px-4 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"      <span>{label}</span>                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              required

            >    </button>                <input

              <option value="javascript">JavaScript</option>

              <option value="typescript">TypeScript</option>  );                  type="text"

              <option value="python">Python</option>

              <option value="java">Java</option>}                  placeholder="Search projects..."

              <option value="csharp">C#</option>

              <option value="cpp">C++</option>                  value={searchQuery}

              <option value="go">Go</option>

              <option value="rust">Rust</option>// Empty State                  onChange={(e) => setSearchQuery(e.target.value)}

              <option value="php">PHP</option>

              <option value="ruby">Ruby</option>function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

              <option value="kotlin">Kotlin</option>

              <option value="swift">Swift</option>  return (                />

            </select>

          </div>    <motion.div               </div>



          {/* File Upload */}      initial={{ opacity: 0, y: 20 }}

          <div>

            <label className="block text-sm font-medium text-neutral-700 mb-2">      animate={{ opacity: 1, y: 0 }}              {/* View toggle */}

              Upload Files (Optional)

            </label>      className="flex flex-col items-center justify-center py-24 text-center"              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

            <div className="relative border-2 border-dashed border-neutral-200/80 rounded-lg p-8 text-center hover:border-neutral-300 transition-colors group cursor-pointer">

              <input    >                <button

                type="file"

                multiple      <div className="w-14 h-14 rounded-xl bg-neutral-100 flex items-center justify-center mb-4">                  onClick={() => setViewMode('grid')}

                onChange={(e) => setFiles(e.target.files)}

                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"        <FolderGit2 className="w-7 h-7 text-neutral-400" strokeWidth={2} />                  className={cn(

                id="file-upload"

              />      </div>                    "p-2 text-gray-600",

              <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-3 group-hover:text-neutral-600 transition-colors" strokeWidth={2} />

              <p className="text-sm text-neutral-600 font-medium mb-1">      <h3 className="text-lg font-semibold text-neutral-900 mb-2">No projects yet</h3>                    viewMode === 'grid' && "bg-gray-100 text-gray-900"

                {files && files.length > 0

                  ? `${files.length} file${files.length > 1 ? 's' : ''} selected`      <p className="text-[13px] text-neutral-500 mb-6 max-w-sm leading-relaxed">                  )}

                  : 'Click to upload or drag and drop'}

              </p>        Get started by creating your first project. Upload your codebase or import from GitHub.                >

              <p className="text-xs text-neutral-400">

                Support for all code file types      </p>                  <LayoutGrid className="w-4 h-4" />

              </p>

            </div>      <button                </button>

          </div>

        onClick={onCreateProject}                <button

          {/* Actions */}

          <div className="flex gap-3 pt-4">        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-all shadow-sm"                  onClick={() => setViewMode('list')}

            <button

              type="button"      >                  className={cn(

              onClick={onClose}

              className="flex-1 px-4 py-2.5 border border-neutral-200/80 text-neutral-700 text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"        <Plus className="w-4 h-4" strokeWidth={2.5} />                    "p-2 text-gray-600 border-l border-gray-300",

            >

              Cancel        Create Your First Project                    viewMode === 'list' && "bg-gray-100 text-gray-900"

            </button>

            <button      </button>                  )}

              type="submit"

              disabled={loading}    </motion.div>                >

              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"

            >  );                  <LayoutList className="w-4 h-4" />

              {loading ? 'Creating...' : 'Create Project'}

            </button>}                </button>

          </div>

        </form>              </div>

      </motion.div>

    </motion.div>// Project Card

  );

}function ProjectCard({ project, index }: { project: Project; index: number }) {              {/* New project button */}


  return (              <button

    <motion.div                onClick={() => setShowUploadModal(true)}

      initial={{ opacity: 0, y: 20 }}                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"

      animate={{ opacity: 1, y: 0 }}              >

      transition={{ delay: index * 0.05 }}                <Plus className="w-4 h-4" />

      whileHover={{ y: -4, transition: { duration: 0.2 } }}                return (

      className="group relative bg-white border border-neutral-200/80 rounded-xl p-5 hover:shadow-md hover:border-neutral-300 transition-all duration-200 cursor-pointer"                  <div className="flex h-screen bg-neutral-50">

    >                    {/* Sidebar - Premium Notion/Cal.com style */}

      <div className="flex items-start justify-between mb-4">                    <aside className="w-64 flex flex-col bg-white border-r border-neutral-200 shadow-sm">

        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">                      {/* Logo */}

          <FileCode className="w-5 h-5 text-neutral-700" strokeWidth={2} />                      <div className="px-6 py-5 border-b border-neutral-200">

        </div>                        <div className="flex items-center gap-3">

        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded-md transition-all">                          <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shadow-sm">

          <MoreHorizontal className="w-4 h-4 text-neutral-500" strokeWidth={2} />                            <FileCode className="w-5 h-5 text-blue-600" />

        </button>                          </div>

      </div>                          <span className="font-bold text-lg tracking-tight text-neutral-900">VisualDocs</span>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">

      <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 line-clamp-1">          {loading ? (

        {project.name}            <div className="flex items-center justify-center h-64">

      </h3>                      {/* Navigation */}

      <p className="text-[13px] text-neutral-500 mb-4 line-clamp-2 leading-relaxed">                      <nav className="flex-1 px-3 py-6 space-y-1">

        {project.description || 'No description provided'}                        <NavItem icon={LayoutGrid} label="Projects" active />

      </p>                        <NavItem icon={Users} label="Collaboration" />

                        <NavItem icon={Clock} label="Recent" />

      <div className="flex items-center justify-between">                        <NavItem icon={Settings} label="Settings" />

        <div className="flex items-center gap-1.5 text-[12px] text-neutral-400">                      </nav>

          <Clock className="w-3.5 h-3.5" strokeWidth={2} />

          <span>{new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>                      {/* User section */}

        </div>                      <div className="px-6 py-4 border-t border-neutral-200">

        <div className="flex items-center gap-1">                        <button

          <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded transition-all">                          onClick={handleLogout}

            <Star className="w-3.5 h-3.5 text-neutral-400" strokeWidth={2} />                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors font-medium"

          </button>                        >

        </div>                          <LogOut className="w-4 h-4" />

      </div>                          <span>Logout</span>

    </motion.div>                        </button>

  );                      </div>

}                    </aside>

}

// Upload Modal

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {// Navigation Item Component

  const [name, setName] = useState('');function NavItem({ icon: Icon, label, active = false }: { icon: React.ElementType; label: string; active?: boolean }) {

  const [description, setDescription] = useState('');  return (

  const [language, setLanguage] = useState('javascript');    <button

  const [files, setFiles] = useState<FileList | null>(null);      className={cn(

  const [loading, setLoading] = useState(false);        "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",

        active

  const handleSubmit = async (e: React.FormEvent) => {          ? "bg-white text-gray-900 font-medium shadow-sm"

    e.preventDefault();          : "text-gray-700 hover:bg-gray-200"

    if (!name.trim()) return;      )}

    >

    try {      <Icon className="w-4 h-4" />

      setLoading(true);      <span>{label}</span>

      const projectResponse = await projectService.createProject({ name, description, language });    </button>

        );

      if (files && files.length > 0 && projectResponse.data) {}

        const filesArray = Array.from(files);

        await projectService.uploadFiles(projectResponse.data.id, filesArray);// Empty State

      }function EmptyState({ onCreateProject }: { onCreateProject: () => void }) {

  return (

      onSuccess();    <div className="flex flex-col items-center justify-center h-64 text-center">

      onClose();      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">

    } catch (error) {        <FolderGit2 className="w-8 h-8 text-gray-400" />

      console.error('Failed to create project:', error);      </div>

    } finally {      <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>

      setLoading(false);      <p className="text-gray-600 mb-6 max-w-sm">

    }        Get started by creating your first project. Upload code or import from GitHub.

  };      </p>

      <button

  return (        onClick={onCreateProject}

    <motion.div         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"

      initial={{ opacity: 0 }}      >

      animate={{ opacity: 1 }}        <Plus className="w-4 h-4" />

      exit={{ opacity: 0 }}        Create Project

      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"       </button>

      onClick={onClose}    </div>

    >  );

      <motion.div }

        initial={{ scale: 0.95, opacity: 0 }}

        animate={{ scale: 1, opacity: 1 }}// Projects Grid

        exit={{ scale: 0.95, opacity: 0 }}function ProjectsGrid({ projects, viewMode }: { projects: Project[]; viewMode: 'grid' | 'list' }) {

        transition={{ type: "spring", duration: 0.3 }}  if (viewMode === 'grid') {

        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"     return (

        onClick={(e) => e.stopPropagation()}      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      >        {projects.map((project) => (

        <div className="px-6 py-5 border-b border-neutral-200/60 flex items-center justify-between">          <ProjectCard key={project.id} project={project} />

          <div>        ))}

            <h2 className="text-lg font-semibold text-neutral-900">Create New Project</h2>      </div>

            <p className="text-[13px] text-neutral-500 mt-0.5">Add a new documentation project to your workspace</p>    );

          </div>  }

          <button

            onClick={onClose}  return (

            className="p-1.5 hover:bg-neutral-100 rounded-md transition-colors"    <div className="space-y-2">

          >      {projects.map((project) => (

            <X className="w-4 h-4 text-neutral-500" />        <ProjectListItem key={project.id} project={project} />

          </button>      ))}

        </div>    </div>

  );

        <form onSubmit={handleSubmit} className="p-6 space-y-5">}

          <div>

            <label className="block text-[13px] font-medium text-neutral-700 mb-2">// Project Card (Grid view)

              Project Name *function ProjectCard({ project }: { project: Project }) {

            </label>  return (

            <input    <div className="group border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white">

              type="text"      <div className="flex items-start justify-between mb-3">

              value={name}        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">

              onChange={(e) => setName(e.target.value)}          <FileCode className="w-5 h-5 text-blue-600" />

              className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"        </div>

              placeholder="My Awesome Project"        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity">

              required          <MoreHorizontal className="w-4 h-4 text-gray-500" />

            />        </button>

          </div>      </div>



          <div>      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{project.name}</h3>

            <label className="block text-[13px] font-medium text-neutral-700 mb-2">      <p className="text-sm text-gray-600 mb-4 line-clamp-2">

              Description        {project.description || 'No description'}

            </label>      </p>

            <textarea

              value={description}      <div className="flex items-center justify-between text-xs text-gray-500">

              onChange={(e) => setDescription(e.target.value)}        <div className="flex items-center gap-1">

              rows={3}          <Clock className="w-3 h-3" />

              className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-[13px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none transition-all"          <span>{new Date(project.createdAt).toLocaleDateString()}</span>

              placeholder="What's this project about?"        </div>

            />        <div className="flex items-center gap-2">

          </div>          <Eye className="w-3 h-3" />

          <Trash2 className="w-3 h-3 hover:text-red-600 cursor-pointer" />

          <div>        </div>

            <label className="block text-[13px] font-medium text-neutral-700 mb-2">      </div>

              Programming Language *    </div>

            </label>  );

            <select}

              value={language}

              onChange={(e) => setLanguage(e.target.value)}// Project List Item (List view)

              className="w-full px-3.5 py-2.5 bg-white border border-neutral-200/80 rounded-lg text-[13px] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"function ProjectListItem({ project }: { project: Project }) {

              required  return (

            >    <div className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all cursor-pointer bg-white">

              <option value="javascript">JavaScript</option>      <div className="flex items-center gap-4 flex-1">

              <option value="typescript">TypeScript</option>        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">

              <option value="python">Python</option>          <FileCode className="w-5 h-5 text-blue-600" />

              <option value="java">Java</option>        </div>

              <option value="csharp">C#</option>        <div className="flex-1 min-w-0">

              <option value="cpp">C++</option>          <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>

              <option value="go">Go</option>          <p className="text-sm text-gray-600 truncate">

              <option value="rust">Rust</option>            {project.description || 'No description'}

              <option value="php">PHP</option>          </p>

              <option value="ruby">Ruby</option>        </div>

              <option value="kotlin">Kotlin</option>      </div>

              <option value="swift">Swift</option>

            </select>      <div className="flex items-center gap-6 text-sm text-gray-500">

          </div>        <span className="whitespace-nowrap">

          {new Date(project.createdAt).toLocaleDateString()}

          <div>        </span>

            <label className="block text-[13px] font-medium text-neutral-700 mb-2">        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

              Upload Files (Optional)          <button className="p-1.5 hover:bg-gray-100 rounded">

            </label>            <Eye className="w-4 h-4" />

            <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-300 transition-colors">          </button>

              <input          <button className="p-1.5 hover:bg-gray-100 rounded">

                type="file"            <Trash2 className="w-4 h-4 hover:text-red-600" />

                multiple          </button>

                onChange={(e) => setFiles(e.target.files)}        </div>

                className="hidden"      </div>

                id="file-upload"    </div>

              />  );

              <label htmlFor="file-upload" className="cursor-pointer">}

                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" strokeWidth={2} />

                <p className="text-[13px] text-neutral-600">// Upload Modal Component

                  {files && files.length > 0function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {

                    ? `${files.length} file(s) selected`  const [name, setName] = useState('');

                    : 'Click to upload or drag and drop'}  const [description, setDescription] = useState('');

                </p>  const [language, setLanguage] = useState('javascript');

                <p className="text-[12px] text-neutral-400 mt-1">  const [files, setFiles] = useState<FileList | null>(null);

                  Upload your project files  const [loading, setLoading] = useState(false);

                </p>

              </label>  const handleSubmit = async (e: React.FormEvent) => {

            </div>    e.preventDefault();

          </div>    if (!name.trim()) return;



          <div className="flex gap-3 pt-2">    try {

            <button      setLoading(true);

              type="button"      const projectResponse = await projectService.createProject({ name, description, language });

              onClick={onClose}      

              className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 text-[13px] font-medium rounded-lg hover:bg-neutral-50 transition-colors"      if (files && files.length > 0 && projectResponse.data) {

            >        const filesArray = Array.from(files);

              Cancel        await projectService.uploadFiles(projectResponse.data.id, filesArray);

            </button>      }

            <button

              type="submit"      onSuccess();

              disabled={loading}      onClose();

              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"    } catch (error) {

            >      console.error('Failed to create project:', error);

              {loading ? 'Creating...' : 'Create Project'}    } finally {

            </button>      setLoading(false);

          </div>    }

        </form>  };

      </motion.div>

    </motion.div>  return (

  );    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

}      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">

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
