import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';import { useNavigate } from 'react-router-dom';

import { import { 

  Plus,   Plus, 

  Search,   Search, 

  Grid,   Filter, 

  List,   Grid, 

  Github,   List, 

  FolderOpen,  Github, 

  Trash2,  FolderOpen,

  Eye,  Calendar,

  Star,  MoreVertical,

  GitBranch,  Trash2,

  Activity,  Eye,

  FileCode,  Star,

  X,  GitBranch,

  Upload,  Activity,

  Brain,  FileCode,

  BarChart3,  X,

  Users,  Upload,

  Settings,  Brain,

  LogOut  BarChart3,

} from 'lucide-react';  Users,

import { cn } from '@/lib/utils';  Settings

} from 'lucide-react';

// Typesimport { cn } from '@/lib/utils';

interface Project {

  id: string;// Types

  name: string;interface Project {

  description: string;  id: string;

  language: string;  name: string;

  framework?: string;  description: string;

  stars: number;  language: string;

  forks: number;  framework?: string;

  status: 'analyzing' | 'completed' | 'error' | 'pending';  stars: number;

  visibility: 'public' | 'private';  forks: number;

  lastActivity: string;  status: 'analyzing' | 'completed' | 'error' | 'pending';

  createdAt: string;  visibility: 'public' | 'private';

  updatedAt: string;  lastActivity: string;

  qualityScore?: number;  createdAt: string;

  linesOfCode?: number;  updatedAt: string;

  contributors?: number;  qualityScore?: number;

  repository?: {  linesOfCode?: number;

    url: string;  contributors?: number;

    branch: string;  repository?: {

    lastCommit: string;    url: string;

  };    branch: string;

}    lastCommit: string;

  };

// Navigation Item Component}

const NavItem: React.FC<{

  icon: React.ReactNode;// Navigation Item Component

  label: string;const NavItem: React.FC<{

  active?: boolean;  icon: React.ReactNode;

  onClick?: () => void;  label: string;

  count?: number;  active?: boolean;

}> = ({ icon, label, active, onClick, count }) => (  onClick?: () => void;

  <motion.button  count?: number;

    onClick={onClick}}> = ({ icon, label, active, onClick, count }) => (

    whileHover={{ x: 4 }}  <motion.button

    whileTap={{ scale: 0.98 }}    onClick={onClick}

    className={cn(    whileHover={{ x: 4 }}

      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all",    whileTap={{ scale: 0.98 }}

      active    className={cn(

        ? "bg-neutral-900 text-white shadow-sm"      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all",

        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"      active

    )}        ? "bg-neutral-900 text-white shadow-sm"

  >        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"

    <div className="flex items-center space-x-3">    )}

      {icon}  >

      <span>{label}</span>    <div className="flex items-center space-x-3">

    </div>      {icon}

    {count !== undefined && (      <span>{label}</span>

      <span className={cn(    </div>

        "text-xs px-2 py-0.5 rounded-full font-medium",    {count !== undefined && (

        active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"      <span className={cn(

      )}>        "text-xs px-2 py-0.5 rounded-full font-medium",

        {count}        active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"

      </span>      )}>

    )}        {count}

  </motion.button>      </span>

);    )}

  </motion.button>

// Project Card Component);

const ProjectCard: React.FC<{

  project: Project;// Project Card Component

  onView: () => void;const ProjectCard: React.FC<{

  onDelete: () => void;  project: Project;

}> = ({ project, onView, onDelete }) => (  onView: () => void;

  <motion.div  onDelete: () => void;

    initial={{ opacity: 0, scale: 0.95 }}}> = ({ project, onView, onDelete }) => (

    animate={{ opacity: 1, scale: 1 }}  <motion.div

    whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}    initial={{ opacity: 0, scale: 0.95 }}

    className="bg-white rounded-lg border border-neutral-200 p-6 transition-all group cursor-pointer"    animate={{ opacity: 1, scale: 1 }}

    onClick={onView}    whileHover={{ y: -2, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}

  >    className="bg-white rounded-lg border border-neutral-200 p-6 transition-all group cursor-pointer"

    <div className="flex items-start justify-between mb-4">    onClick={onView}

      <div className="flex items-center space-x-3">  >

        <div className={cn(    <div className="flex items-start justify-between mb-4">

          "w-10 h-10 rounded-lg flex items-center justify-center",      <div className="flex items-center space-x-3">

          project.language === 'TypeScript' ? 'bg-blue-50' :        <div className={cn(

          project.language === 'JavaScript' ? 'bg-yellow-50' :          "w-10 h-10 rounded-lg flex items-center justify-center",

          project.language === 'Python' ? 'bg-green-50' :          project.language === 'TypeScript' ? 'bg-blue-50' :

          'bg-neutral-50'          project.language === 'JavaScript' ? 'bg-yellow-50' :

        )}>          project.language === 'Python' ? 'bg-green-50' :

          <FileCode className={cn(          'bg-neutral-50'

            "w-5 h-5",        )}>

            project.language === 'TypeScript' ? 'text-blue-600' :          <FileCode className={cn(

            project.language === 'JavaScript' ? 'text-yellow-600' :            "w-5 h-5",

            project.language === 'Python' ? 'text-green-600' :            project.language === 'TypeScript' ? 'text-blue-600' :

            'text-neutral-600'            project.language === 'JavaScript' ? 'text-yellow-600' :

          )} />            project.language === 'Python' ? 'text-green-600' :

        </div>            'text-neutral-600'

        <div>          )} />

          <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">        </div>

            {project.name}        <div>

          </h3>          <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">

          <p className="text-sm text-neutral-600 line-clamp-1">{project.description}</p>            {project.name}

        </div>          </h3>

      </div>          <p className="text-sm text-neutral-600 line-clamp-1">{project.description}</p>

              </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity">      </div>

        <div className="flex items-center space-x-1">      

          <button      <div className="opacity-0 group-hover:opacity-100 transition-opacity">

            onClick={(e) => {        <div className="flex items-center space-x-1">

              e.stopPropagation();          <button

              onView();            onClick={(e) => {

            }}              e.stopPropagation();

            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"              onView();

          >            }}

            <Eye className="w-4 h-4" />            className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"

          </button>          >

          <button            <Eye className="w-4 h-4" />

            onClick={(e) => {          </button>

              e.stopPropagation();          <button

              onDelete();            onClick={(e) => {

            }}              e.stopPropagation();

            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"              onDelete();

          >            }}

            <Trash2 className="w-4 h-4" />            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"

          </button>          >

        </div>            <Trash2 className="w-4 h-4" />

      </div>          </button>

    </div>        </div>

      </div>

    <div className="space-y-3">    </div>

      <div className="flex items-center justify-between text-sm">

        <div className="flex items-center space-x-4">    <div className="space-y-3">

          <span className="text-neutral-600">{project.language}</span>      <div className="flex items-center justify-between text-sm">

          {project.framework && (        <div className="flex items-center space-x-4">

            <span className="text-neutral-500">• {project.framework}</span>          <span className="text-neutral-600">{project.language}</span>

          )}          {project.framework && (

          <div className="flex items-center space-x-1">            <span className="text-neutral-500">• {project.framework}</span>

            <Star className="w-4 h-4 text-yellow-400 fill-current" />          )}

            <span className="text-neutral-600">{project.stars}</span>          <div className="flex items-center space-x-1">

          </div>            <Star className="w-4 h-4 text-yellow-400 fill-current" />

          <div className="flex items-center space-x-1">            <span className="text-neutral-600">{project.stars}</span>

            <GitBranch className="w-4 h-4 text-neutral-400" />          </div>

            <span className="text-neutral-600">{project.forks}</span>          <div className="flex items-center space-x-1">

          </div>            <GitBranch className="w-4 h-4 text-neutral-400" />

        </div>            <span className="text-neutral-600">{project.forks}</span>

                  </div>

        <div className={cn(        </div>

          "px-2 py-1 rounded-full text-xs font-medium",        

          project.status === 'completed' ? "bg-green-100 text-green-700" :        <div className={cn(

          project.status === 'analyzing' ? "bg-blue-100 text-blue-700" :          "px-2 py-1 rounded-full text-xs font-medium",

          project.status === 'error' ? "bg-red-100 text-red-700" :          project.status === 'completed' ? "bg-green-100 text-green-700" :

          "bg-neutral-100 text-neutral-700"          project.status === 'analyzing' ? "bg-blue-100 text-blue-700" :

        )}>          project.status === 'error' ? "bg-red-100 text-red-700" :

          {project.status}          "bg-neutral-100 text-neutral-700"

        </div>        )}>

      </div>          {project.status}

        </div>

      {project.qualityScore && (      </div>

        <div className="flex items-center justify-between text-sm">

          <span className="text-neutral-600">Quality Score</span>      {project.qualityScore && (

          <div className="flex items-center space-x-2">        <div className="flex items-center justify-between text-sm">

            <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">          <span className="text-neutral-600">Quality Score</span>

              <div           <div className="flex items-center space-x-2">

                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"            <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">

                style={{ width: `${project.qualityScore}%` }}              <div 

              />                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"

            </div>                style={{ width: `${project.qualityScore}%` }}

            <span className="font-medium text-neutral-900">{project.qualityScore}/100</span>              />

          </div>            </div>

        </div>            <span className="font-medium text-neutral-900">{project.qualityScore}/100</span>

      )}          </div>

        </div>

      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">      )}

        <span>Updated {project.lastActivity}</span>

        <div className="flex items-center space-x-2">      <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">

          <div className={cn(        <span>Updated {project.lastActivity}</span>

            "w-2 h-2 rounded-full",        <div className="flex items-center space-x-2">

            project.status === 'analyzing' ? "bg-blue-400 animate-pulse" :           <div className={cn(

            project.status === 'completed' ? "bg-green-400" :             "w-2 h-2 rounded-full",

            project.status === 'error' ? "bg-red-400" : "bg-neutral-400"            project.status === 'analyzing' ? "bg-blue-400 animate-pulse" : 

          )} />            project.status === 'completed' ? "bg-green-400" : 

          <span className="capitalize">{project.visibility}</span>            project.status === 'error' ? "bg-red-400" : "bg-neutral-400"

        </div>          )} />

      </div>          <span className="capitalize">{project.visibility}</span>

    </div>        </div>

  </motion.div>      </div>

);    </div>

  </motion.div>

// Loading State Component);

const LoadingState: React.FC = () => (

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">// Loading State Component

    {[...Array(6)].map((_, i) => (const LoadingState: React.FC = () => (

      <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <div className="animate-pulse">    {[...Array(6)].map((_, i) => (

          <div className="flex items-center space-x-3 mb-4">      <div key={i} className="bg-white rounded-lg border border-neutral-200 p-6">

            <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>        <div className="animate-pulse">

            <div className="space-y-2">          <div className="flex items-center space-x-3 mb-4">

              <div className="h-4 bg-neutral-200 rounded w-32"></div>            <div className="w-10 h-10 bg-neutral-200 rounded-lg"></div>

              <div className="h-3 bg-neutral-200 rounded w-48"></div>            <div className="space-y-2">

            </div>              <div className="h-4 bg-neutral-200 rounded w-32"></div>

          </div>              <div className="h-3 bg-neutral-200 rounded w-48"></div>

          <div className="space-y-3">            </div>

            <div className="flex justify-between">          </div>

              <div className="h-3 bg-neutral-200 rounded w-24"></div>          <div className="space-y-3">

              <div className="h-3 bg-neutral-200 rounded w-16"></div>            <div className="flex justify-between">

            </div>              <div className="h-3 bg-neutral-200 rounded w-24"></div>

            <div className="h-2 bg-neutral-200 rounded w-full"></div>              <div className="h-3 bg-neutral-200 rounded w-16"></div>

          </div>            </div>

        </div>            <div className="h-2 bg-neutral-200 rounded w-full"></div>

      </div>          </div>

    ))}        </div>

  </div>      </div>

);    ))}

  </div>

// Empty State Component);

const EmptyState: React.FC<{ onUpload: () => void; onGitHub: () => void }> = ({ onUpload, onGitHub }) => (

  <motion.div// Empty State Component

    initial={{ opacity: 0, y: 20 }}const EmptyState: React.FC<{ onUpload: () => void; onGitHub: () => void }> = ({ onUpload, onGitHub }) => (

    animate={{ opacity: 1, y: 0 }}  <motion.div

    className="text-center py-16"    initial={{ opacity: 0, y: 20 }}

  >    animate={{ opacity: 1, y: 0 }}

    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">    className="text-center py-16"

      <FolderOpen className="w-8 h-8 text-neutral-400" />  >

    </div>    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">

    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No projects yet</h3>      <FolderOpen className="w-8 h-8 text-neutral-400" />

    <p className="text-neutral-600 mb-8 max-w-md mx-auto">    </div>

      Start building something amazing! Upload your code or import from GitHub to get started with intelligent code analysis.    <h3 className="text-xl font-semibold text-neutral-900 mb-2">No projects yet</h3>

    </p>    <p className="text-neutral-600 mb-8 max-w-md mx-auto">

    <div className="flex items-center justify-center space-x-4">      Start building something amazing! Upload your code or import from GitHub to get started with intelligent code analysis.

      <button    </p>

        onClick={onUpload}    <div className="flex items-center justify-center space-x-4">

        className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-2 font-medium"      <button

      >        onClick={onUpload}

        <Upload className="w-4 h-4" />        className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-2 font-medium"

        <span>Upload Code</span>      >

      </button>        <Upload className="w-4 h-4" />

      <button        <span>Upload Code</span>

        onClick={onGitHub}      </button>

        className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2 font-medium"      <button

      >        onClick={onGitHub}

        <Github className="w-4 h-4" />        className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2 font-medium"

        <span>Import from GitHub</span>      >

      </button>        <Github className="w-4 h-4" />

    </div>        <span>Import from GitHub</span>

  </motion.div>      </button>

);    </div>

  </motion.div>

// Upload Modal Component);

const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

  const [dragActive, setDragActive] = useState(false);// Upload Modal Component

  const [uploading, setUploading] = useState(false);const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {  const [uploading, setUploading] = useState(false);

    e.preventDefault();

    e.stopPropagation();  const handleDrag = (e: React.DragEvent) => {

    if (e.type === "dragenter" || e.type === "dragover") {    e.preventDefault();

      setDragActive(true);    e.stopPropagation();

    } else if (e.type === "dragleave") {    if (e.type === "dragenter" || e.type === "dragover") {

      setDragActive(false);      setDragActive(true);

    }    } else if (e.type === "dragleave") {

  };      setDragActive(false);

    }

  const handleDrop = async (e: React.DragEvent) => {  };

    e.preventDefault();

    e.stopPropagation();  const handleDrop = async (e: React.DragEvent) => {

    setDragActive(false);    e.preventDefault();

    setUploading(true);    e.stopPropagation();

        setDragActive(false);

    setTimeout(() => {    setUploading(true);

      setUploading(false);    

      onClose();    setTimeout(() => {

    }, 2000);      setUploading(false);

  };      onClose();

    }, 2000);

  return (  };

    <AnimatePresence>

      {isOpen && (  return (

        <motion.div    <AnimatePresence>

          initial={{ opacity: 0 }}      {isOpen && (

          animate={{ opacity: 1 }}        <motion.div

          exit={{ opacity: 0 }}          initial={{ opacity: 0 }}

          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"          animate={{ opacity: 1 }}

          onClick={onClose}          exit={{ opacity: 0 }}

        >          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"

          <motion.div          onClick={onClose}

            initial={{ opacity: 0, scale: 0.95 }}        >

            animate={{ opacity: 1, scale: 1 }}          <motion.div

            exit={{ opacity: 0, scale: 0.95 }}            initial={{ opacity: 0, scale: 0.95 }}

            className="bg-white rounded-xl p-6 w-full max-w-md"            animate={{ opacity: 1, scale: 1 }}

            onClick={(e) => e.stopPropagation()}            exit={{ opacity: 0, scale: 0.95 }}

          >            className="bg-white rounded-xl p-6 w-full max-w-md"

            <div className="flex items-center justify-between mb-6">            onClick={(e) => e.stopPropagation()}

              <h3 className="text-lg font-semibold text-neutral-900">Upload Project</h3>          >

              <button            <div className="flex items-center justify-between mb-6">

                onClick={onClose}              <h3 className="text-lg font-semibold text-neutral-900">Upload Project</h3>

                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"              <button

              >                onClick={onClose}

                <X className="w-5 h-5" />                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"

              </button>              >

            </div>                <X className="w-5 h-5" />

              </button>

            <div            </div>

              onDragEnter={handleDrag}

              onDragLeave={handleDrag}            <div

              onDragOver={handleDrag}              onDragEnter={handleDrag}

              onDrop={handleDrop}              onDragLeave={handleDrag}

              className={cn(              onDragOver={handleDrag}

                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",              onDrop={handleDrop}

                dragActive              className={cn(

                  ? "border-blue-400 bg-blue-50"                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",

                  : "border-neutral-300 hover:border-neutral-400"                dragActive

              )}                  ? "border-blue-400 bg-blue-50"

            >                  : "border-neutral-300 hover:border-neutral-400"

              {uploading ? (              )}

                <div className="space-y-4">            >

                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />              {uploading ? (

                  <p className="text-sm text-neutral-600">Uploading and analyzing...</p>                <div className="space-y-4">

                </div>                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

              ) : (                  <p className="text-sm text-neutral-600">Uploading and analyzing...</p>

                <div className="space-y-4">                </div>

                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />              ) : (

                  <div>                <div className="space-y-4">

                    <p className="text-sm font-medium text-neutral-900">                  <Upload className="w-8 h-8 text-neutral-400 mx-auto" />

                      Drop your project files here                  <div>

                    </p>                    <p className="text-sm font-medium text-neutral-900">

                    <p className="text-sm text-neutral-600">                      Drop your project files here

                      or click to browse                    </p>

                    </p>                    <p className="text-sm text-neutral-600">

                  </div>                      or click to browse

                </div>                    </p>

              )}                  </div>

            </div>                </div>

          </motion.div>              )}

        </motion.div>            </div>

      )}          </motion.div>

    </AnimatePresence>        </motion.div>

  );      )}

};    </AnimatePresence>

  );

// GitHub Modal Component};

const GitHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

  const [url, setUrl] = useState('');// GitHub Modal Component

  const [importing, setImporting] = useState(false);const GitHubModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {

  const [url, setUrl] = useState('');

  const handleImport = async () => {  const [importing, setImporting] = useState(false);

    if (!url.trim()) return;

      const handleImport = async () => {

    setImporting(true);    if (!url.trim()) return;

    setTimeout(() => {    

      setImporting(false);    setImporting(true);

      onClose();    setTimeout(() => {

      setUrl('');      setImporting(false);

    }, 2000);      onClose();

  };      setUrl('');

    }, 2000);

  return (  };

    <AnimatePresence>

      {isOpen && (  return (

        <motion.div    <AnimatePresence>

          initial={{ opacity: 0 }}      {isOpen && (

          animate={{ opacity: 1 }}        <motion.div

          exit={{ opacity: 0 }}          initial={{ opacity: 0 }}

          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"          animate={{ opacity: 1 }}

          onClick={onClose}          exit={{ opacity: 0 }}

        >          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"

          <motion.div          onClick={onClose}

            initial={{ opacity: 0, scale: 0.95 }}        >

            animate={{ opacity: 1, scale: 1 }}          <motion.div

            exit={{ opacity: 0, scale: 0.95 }}            initial={{ opacity: 0, scale: 0.95 }}

            className="bg-white rounded-xl p-6 w-full max-w-md"            animate={{ opacity: 1, scale: 1 }}

            onClick={(e) => e.stopPropagation()}            exit={{ opacity: 0, scale: 0.95 }}

          >            className="bg-white rounded-xl p-6 w-full max-w-md"

            <div className="flex items-center justify-between mb-6">            onClick={(e) => e.stopPropagation()}

              <h3 className="text-lg font-semibold text-neutral-900">Import from GitHub</h3>          >

              <button            <div className="flex items-center justify-between mb-6">

                onClick={onClose}              <h3 className="text-lg font-semibold text-neutral-900">Import from GitHub</h3>

                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"              <button

              >                onClick={onClose}

                <X className="w-5 h-5" />                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"

              </button>              >

            </div>                <X className="w-5 h-5" />

              </button>

            <div className="space-y-4">            </div>

              <div>

                <label className="block text-sm font-medium text-neutral-700 mb-2">            <div className="space-y-4">

                  Repository URL              <div>

                </label>                <label className="block text-sm font-medium text-neutral-700 mb-2">

                <input                  Repository URL

                  type="url"                </label>

                  value={url}                <input

                  onChange={(e) => setUrl(e.target.value)}                  type="url"

                  placeholder="https://github.com/username/repository"                  value={url}

                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"                  onChange={(e) => setUrl(e.target.value)}

                />                  placeholder="https://github.com/username/repository"

              </div>                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"

                />

              <div className="flex items-center justify-end space-x-3">              </div>

                <button

                  onClick={onClose}              <div className="flex items-center justify-end space-x-3">

                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"                <button

                >                  onClick={onClose}

                  Cancel                  className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"

                </button>                >

                <button                  Cancel

                  onClick={handleImport}                </button>

                  disabled={!url.trim() || importing}                <button

                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"                  onClick={handleImport}

                >                  disabled={!url.trim() || importing}

                  {importing ? (                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"

                    <>                >

                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />                  {importing ? (

                      <span>Importing...</span>                    <>

                    </>                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                  ) : (                      <span>Importing...</span>

                    <>                    </>

                      <Github className="w-4 h-4" />                  ) : (

                      <span>Import</span>                    <>

                    </>                      <Github className="w-4 h-4" />

                  )}                      <span>Import</span>

                </button>                    </>

              </div>                  )}

            </div>                </button>

          </motion.div>              </div>

        </motion.div>            </div>

      )}          </motion.div>

    </AnimatePresence>        </motion.div>

  );      )}

};    </AnimatePresence>

  );

export default function ProjectsNew() {};

  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);export default function ProjectsNew() {

  const [loading, setLoading] = useState(true);  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');  const [projects, setProjects] = useState<Project[]>([]);

  const [showUploadModal, setShowUploadModal] = useState(false);  const [loading, setLoading] = useState(true);

  const [showGitHubModal, setShowGitHubModal] = useState(false);  const [searchQuery, setSearchQuery] = useState('');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');  const [showUploadModal, setShowUploadModal] = useState(false);

  const [showGitHubModal, setShowGitHubModal] = useState(false);

  // Load projects with mock data  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {

    const loadProjects = async () => {  // Load projects with mock data

      try {  useEffect(() => {

        setLoading(true);    const loadProjects = async () => {

              try {

        // Mock projects data        setLoading(true);

        const mockProjects: Project[] = [        

          {        // Mock projects data

            id: '1',        const mockProjects: Project[] = [

            name: 'VisualDocs Frontend',          {

            description: 'React TypeScript frontend application with premium UI components and design system',            id: '1',

            language: 'TypeScript',            name: 'VisualDocs Frontend',

            framework: 'React',            description: 'React TypeScript frontend application with premium UI components and design system',

            stars: 42,            language: 'TypeScript',

            forks: 8,            framework: 'React',

            status: 'completed',            stars: 42,

            visibility: 'private',            forks: 8,

            lastActivity: '2 hours ago',            status: 'completed',

            createdAt: '2024-01-15',            visibility: 'private',

            updatedAt: '2024-01-20',            lastActivity: '2 hours ago',

            qualityScore: 94,            createdAt: '2024-01-15',

            linesOfCode: 12450,            updatedAt: '2024-01-20',

            contributors: 3,            qualityScore: 94,

            repository: {            linesOfCode: 12450,

              url: 'https://github.com/user/visualdocs-frontend',            contributors: 3,

              branch: 'main',            repository: {

              lastCommit: '2 hours ago'              url: 'https://github.com/user/visualdocs-frontend',

            }              branch: 'main',

          },              lastCommit: '2 hours ago'

          {            }

            id: '2',          },

            name: 'API Gateway Service',          {

            description: 'Node.js REST API with Express, authentication, and microservices architecture',            id: '2',

            language: 'JavaScript',            name: 'API Gateway Service',

            framework: 'Express.js',            description: 'Node.js REST API with Express, authentication, and microservices architecture',

            stars: 28,            language: 'JavaScript',

            forks: 5,            framework: 'Express.js',

            status: 'analyzing',            stars: 28,

            visibility: 'private',            forks: 5,

            lastActivity: '1 day ago',            status: 'analyzing',

            createdAt: '2024-01-10',            visibility: 'private',

            updatedAt: '2024-01-19',            lastActivity: '1 day ago',

            qualityScore: 89,            createdAt: '2024-01-10',

            linesOfCode: 8920,            updatedAt: '2024-01-19',

            contributors: 2,            qualityScore: 89,

            repository: {            linesOfCode: 8920,

              url: 'https://github.com/user/api-gateway',            contributors: 2,

              branch: 'develop',            repository: {

              lastCommit: '1 day ago'              url: 'https://github.com/user/api-gateway',

            }              branch: 'develop',

          },              lastCommit: '1 day ago'

          {            }

            id: '3',          },

            name: 'Mobile App',          {

            description: 'React Native mobile application with cross-platform compatibility',            id: '3',

            language: 'TypeScript',            name: 'Mobile App',

            framework: 'React Native',            description: 'React Native mobile application with cross-platform compatibility',

            stars: 15,            language: 'TypeScript',

            forks: 3,            framework: 'React Native',

            status: 'completed',            stars: 15,

            visibility: 'public',            forks: 3,

            lastActivity: '3 days ago',            status: 'completed',

            createdAt: '2024-01-05',            visibility: 'public',

            updatedAt: '2024-01-17',            lastActivity: '3 days ago',

            qualityScore: 91,            createdAt: '2024-01-05',

            linesOfCode: 6780,            updatedAt: '2024-01-17',

            contributors: 2            qualityScore: 91,

          },            linesOfCode: 6780,

          {            contributors: 2

            id: '4',          },

            name: 'Data Analytics Dashboard',          {

            description: 'Python-based analytics dashboard with machine learning insights',            id: '4',

            language: 'Python',            name: 'Data Analytics Dashboard',

            framework: 'Django',            description: 'Python-based analytics dashboard with machine learning insights',

            stars: 67,            language: 'Python',

            forks: 12,            framework: 'Django',

            status: 'completed',            stars: 67,

            visibility: 'public',            forks: 12,

            lastActivity: '1 week ago',            status: 'completed',

            createdAt: '2023-12-20',            visibility: 'public',

            updatedAt: '2024-01-13',            lastActivity: '1 week ago',

            qualityScore: 96,            createdAt: '2023-12-20',

            linesOfCode: 15230,            updatedAt: '2024-01-13',

            contributors: 4            qualityScore: 96,

          },            linesOfCode: 15230,

          {            contributors: 4

            id: '5',          },

            name: 'E-commerce Platform',          {

            description: 'Full-stack e-commerce solution with payment integration',            id: '5',

            language: 'JavaScript',            name: 'E-commerce Platform',

            framework: 'Next.js',            description: 'Full-stack e-commerce solution with payment integration',

            stars: 89,            language: 'JavaScript',

            forks: 23,            framework: 'Next.js',

            status: 'error',            stars: 89,

            visibility: 'private',            forks: 23,

            lastActivity: '2 weeks ago',            status: 'error',

            createdAt: '2023-11-15',            visibility: 'private',

            updatedAt: '2024-01-06',            lastActivity: '2 weeks ago',

            qualityScore: 78,            createdAt: '2023-11-15',

            linesOfCode: 22100,            updatedAt: '2024-01-06',

            contributors: 6            qualityScore: 78,

          },            linesOfCode: 22100,

          {            contributors: 6

            id: '6',          },

            name: 'DevOps Automation',          {

            description: 'Infrastructure as code with Docker, Kubernetes, and CI/CD pipelines',            id: '6',

            language: 'Python',            name: 'DevOps Automation',

            framework: 'FastAPI',            description: 'Infrastructure as code with Docker, Kubernetes, and CI/CD pipelines',

            stars: 34,            language: 'Python',

            forks: 7,            framework: 'FastAPI',

            status: 'pending',            stars: 34,

            visibility: 'public',            forks: 7,

            lastActivity: '3 weeks ago',            status: 'pending',

            createdAt: '2023-10-10',            visibility: 'public',

            updatedAt: '2023-12-28',            lastActivity: '3 weeks ago',

            qualityScore: 85,            createdAt: '2023-10-10',

            linesOfCode: 4560,            updatedAt: '2023-12-28',

            contributors: 2            qualityScore: 85,

          }            linesOfCode: 4560,

        ];            contributors: 2

          }

        // Simulate API delay        ];

        await new Promise(resolve => setTimeout(resolve, 800));

                // Simulate API delay

        setProjects(mockProjects);        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {        

        console.error('Failed to load projects:', error);        setProjects(mockProjects);

      } finally {      } catch (error) {

        setLoading(false);        console.error('Failed to load projects:', error);

      }      } finally {

    };        setLoading(false);

      }

    loadProjects();    };

  }, []);

    loadProjects();

  const handleDeleteProject = async (projectId: string) => {        setPagination(response.pagination);

    try {      } catch (error) {

      // await projectService.deleteProject(projectId); // Uncomment when service is available        console.error('Failed to fetch projects:', error);

      setProjects(prev => prev.filter(p => p.id !== projectId));      } finally {

    } catch (error) {        setLoading(false);

      console.error('Delete project failed:', error);      }

    }    };

  };    loadProjects();

  }, [filters, searchQuery]);

  const handleViewProject = (projectId: string) => {

    navigate(`/app/projects/${projectId}`);  const fetchProjects = async () => {

  };    try {

      setLoading(true);

  const handleLogout = async () => {      const response = await projectService.getProjects({ ...filters, search: searchQuery });

    try {      setProjects(response.data);

      // await authService.logout(); // Uncomment when auth service is available      setPagination(response.pagination);

      navigate('/login');    } catch (error) {

    } catch (error) {      console.error('Failed to fetch projects:', error);

      console.error('Logout failed:', error);    } finally {

    }      setLoading(false);

  };    }

  };

  const filteredProjects = projects.filter(project =>

    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||  const handleSearch = () => {

    project.description?.toLowerCase().includes(searchQuery.toLowerCase())    setFilters({ ...filters, page: 1 });

  );    fetchProjects();

  };

  if (loading) {

    return (  const handleDeleteProject = async (id: string) => {

      <div className="min-h-screen bg-neutral-50 font-['Inter']">    if (!confirm('Are you sure you want to delete this project?')) return;

        <div className="flex">    

          <div className="w-64 bg-white border-r border-neutral-200 p-6">    try {

            <div className="animate-pulse space-y-4">      await projectService.deleteProject(id);

              <div className="h-8 bg-neutral-200 rounded"></div>      fetchProjects();

              <div className="space-y-2">    } catch (error) {

                {[...Array(6)].map((_, i) => (      console.error('Failed to delete project:', error);

                  <div key={i} className="h-10 bg-neutral-200 rounded"></div>    }

                ))}  };

              </div>

            </div>  const handleArchiveProject = async (id: string) => {

          </div>    try {

          <div className="flex-1 p-8">      await projectService.toggleArchive(id);

            <LoadingState />      fetchProjects();

          </div>    } catch (error) {

        </div>      console.error('Failed to archive project:', error);

      </div>    }

    );  };

  }

  return (

  return (    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

    <div className="min-h-screen bg-neutral-50 font-['Inter']">      {/* Header */}

      <div className="flex">      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">

        {/* Sidebar */}        <div className="max-w-7xl mx-auto px-6 py-8">

        <motion.div          <div className="flex items-center justify-between mb-6">

          initial={{ x: -250 }}            <div>

          animate={{ x: 0 }}              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>

          className="w-64 bg-white border-r border-neutral-200 flex flex-col"              <p className="text-gray-600 dark:text-gray-400 mt-1">

        >                Manage and analyze your documentation projects

          <div className="p-6">              </p>

            <div className="flex items-center space-x-3 mb-8">            </div>

              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">            <div className="flex items-center gap-3">

                <Brain className="w-5 h-5 text-white" />              <motion.button

              </div>                whileHover={{ scale: 1.02 }}

              <span className="font-semibold text-neutral-900">VisualDocs</span>                whileTap={{ scale: 0.98 }}

            </div>                onClick={() => setShowGitHubModal(true)}

                className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"

            <nav className="space-y-1">              >

              <NavItem                <Github className="w-4 h-4" />

                icon={<BarChart3 className="w-5 h-5" />}                Import from GitHub

                label="Dashboard"              </motion.button>

                onClick={() => navigate('/app/dashboard')}              <motion.button

              />                whileHover={{ scale: 1.02 }}

              <NavItem                whileTap={{ scale: 0.98 }}

                icon={<FileCode className="w-5 h-5" />}                onClick={() => setShowNewProjectModal(true)}

                label="Projects"                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-violet-600 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-all"

                active              >

                count={projects.length}                <Plus className="w-5 h-5" />

              />                New Project

              <NavItem              </motion.button>

                icon={<Activity className="w-5 h-5" />}            </div>

                label="Analytics"          </div>

                onClick={() => navigate('/app/analytics')}

              />          {/* Search and Filters */}

              <NavItem          <div className="flex items-center gap-4">

                icon={<Users className="w-5 h-5" />}            <div className="flex-1 relative">

                label="Team"              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                count={3}              <input

              />                type="text"

              <NavItem                placeholder="Search projects..."

                icon={<Settings className="w-5 h-5" />}                value={searchQuery}

                label="Settings"                onChange={(e) => setSearchQuery(e.target.value)}

                onClick={() => navigate('/app/settings')}                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}

              />                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"

            </nav>              />

          </div>            </div>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">

          {/* User Profile */}              <button

          <div className="mt-auto p-6 border-t border-neutral-200">                onClick={() => setViewMode('grid')}

            <div className="flex items-center justify-between">                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}

              <div className="flex items-center space-x-3">              >

                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">                <Grid className="w-4 h-4 text-gray-600 dark:text-gray-400" />

                  <span className="text-xs font-semibold text-white">JD</span>              </button>

                </div>              <button

                <div>                onClick={() => setViewMode('list')}

                  <p className="text-sm font-medium text-neutral-900">John Doe</p>                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}

                  <p className="text-xs text-neutral-600">john@example.com</p>              >

                </div>                <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />

              </div>              </button>

              <button            </div>

                onClick={handleLogout}            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">

                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"              <Filter className="w-4 h-4" />

              >              <span className="text-sm font-medium">Filter</span>

                <LogOut className="w-4 h-4" />            </button>

              </button>          </div>

            </div>        </div>

          </div>      </div>

        </motion.div>

      {/* Projects Grid/List */}

        {/* Main Content */}      <div className="max-w-7xl mx-auto px-6 py-8">

        <div className="flex-1 flex flex-col">        {loading ? (

          {/* Header */}          <div className="flex items-center justify-center py-20">

          <motion.header            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />

            initial={{ y: -50, opacity: 0 }}          </div>

            animate={{ y: 0, opacity: 1 }}        ) : projects.length === 0 ? (

            className="bg-white border-b border-neutral-200 px-8 py-6"          <div className="text-center py-20">

          >            <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <div className="flex items-center justify-between">            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>

              <div>            <p className="text-gray-600 dark:text-gray-400 mb-6">

                <h1 className="text-2xl font-semibold text-neutral-900">Projects</h1>              Create your first project or import from GitHub to get started

                <p className="text-neutral-600 mt-1">            </p>

                  Manage and analyze your code repositories with intelligent insights.            <button

                </p>              onClick={() => setShowNewProjectModal(true)}

              </div>              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all"

            >

              <div className="flex items-center space-x-4">              <Plus className="w-5 h-5" />

                <div className="relative">              Create Project

                  <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />            </button>

                  <input          </div>

                    type="text"        ) : (

                    placeholder="Search projects..."          <>

                    value={searchQuery}            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>

                    onChange={(e) => setSearchQuery(e.target.value)}              {projects.map((project, idx) => (

                    className="pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"                <motion.div

                  />                  key={project.id}

                </div>                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                <div className="flex items-center space-x-2">                  transition={{ delay: idx * 0.05 }}

                  <button                >

                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}                  <ProjectCard

                    className="p-2 border border-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"                    project={project}

                  >                    viewMode={viewMode}

                    {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}                    onDelete={handleDeleteProject}

                  </button>                    onArchive={handleArchiveProject}

                  />

                  <motion.button                </motion.div>

                    whileHover={{ scale: 1.05 }}              ))}

                    whileTap={{ scale: 0.95 }}            </div>

                    onClick={() => setShowGitHubModal(true)}

                    className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2"            {/* Pagination */}

                  >            {pagination.pages > 1 && (

                    <Github className="w-4 h-4" />              <div className="flex items-center justify-center gap-2 mt-8">

                    <span>Import</span>                <button

                  </motion.button>                  disabled={pagination.page === 1}

                  onClick={() => setFilters({ ...filters, page: pagination.page - 1 })}

                  <motion.button                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"

                    whileHover={{ scale: 1.05 }}                >

                    whileTap={{ scale: 0.95 }}                  Previous

                    onClick={() => setShowUploadModal(true)}                </button>

                    className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center space-x-2"                <span className="text-sm text-gray-600 dark:text-gray-400">

                  >                  Page {pagination.page} of {pagination.pages}

                    <Plus className="w-4 h-4" />                </span>

                    <span>New Project</span>                <button

                  </motion.button>                  disabled={pagination.page === pagination.pages}

                </div>                  onClick={() => setFilters({ ...filters, page: pagination.page + 1 })}

              </div>                  className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"

            </div>                >

          </motion.header>                  Next

                </button>

          {/* Content */}              </div>

          <main className="flex-1 p-8">            )}

            <div className="max-w-7xl mx-auto">          </>

              {/* Stats */}        )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">      </div>

                <motion.div

                  initial={{ opacity: 0, y: 20 }}      {/* New Project Modal */}

                  animate={{ opacity: 1, y: 0 }}      <AnimatePresence>

                  className="bg-white rounded-lg border border-neutral-200 p-6"        {showNewProjectModal && (

                >          <NewProjectModal onClose={() => setShowNewProjectModal(false)} onSuccess={fetchProjects} />

                  <div className="flex items-center justify-between">        )}

                    <div>      </AnimatePresence>

                      <p className="text-sm font-medium text-neutral-600">Total Projects</p>

                      <p className="text-2xl font-semibold text-neutral-900">{projects.length}</p>      {/* GitHub Import Modal */}

                    </div>      <AnimatePresence>

                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">        {showGitHubModal && (

                      <FolderOpen className="w-6 h-6 text-blue-600" />          <GitHubImportModal onClose={() => setShowGitHubModal(false)} onSuccess={fetchProjects} />

                    </div>        )}

                  </div>      </AnimatePresence>

                </motion.div>    </div>

  );

                <motion.div}

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}// Project Card Component

                  transition={{ delay: 0.1 }}function ProjectCard({ 

                  className="bg-white rounded-lg border border-neutral-200 p-6"  project, 

                >  viewMode, 

                  <div className="flex items-center justify-between">  onDelete, 

                    <div>  onArchive 

                      <p className="text-sm font-medium text-neutral-600">Active</p>}: { 

                      <p className="text-2xl font-semibold text-neutral-900">  project: Project; 

                        {projects.filter(p => p.status === 'analyzing' || p.status === 'completed').length}  viewMode: 'grid' | 'list';

                      </p>  onDelete: (id: string) => void;

                    </div>  onArchive: (id: string) => void;

                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">}) {

                      <Activity className="w-6 h-6 text-green-600" />  const [showMenu, setShowMenu] = useState(false);

                    </div>

                  </div>  if (viewMode === 'list') {

                </motion.div>    return (

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all">

                <motion.div        <div className="flex items-center gap-4">

                  initial={{ opacity: 0, y: 20 }}          <div className="flex-1">

                  animate={{ opacity: 1, y: 0 }}            <Link to={`/app/projects/${project.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400">

                  transition={{ delay: 0.2 }}              {project.name}

                  className="bg-white rounded-lg border border-neutral-200 p-6"            </Link>

                >            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description || 'No description'}</p>

                  <div className="flex items-center justify-between">          </div>

                    <div>          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">

                      <p className="text-sm font-medium text-neutral-600">Languages</p>            <div className="flex items-center gap-1.5">

                      <p className="text-2xl font-semibold text-neutral-900">              <Calendar className="w-4 h-4" />

                        {new Set(projects.map(p => p.language)).size}              {new Date(project.updatedAt).toLocaleDateString()}

                      </p>            </div>

                    </div>            {project.githubUrl && (

                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">              <div className="flex items-center gap-1.5">

                      <FileCode className="w-6 h-6 text-purple-600" />                <Github className="w-4 h-4" />

                    </div>                GitHub

                  </div>              </div>

                </motion.div>            )}

          </div>

                <motion.div          <div className="relative">

                  initial={{ opacity: 0, y: 20 }}            <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">

                  animate={{ opacity: 1, y: 0 }}              <MoreVertical className="w-5 h-5" />

                  transition={{ delay: 0.3 }}            </button>

                  className="bg-white rounded-lg border border-neutral-200 p-6"            {showMenu && (

                >              <ProjectMenu project={project} onDelete={onDelete} onArchive={onArchive} onClose={() => setShowMenu(false)} />

                  <div className="flex items-center justify-between">            )}

                    <div>          </div>

                      <p className="text-sm font-medium text-neutral-600">Avg Quality</p>        </div>

                      <p className="text-2xl font-semibold text-neutral-900">      </div>

                        {Math.round(projects.reduce((acc, p) => acc + (p.qualityScore || 0), 0) / projects.length) || 0}%    );

                      </p>  }

                    </div>

                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">  return (

                      <BarChart3 className="w-6 h-6 text-yellow-600" />    <div className="relative group">

                    </div>      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-violet-600/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />

                  </div>      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all">

                </motion.div>        <div className="flex items-start justify-between mb-4">

              </div>          <div className="flex-1">

            <Link to={`/app/projects/${project.id}`} className="text-lg font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1">

              {/* Projects Grid */}              {project.name}

              {filteredProjects.length === 0 ? (            </Link>

                <EmptyState            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">

                  onUpload={() => setShowUploadModal(true)}              {project.description || 'No description provided'}

                  onGitHub={() => setShowGitHubModal(true)}            </p>

                />          </div>

              ) : (          <div className="relative">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">            <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">

                  {filteredProjects.map((project) => (              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />

                    <ProjectCard            </button>

                      key={project.id}            {showMenu && (

                      project={project}              <ProjectMenu project={project} onDelete={onDelete} onArchive={onArchive} onClose={() => setShowMenu(false)} />

                      onView={() => handleViewProject(project.id)}            )}

                      onDelete={() => handleDeleteProject(project.id)}          </div>

                    />        </div>

                  ))}

                </div>        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">

              )}          <div className="flex items-center gap-1.5">

            </div>            <Calendar className="w-4 h-4" />

          </main>            {new Date(project.updatedAt).toLocaleDateString()}

        </div>          </div>

      </div>          {project.githubUrl && (

            <div className="flex items-center gap-1.5">

      {/* Modals */}              <Github className="w-4 h-4" />

      <UploadModal              GitHub

        isOpen={showUploadModal}            </div>

        onClose={() => setShowUploadModal(false)}          )}

      />        </div>

      <GitHubModal

        isOpen={showGitHubModal}        {project.status && (

        onClose={() => setShowGitHubModal(false)}          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">

      />            <div className="flex items-center gap-2">

    </div>              {project.status === 'analyzing' ? (

  );                <>

}                  <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span className="text-sm text-emerald-600">Analyzing...</span>
                </>
              ) : project.status === 'active' ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Project Menu Component
function ProjectMenu({ 
  project, 
  onDelete, 
  onArchive, 
  onClose 
}: { 
  project: Project; 
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 top-10 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10"
    >
      <div className="py-1">
        <Link
          to={`/app/projects/${project.id}`}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        <button
          onClick={() => {
            onArchive(project.id);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <Archive className="w-4 h-4" />
          {project.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button
          onClick={() => {
            onDelete(project.id);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </motion.div>
  );
}

// New Project Modal Component
function NewProjectModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.createProject({ name, description });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Project</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Brief description of your project..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-violet-600 text-white rounded-lg font-semibold disabled:opacity-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Project'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// GitHub Import Modal Component  
function GitHubImportModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [githubUrl, setGithubUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidate = async () => {
    if (!githubUrl) return;

    setValidating(true);
    try {
      const response = await projectService.validateGitHubRepo(githubUrl);
      setIsValid(response.data?.isValid || false);
    } catch {
      setIsValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await projectService.importFromGitHub({ githubUrl, projectName });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to import from GitHub:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
              <Github className="w-5 h-5 text-white dark:text-gray-900" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Import from GitHub</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub Repository URL *
            </label>
            <div className="relative">
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  setIsValid(null);
                }}
                onBlur={handleValidate}
                required
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://github.com/username/repo"
              />
              {validating && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
              {isValid === true && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              )}
              {isValid === false && (
                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
              )}
            </div>
            {isValid === false && (
              <p className="text-sm text-red-600 mt-1">Invalid GitHub URL or repository not accessible</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Name (optional)
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Leave empty to use repository name"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !githubUrl || isValid === false}
              className="flex-1 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4" />
                  Import Project
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
