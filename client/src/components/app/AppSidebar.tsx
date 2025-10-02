import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { NavItem, NavSection } from '@/components/ui/Navigation';
import { 
  LayoutDashboard,
  FolderOpen, 
  BarChart3,
  Workflow,
  Settings,
  User,
  Plus,
  Github,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bell
} from 'lucide-react';

interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const mainNavigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/app/projects', icon: FolderOpen, badge: 12 },
  { name: 'Analysis', href: '/app/analysis', icon: BarChart3 },
  { name: 'AI Diagrams', href: '/app/diagrams', icon: Workflow, badge: 3 },
];

const bottomNavigation = [
  { name: 'Settings', href: '/app/settings', icon: Settings },
  { name: 'Profile', href: '/app/profile', icon: User },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const location = useLocation();

  return (
    <aside className={`
      ${collapsed ? 'w-16' : 'w-64'} 
      flex-shrink-0 bg-white dark:bg-dark-bg-secondary border-r app-border 
      transition-all duration-200 flex flex-col
    `}>
      {/* Logo & Collapse Toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b app-border">
        {!collapsed && (
          <Link to="/app/dashboard" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-light-text dark:text-dark-text">
              VisualDocs
            </span>
          </Link>
        )}
        
        {collapsed && (
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
        
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-4 space-y-2 border-b app-border">
          <Button size="sm" className="w-full justify-start" icon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            icon={<Github className="w-4 h-4" />}
          >
            Import Repo
          </Button>
        </div>
      )}

      {collapsed && (
        <div className="p-2 space-y-2 border-b app-border">
          <Button
            size="sm"
            className="w-full p-2"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full p-2"
            title="Import Repository"
          >
            <Github className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-6">
          {!collapsed ? (
            <NavSection title="Main">
              {mainNavigation.map((item) => (
                <NavItem
                  key={item.name}
                  href={item.href}
                  icon={<item.icon className="w-5 h-5" />}
                  badge={item.badge}
                >
                  {item.name}
                </NavItem>
              ))}
            </NavSection>
          ) : (
            <div className="px-2 space-y-1">
              {mainNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-md relative
                    transition-colors duration-150
                    ${location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                    }
                  `}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {!collapsed ? (
            <NavSection title="Account">
              {bottomNavigation.map((item) => (
                <NavItem
                  key={item.name}
                  href={item.href}
                  icon={<item.icon className="w-5 h-5" />}
                >
                  {item.name}
                </NavItem>
              ))}
            </NavSection>
          ) : (
            <div className="px-2 space-y-1">
              {bottomNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-md
                    transition-colors duration-150
                    ${location.pathname.startsWith(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary'
                    }
                  `}
                  title={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t app-border">
        {!collapsed ? (
          <div className="space-y-3">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                  John Doe
                </p>
                <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary truncate">
                  john@example.com
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                <ThemeToggle variant="icon" size="sm" />
              </div>
            </div>
            
            {/* Sign Out */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-error-600 border-error-200 hover:bg-error-50 dark:text-error-400 dark:border-error-800 dark:hover:bg-error-900/20"
              icon={<LogOut className="w-4 h-4" />}
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-semibold mx-auto">
              JD
            </div>
            <div className="flex justify-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <ThemeToggle variant="icon" size="sm" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-2 text-error-600 hover:bg-error-50 dark:text-error-400 dark:hover:bg-error-900/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
