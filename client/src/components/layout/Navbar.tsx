import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Github, Menu, X, Code2 } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Projects', href: '/projects' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'FAQ', href: '/faq' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center">
                <Code2 className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-xl font-black text-black">VisualDocs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'font-semibold transition-colors duration-200 px-3 py-2',
                  isActive(item.href)
                    ? 'text-emerald-600 bg-emerald-50 border-b-2 border-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              icon={<Github className="w-4 h-4" />}
              onClick={() => window.open('/api/oauth/github', '_self')}
            >
              Import Repo
            </Button>
            <Link to="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-black hover:text-emerald-600 hover:bg-gray-50 transition-colors border-2 border-black bg-white"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t-2 border-black">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'block px-3 py-2 text-base font-semibold border-2 mb-2',
                  isActive(item.href)
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50 border-transparent hover:border-gray-300'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                icon={<Github className="w-4 h-4" />}
                onClick={() => {
                  setIsOpen(false);
                  window.open('/api/oauth/github', '_self');
                }}
              >
                Import Repository
              </Button>
              <Link to="/auth/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" size="sm" fullWidth>
                  Log In
                </Button>
              </Link>
              <Link to="/auth/register" onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="sm" fullWidth>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
