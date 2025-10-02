import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Breadcrumb } from '@/components/ui/Navigation';
import { 
  Menu,
  Search,
  Bell,
  Plus,
  Sparkles
} from 'lucide-react';

interface AppTopbarProps {
  onMenuToggle?: () => void;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({ 
  onMenuToggle, 
  breadcrumbs = [] 
}) => {
  return (
    <header className="h-16 bg-white dark:bg-dark-bg border-b app-border flex items-center px-4 lg:px-6">
      <div className="flex items-center justify-between w-full">
        {/* Left Side - Mobile Menu & Breadcrumbs */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden w-8 h-8 p-0"
            onClick={onMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Logo (Mobile Only) */}
          <Link to="/app/dashboard" className="lg:hidden flex items-center space-x-2">
            <div className="w-7 h-7 bg-primary-500 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-light-text dark:text-dark-text">
              VisualDocs
            </span>
          </Link>

          {/* Breadcrumbs (Desktop) */}
          {breadcrumbs.length > 0 && (
            <div className="hidden lg:block">
              <Breadcrumb items={breadcrumbs} />
            </div>
          )}
        </div>

        {/* Center - Search (Desktop) */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-text-tertiary dark:text-dark-text-tertiary w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects, files..."
              className="w-full pl-10 pr-4 py-2 bg-light-bg-secondary dark:bg-dark-bg-secondary border app-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-theme text-sm"
            />
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Search (Mobile) */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden w-8 h-8 p-0"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* New Project */}
          <Button
            size="sm"
            className="hidden sm:flex"
            icon={<Plus className="w-4 h-4" />}
          >
            New Project
          </Button>

          <Button
            size="sm"
            className="sm:hidden w-8 h-8 p-0"
            title="New Project"
          >
            <Plus className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle variant="icon" size="sm" />

          {/* User Avatar (Mobile) */}
          <div className="lg:hidden w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
};
