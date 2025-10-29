import { Search, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';
import { CommandPalette } from './CommandPalette';
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
      <div className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4 lg:px-6">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-zinc-900">VisualDocs</h1>
        </div>

        {/* Center: Search (Desktop) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg transition-colors max-w-md w-full"
        >
          <Search className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-500 flex-1 text-left">Search projects, files...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-zinc-200 rounded text-xs text-zinc-600 font-mono">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <Search className="w-5 h-5 text-zinc-600" />
          </button>

          {/* Notifications */}
          <NotificationsMenu />

          {/* Settings */}
          <button 
            className="p-2 rounded-lg hover:bg-zinc-50 transition-colors"
            onClick={() => setShortcutsModalOpen(true)}
            title="Settings & Shortcuts"
          >
            <Settings className="w-5 h-5 text-zinc-600" />
          </button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal open={shortcutsModalOpen} onOpenChange={setShortcutsModalOpen} />
    </>
  );
};
