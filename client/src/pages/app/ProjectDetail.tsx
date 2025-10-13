import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageWrapper } from '@/components/app/PageWrapper';
import {
  Play,
  BarChart3,
  Workflow,
  Settings,
  Star,
  GitBranch,
  ExternalLink,
  Users,
  Clock,
  FileText,
  Folder,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  size?: number;
  lastModified?: string;
}

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx', size: 1240 },
          { name: 'Card.tsx', type: 'file', path: 'src/components/Card.tsx', size: 2180 },
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        path: 'src/pages',
        children: [
          { name: 'Dashboard.tsx', type: 'file', path: 'src/pages/Dashboard.tsx', size: 3200 },
          { name: 'Projects.tsx', type: 'file', path: 'src/pages/Projects.tsx', size: 4100 },
        ]
      },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx', size: 890 },
      { name: 'index.tsx', type: 'file', path: 'src/index.tsx', size: 320 },
    ]
  },
  {
    name: 'public',
    type: 'folder',
    path: 'public',
    children: [
      { name: 'index.html', type: 'file', path: 'public/index.html', size: 1240 },
    ]
  },
  { name: 'package.json', type: 'file', path: 'package.json', size: 1580 },
  { name: 'README.md', type: 'file', path: 'README.md', size: 2340 },
];

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState<string | null>('src/App.tsx');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/pages']));

  // Mock project data
  const project = {
    id,
    name: 'VisualDocs Frontend',
    description: 'React TypeScript frontend application with modern UI components',
    repository: 'github.com/user/visualdocs-frontend',
    language: 'TypeScript',
    qualityScore: 94,
    linesOfCode: 15420,
    collaborators: 3,
    lastUpdated: '2 hours ago',
    status: 'completed' as const,
    starred: true,
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.path}>
        <div
          className={`
            flex items-center space-x-2 py-1 px-2 hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
            cursor-pointer rounded-md text-sm
            ${selectedFile === node.path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-light-text-secondary dark:text-dark-text-secondary'}
          `}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              setSelectedFile(node.path);
            }
          }}
        >
          {node.type === 'folder' ? (
            expandedFolders.has(node.path) ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <div className="w-4" />
          )}
          
          {node.type === 'folder' ? (
            <Folder className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          
          <span className="flex-1 truncate">{node.name}</span>
          
          {node.type === 'file' && node.size && (
            <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              {(node.size / 1024).toFixed(1)}KB
            </span>
          )}
        </div>
        
        {node.type === 'folder' && expandedFolders.has(node.path) && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Project Header */}
      <div className="bg-white dark:bg-dark-bg border-b app-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  {project.name}
                </h1>
                {project.starred && (
                  <Star className="w-5 h-5 text-warning-500 fill-current" />
                )}
              </div>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                {project.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                <span className="flex items-center space-x-1">
                  <GitBranch className="w-4 h-4" />
                  <span>{project.repository}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{project.collaborators} collaborators</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {project.lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" icon={<BarChart3 className="w-4 h-4" />}>
              View Analysis
            </Button>
            <Button variant="outline" icon={<Workflow className="w-4 h-4" />}>
              Generate Diagrams
            </Button>
            <Button icon={<Play className="w-4 h-4" />}>
              Run Analysis
            </Button>
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-80 bg-white dark:bg-dark-bg-secondary border-r app-border overflow-y-auto">
          <div className="p-4 border-b app-border">
            <h3 className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
              File Explorer
            </h3>
            <div className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
              {project.linesOfCode.toLocaleString()} lines • {project.language}
            </div>
          </div>
          <div className="p-2">
            {renderFileTree(mockFileTree)}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 bg-dark-bg text-white overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 bg-dark-bg-secondary border-b border-dark-border-secondary">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedFile || 'No file selected'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 font-mono text-sm overflow-auto">
              {selectedFile ? (
                <pre className="text-gray-300 leading-relaxed">
{`import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/app/Dashboard';
import { AppLayout } from '@/components/app/AppLayout';
import '@/index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;`}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a file to view its contents
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project Info Panel */}
        <div className="w-80 bg-white dark:bg-dark-bg-secondary border-l app-border overflow-y-auto">
          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-light-text dark:text-dark-text">Quality Score</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full" 
                        style={{ width: `${project.qualityScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-light-text dark:text-dark-text">
                      {project.qualityScore}/100
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-light-text dark:text-dark-text">Lines of Code</p>
                  <p className="text-2xl font-bold text-light-text dark:text-dark-text">
                    {project.linesOfCode.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-light-text dark:text-dark-text">Primary Language</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {project.language}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<BarChart3 className="w-4 h-4" />}>
                  View Full Analysis
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<Workflow className="w-4 h-4" />}>
                  Generate Diagrams
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<Users className="w-4 h-4" />}>
                  Manage Collaborators
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" icon={<Settings className="w-4 h-4" />}>
                  Project Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
