import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Search,
  Clock,
  Users,
  BarChart3,
  MessageSquare,
  Activity,
  CheckCircle2,
  AlertCircle,
  Star,
  GitBranch,
  Download,
  Share2,
  MoreVertical,
  Code2,
  FileJson,
  File
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
    return nodes.map((node) => {
      const isExpanded = expandedFolders.has(node.path);
      const isSelected = selectedFile === node.path;
      
      return (
        <div key={node.path}>
          <button
            className={`
              w-full flex items-center gap-2 py-1.5 px-2 text-sm rounded
              hover:bg-neutral-100 transition-colors text-left
              ${isSelected ? 'bg-blue-50 text-blue-600' : 'text-neutral-700'}
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
              isExpanded ? (
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              )
            ) : (
              <div className="w-4" />
            )}
            
            {node.type === 'folder' ? (
              isExpanded ? (
                <FolderOpen className="w-4 h-4 flex-shrink-0 text-blue-500" />
              ) : (
                <Folder className="w-4 h-4 flex-shrink-0 text-blue-500" />
              )
            ) : node.name.endsWith('.tsx') || node.name.endsWith('.ts') ? (
              <FileCode className="w-4 h-4 flex-shrink-0 text-blue-600" />
            ) : node.name.endsWith('.json') ? (
              <FileJson className="w-4 h-4 flex-shrink-0 text-yellow-600" />
            ) : (
              <File className="w-4 h-4 flex-shrink-0 text-neutral-500" />
            )}
            
            <span className="flex-1 truncate">{node.name}</span>
            
            {node.type === 'file' && node.size && (
              <span className="text-xs text-neutral-500">
                {(node.size / 1024).toFixed(1)}KB
              </span>
            )}
          </button>
          
          {node.type === 'folder' && isExpanded && node.children && (
            <div>
              {renderFileTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <PremiumLayout>
      <div className="h-screen bg-white flex flex-col">
        {/* 3-Panel Layout: File Explorer | Editor | Info Panel */}
        <div className="flex-1 flex overflow-hidden border-t border-neutral-200">
          
          {/* LEFT PANEL: File Explorer (250px) */}
          <div className="w-[250px] border-r border-neutral-200 flex flex-col bg-white">
            {/* File Explorer Header */}
            <div className="p-4 border-b border-neutral-200">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">File Explorer</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search files..."
                  className="h-8 pl-9 text-sm border-neutral-200"
                />
              </div>
            </div>

            {/* File Tree */}
            <ScrollArea className="flex-1 p-2">
              {renderFileTree(mockFileTree)}
            </ScrollArea>

            {/* Recent Files */}
            <div className="p-3 border-t border-neutral-200">
              <p className="text-xs font-medium text-neutral-600 mb-2">Recent Files</p>
              <div className="space-y-1">
                <button className="w-full flex items-center gap-2 p-1.5 text-xs rounded hover:bg-neutral-100 text-neutral-700">
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="truncate">App.tsx</span>
                </button>
                <button className="w-full flex items-center gap-2 p-1.5 text-xs rounded hover:bg-neutral-100 text-neutral-700">
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="truncate">Dashboard.tsx</span>
                </button>
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Tabs & Editor (flex-1) */}
          <div className="flex-1 flex flex-col bg-white">
            <Tabs defaultValue="code" className="flex-1 flex flex-col">
              {/* Tab Navigation */}
              <div className="border-b border-neutral-200 px-4">
                <TabsList className="h-11 bg-transparent">
                  <TabsTrigger value="code" className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
                    <Code2 className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="documentation">
                    <FileText className="w-4 h-4 mr-2" />
                    Documentation
                  </TabsTrigger>
                  <TabsTrigger value="diagrams">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Diagrams
                  </TabsTrigger>
                  <TabsTrigger value="analysis">
                    <Activity className="w-4 h-4 mr-2" />
                    Analysis
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="code" className="h-full m-0 p-0">
                  {/* Code Viewer */}
                  <div className="h-full flex flex-col">
                    {/* File Header */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-neutral-900">
                          {selectedFile || 'No file selected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-7">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Syntax Highlighted Code */}
                    <ScrollArea className="flex-1 p-6">
                      {selectedFile ? (
                        <pre className="text-sm font-mono leading-relaxed text-neutral-800">
{`import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/app/Dashboard';
import { AppLayout } from '@/components/app/AppLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;`}
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-500">
                          <div className="text-center">
                            <FileCode className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                            <p className="text-sm">Select a file to view its contents</p>
                          </div>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="documentation" className="h-full m-0 p-6">
                  <div className="prose max-w-none">
                    <h1>Project Documentation</h1>
                    <p className="text-neutral-600">
                      AI-generated documentation for your project will appear here.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="diagrams" className="h-full m-0 p-6">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-neutral-600">Interactive diagrams will be displayed here</p>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="h-full m-0 p-6">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Code Analysis</h2>
                    <Card className="border-neutral-200">
                      <CardHeader>
                        <CardTitle className="text-base">Quality Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Overall Quality</span>
                              <span className="text-sm font-medium">94%</span>
                            </div>
                            <Progress value={94} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Test Coverage</span>
                              <span className="text-sm font-medium">87%</span>
                            </div>
                            <Progress value={87} className="h-2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* RIGHT PANEL: Project Info (320px) */}
          <div className="w-[320px] border-l border-neutral-200 bg-white">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* Project Info Card */}
                <Card className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Project Info</CardTitle>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-900">{project.name}</h3>
                        {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className="text-sm text-neutral-600">{project.description}</p>
                    </div>

                    <Separator className="bg-neutral-200" />

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <GitBranch className="w-4 h-4" />
                        <span className="truncate">{project.repository}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Clock className="w-4 h-4" />
                        <span>Updated {project.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Metrics */}
                <Card className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Quality Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Quality Score Circle */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-neutral-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - project.qualityScore / 100)}`}
                            className="text-blue-600"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-neutral-900">{project.qualityScore}</span>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 mt-2">Overall Score</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Lines of Code</span>
                        <span className="font-medium">{project.linesOfCode.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-600">Language</span>
                        <Badge variant="outline" className="text-xs">{project.language}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Team Members
                    </CardTitle>
                    <CardDescription className="text-xs">{project.collaborators} collaborators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">JD</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">John Doe</p>
                          <p className="text-xs text-neutral-600">Owner</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">SA</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">Sarah Adams</p>
                          <p className="text-xs text-neutral-600">Admin</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-green-100 text-green-600 text-xs">MB</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900">Mike Brown</p>
                          <p className="text-xs text-neutral-600">Member</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex items-start gap-2 mb-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-[10px]">JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">John Doe</p>
                            <p className="text-xs text-neutral-600">2 hours ago</p>
                          </div>
                        </div>
                        <p className="text-neutral-700 ml-8">Great work on the refactoring!</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                        <MessageSquare className="w-3.5 h-3.5 mr-2" />
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card className="border-neutral-200 shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-neutral-900">Analysis completed</p>
                          <p className="text-xs text-neutral-600">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-neutral-900">3 new issues found</p>
                          <p className="text-xs text-neutral-600">3 hours ago</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <FileCode className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-neutral-900">8 files updated</p>
                          <p className="text-xs text-neutral-600">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
};
