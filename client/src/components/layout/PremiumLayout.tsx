import { useState } from 'react';
import { TopNavBar } from '../app/TopNavBar';
import { UnifiedSidebar } from '../app/UnifiedSidebar';
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts';
import { ImprovedCommandPalette } from '../app/ImprovedCommandPalette';
import { KeyboardShortcutsModal } from '../app/KeyboardShortcutsModal';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout = ({ children }: PremiumLayoutProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global keyboard shortcuts
  useGlobalShortcuts({
    onCommandPalette: () => setCommandPaletteOpen(true),
    onShortcutsModal: () => setShortcutsModalOpen(true),
    onToggleSidebar: () => setSidebarOpen(prev => !prev),
  });

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Navigation Bar */}
      <TopNavBar 
        onCommandPalette={() => setCommandPaletteOpen(true)}
        onShortcutsModal={() => setShortcutsModalOpen(true)}
        onMenuClick={handleMobileMenuToggle}
      />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Unified Sidebar - Mobile Drawer */}
      <div className={`
        fixed top-14 left-0 bottom-0 z-50 w-[280px] max-w-[85vw] bg-white border-r border-neutral-200
        transform transition-transform duration-300 ease-out lg:hidden
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <UnifiedSidebar isOpen={true} onToggle={handleMobileMenuClose} onNavigate={handleMobileMenuClose} />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <UnifiedSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Main Content with Sidebar and TopNav Offset - Mobile Responsive */}
      <main className={`transition-all duration-300 pt-16 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {children}
      </main>

      {/* Global Modals */}
      <ImprovedCommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      <KeyboardShortcutsModal open={shortcutsModalOpen} onOpenChange={setShortcutsModalOpen} />
    </div>
  );
};
