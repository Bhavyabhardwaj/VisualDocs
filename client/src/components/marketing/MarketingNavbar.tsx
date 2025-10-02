import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Github, Menu, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export const MarketingNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-marketing-dark/80 backdrop-blur-xl border-b border-white/10">
      <nav className="content-container flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-gradient-to-r from-marketing-primary to-marketing-secondary rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold marketing-gradient">
              VisualDocs
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle variant="icon" />
          <Link to="/auth/login">
            <Button variant="marketing-secondary" size="sm">
              Sign In
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button variant="marketing-primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-2">
          <ThemeToggle variant="icon" />
          <button
            type="button"
            className="p-2 text-white/70 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-marketing-dark/95 backdrop-blur-lg">
            <div className="content-container h-full flex flex-col">
              {/* Mobile Header */}
              <div className="flex items-center justify-between h-16">
                <Link 
                  to="/" 
                  className="flex items-center space-x-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-marketing-primary to-marketing-secondary rounded-lg flex items-center justify-center shadow-glow">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold marketing-gradient">
                    VisualDocs
                  </span>
                </Link>
                <button
                  type="button"
                  className="p-2 text-white/70 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 flex flex-col justify-center space-y-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-2xl font-bold text-white hover:marketing-gradient transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="pb-8 space-y-4">
                <Link 
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="marketing-secondary" size="lg" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link 
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="marketing-primary" size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
