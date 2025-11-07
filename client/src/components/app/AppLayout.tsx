import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AppSidebar } from './AppSidebar';
import { TopNavBar } from './TopNavBar';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ breadcrumbs }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useResponsive();
  
  // Suppress unused variable warning - breadcrumbs reserved for future use
  void breadcrumbs;

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-theme">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar 
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-[280px] max-w-[85vw] bg-white dark:bg-dark-bg-secondary shadow-2xl animate-slide-in-left">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <AppSidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Mobile Hamburger Button */}
          {isMobile && (
            <div className="lg:hidden fixed top-4 left-4 z-40">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="h-10 w-10 bg-white dark:bg-dark-bg-secondary shadow-lg"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Topbar */}
          <TopNavBar onMenuClick={() => setMobileMenuOpen(true)} />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-light-bg dark:bg-dark-bg transition-theme overscroll-none">
            <div className="min-h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
