import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    FolderOpen,
    BarChart3,
    Workflow,
    Settings,
    User,
    Github,
    Plus,
    Code2,
    LogOut,
    Bell,
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
}

const mainNavigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderOpen, badge: 12 },
    { name: 'Analysis', href: '/analysis', icon: BarChart3 },
    { name: 'AI Diagrams', href: '/diagrams', icon: Workflow, badge: 3 },
];

const bottomNavigation: NavItem[] = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Profile', href: '/profile', icon: User },
];

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className={clsx('bg-black text-white h-full flex flex-col border-r-2 border-gray-300', className)}>
            {/* Logo */}
            <div className="p-6 border-b-2 border-gray-800">
                <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-white border-2 border-white flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-xl font-black text-white">VisualDocs</span>
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="p-4 space-y-3 border-b-2 border-gray-800">
                <Button
                    size="sm"
                    variant="primary"
                    fullWidth
                    icon={<Plus className="w-4 h-4" />}
                >
                    New Project
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<Github className="w-4 h-4" />}
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black"
                >
                    Import Repo
                </Button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 py-6">
                <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Main
                    </div>
                    {mainNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    'flex items-center justify-between px-3 py-3 text-sm font-medium transition-all duration-150 border-2',
                                    active
                                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[2px_2px_0px_0px_rgba(0,200,150,0.3)]'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white border-transparent hover:border-gray-700'
                                )}
                            >
                                <div className="flex items-center">
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.name}
                                </div>
                                {item.badge && (
                                    <Badge variant="success" size="sm">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="space-y-2 mt-8">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Account
                    </div>
                    {bottomNavigation.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    'flex items-center px-3 py-3 text-sm font-medium transition-all duration-150 border-2',
                                    active
                                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[2px_2px_0px_0px_rgba(0,200,150,0.3)]'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white border-transparent hover:border-gray-700'
                                )}
                            >
                                <Icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* User Info */}
            <div className="p-4 border-t-2 border-gray-800 bg-gray-900">
                <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500 border-2 border-white flex items-center justify-center font-bold text-white">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">John Doe</p>
                        <p className="text-xs text-gray-400 truncate">john@visualdocs.com</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        icon={<Bell className="w-4 h-4" />}
                        className="text-gray-400 hover:text-white border-transparent p-2" children={undefined}          >
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon={<LogOut className="w-4 h-4" />}
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-red-600 hover:border-red-500 hover:text-white"
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
};
