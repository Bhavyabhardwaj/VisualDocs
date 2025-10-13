import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight,
  Folder,
  FileText,
  Code2,
  BarChart,
  Layers,
  Users,
  Clock,
  GitBranch,
  MoreHorizontal,
  Download,
  Share2,
  Settings,
  X,
  ChevronDown,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const VSCodeStyleProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCollabPanel, setShowCollabPanel] = useState(true);
  const [project, setProject] = useState({
    name: 'E-Commerce Platform',
    description: 'Full-stack Next.js application',
    repository: {
      url: 'github.com/user/ecommerce',
      branch: 'main'
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Folder },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'diagrams', label: 'Diagrams', icon: Layers },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
  ];

  const fileTree = [
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'components', type: 'folder', children: [] },
        { name: 'pages', type: 'folder', children: [] },
        { name: 'utils', type: 'folder', children: [] },
      ]
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ];

  const collaborators = [
    { id: 1, name: 'John Doe', status: 'active', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', status: 'idle', avatar: 'JS' },
    { id: 3, name: 'Bob Wilson', status: 'active', avatar: 'BW' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center gap-4 px-4 shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{project.name}</span>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-lg text-sm transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-lg text-sm transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* File Tree Sidebar */}
        <aside className="w-60 border-r border-border bg-background overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Files</span>
              <button className="p-1 hover:bg-muted rounded transition-colors">
                <Settings className="h-3 w-3" />
              </button>
            </div>
            
            <FileTree items={fileTree} />
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-border bg-background">
            <div className="flex items-center gap-1 px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    activeTab === tab.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && <OverviewTab project={project} />}
            {activeTab === 'code' && <CodeTab />}
            {activeTab === 'docs' && <DocsTab />}
            {activeTab === 'diagrams' && <DiagramsTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </main>

        {/* Collaboration Panel */}
        {showCollabPanel && (
          <aside className="w-72 border-l border-border bg-background overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold">Team</h3>
                <button
                  onClick={() => setShowCollabPanel(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Active Collaborators */}
              <div className="space-y-2 mb-6">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        {user.avatar}
                      </div>
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                          user.status === 'active' ? 'bg-success' : 'bg-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <Circle className="h-1.5 w-1.5 mt-1.5 fill-current" />
                      <div>
                        <p className="text-foreground">Documentation updated</p>
                        <p className="text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

// File Tree Component
const FileTree = ({ items, level = 0 }: any) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-0.5">
      {items.map((item: any) => (
        <div key={item.name}>
          <button
            onClick={() => item.type === 'folder' && setExpanded(prev => ({
              ...prev,
              [item.name]: !prev[item.name]
            }))}
            className="w-full flex items-center gap-2 px-2 py-1 hover:bg-muted rounded text-sm transition-colors"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {item.type === 'folder' && (
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform",
                  !expanded[item.name] && "-rotate-90"
                )}
              />
            )}
            {item.type === 'folder' ? (
              <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="truncate">{item.name}</span>
          </button>
          {item.type === 'folder' && expanded[item.name] && item.children && (
            <FileTree items={item.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};

// Tab Content Components
const OverviewTab = ({ project }: any) => (
  <div className="max-w-4xl space-y-6">
    <div>
      <h1 className="text-2xl font-semibold mb-2">{project.name}</h1>
      <p className="text-sm text-muted-foreground">{project.description}</p>
    </div>

    {/* Stats Grid */}
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Files Analyzed" value="124" />
      <StatCard label="Documentation Coverage" value="87%" />
      <StatCard label="Code Quality Score" value="92/100" />
    </div>

    {/* Repository Info */}
    <div className="rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold mb-3">Repository</h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Branch:</span>
          <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">
            {project.repository.branch}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">URL:</span>
          <a href={`https://${project.repository.url}`} className="text-foreground hover:underline">
            {project.repository.url}
          </a>
        </div>
      </div>
    </div>
  </div>
);

const CodeTab = () => (
  <div className="max-w-4xl">
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">Code viewer coming soon...</p>
    </div>
  </div>
);

const DocsTab = () => (
  <div className="max-w-4xl">
    <div className="prose prose-sm max-w-none">
      <h2>Documentation</h2>
      <p>Generated documentation will appear here...</p>
    </div>
  </div>
);

const DiagramsTab = () => (
  <div className="max-w-4xl">
    <div className="rounded-lg border border-border bg-muted/30 p-12 text-center">
      <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">No diagrams generated yet</p>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="max-w-4xl">
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground">Analytics coming soon...</p>
    </div>
  </div>
);

const StatCard = ({ label, value }: any) => (
  <div className="rounded-lg border border-border p-4">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);
