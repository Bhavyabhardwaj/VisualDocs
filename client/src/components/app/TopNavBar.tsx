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
      <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-brand-primary">VisualDocs</h1>
        </div>

        {/* Center: Search (Desktop) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-brand-bg hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors max-w-md w-full"
        >
          <Search className="w-4 h-4 text-neutral-400" />
          <span className="text-sm text-neutral-500 flex-1 text-left">Search projects, files...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-neutral-200 rounded text-xs text-neutral-600 font-mono">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-brand-bg transition-colors"
          >
            <Search className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Notifications */}
          <NotificationsMenu />

          {/* Settings */}
          <button 
            className="p-2 rounded-lg hover:bg-brand-bg transition-colors"
            onClick={() => setShortcutsModalOpen(true)}
            title="Settings & Shortcuts"
          >
            <Settings className="w-5 h-5 text-neutral-600" />
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
