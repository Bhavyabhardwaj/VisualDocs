import { Search, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';
import { ImprovedCommandPalette } from './ImprovedCommandPalette';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { useState, useEffect } from 'react';

export const TopNavBar = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette: Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      // Keyboard Shortcuts: Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }

      // Close modals: Escape
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShortcutsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-3 sm:px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-base sm:text-lg font-semibold text-brand-primary">VisualDocs</h1>
        </div>

        {/* Center: Search (Desktop & Tablet) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-brand-bg hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors max-w-xs sm:max-w-md w-full"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
          <span className="text-xs sm:text-sm text-neutral-500 flex-1 text-left hidden md:inline">Search projects, files...</span>
          <span className="text-xs sm:text-sm text-neutral-500 flex-1 text-left md:hidden">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-xs text-neutral-600 font-mono">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Mobile Search Button */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="sm:hidden flex items-center justify-center w-9 h-9 bg-brand-bg hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4 text-neutral-600" />
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Notifications */}
          <NotificationsMenu />

          {/* Settings */}
          <button 
            className="p-1.5 sm:p-2 rounded-lg hover:bg-brand-bg transition-colors"
            onClick={() => setShortcutsModalOpen(true)}
            title="Settings & Shortcuts"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Command Palette */}
      <ImprovedCommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal open={shortcutsModalOpen} onOpenChange={setShortcutsModalOpen} />
    </>
  );
};
