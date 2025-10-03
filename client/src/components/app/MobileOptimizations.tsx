import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { X, Menu, Search, Plus } from 'lucide-react';

export const MobileProjectCard: React.FC<{ project: any }> = ({ project }) => {
  return (
    <Card hover className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 bg-primary-500 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-light-text dark:text-dark-text mb-1">
              {project.name}
            </h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-2 mb-2">
              {project.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                <span>{project.language}</span>
                <span>{project.lastUpdated}</span>
              </div>
              <div className="text-sm font-medium text-light-text dark:text-dark-text">
                {project.qualityScore}/100
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MobileFloatingAction: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action Menu */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 lg:hidden">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-xl border app-border p-2 space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      )}
      
      {/* FAB */}
      <button
        className="fixed bottom-4 right-4 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 lg:hidden transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </>
  );
};

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Touch-friendly interactions
export const TouchFriendlyButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  return (
    <button
      className={`min-h-[44px] px-4 py-2 rounded-lg transition-colors active:scale-95 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
