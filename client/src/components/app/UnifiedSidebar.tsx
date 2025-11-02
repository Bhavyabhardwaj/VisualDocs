import { useNavigate, useLocation } from 'react-router-dom';
import {
  FolderGit2,
  Sparkles,
  GitBranch,
  Users,
  Settings,
  Home,
  FileText,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: Home,
    path: '/app/dashboard',
  },
  {
    label: 'Projects',
    icon: FolderGit2,
    path: '/app/projects',
  },
  {
    label: 'AI Analysis',
    icon: Sparkles,
    path: '/app/analysis',
  },
  {
    label: 'Diagrams',
    icon: GitBranch,
    path: '/app/diagrams',
  },
  {
    label: 'Documentation',
    icon: FileText,
    path: '/app/documentation',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/app/analytics',
  },
  {
    label: 'Team',
    icon: Users,
    path: '/app/team',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/app/settings',
  },
];

export const UnifiedSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="fixed left-0 top-14 sm:top-16 z-30 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 border-r border-neutral-200 bg-white transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out">
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 p-3 sm:p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-bg text-brand-primary shadow-sm'
                    : 'text-neutral-600 hover:bg-brand-bg/50 hover:text-brand-primary'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    active ? 'text-brand-primary' : 'text-neutral-500 group-hover:text-brand-primary'
                  )}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-brand-primary px-2 py-0.5 text-xs font-medium text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-neutral-200 p-4">
          <div className="rounded-lg bg-brand-bg p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-primary" />
              <span className="text-sm font-semibold text-brand-primary">Pro Tip</span>
            </div>
            <p className="text-xs text-neutral-600">
              Use <kbd className="rounded bg-white px-1.5 py-0.5 font-mono text-neutral-800 shadow-sm">⌘K</kbd> to quickly
              search across projects
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
