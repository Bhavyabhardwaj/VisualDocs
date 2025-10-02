import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';

interface AppLayoutProps {
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ breadcrumbs }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-theme">
      <div className="flex h-screen">
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
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-64 bg-white dark:bg-dark-bg-secondary">
              <AppSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <AppTopbar 
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            breadcrumbs={breadcrumbs}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-light-bg dark:bg-dark-bg transition-theme">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
