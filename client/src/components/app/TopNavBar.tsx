import { Search, Settings } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { NotificationsMenu } from './NotificationsMenu';

interface TopNavBarProps {
  onCommandPalette: () => void;
  onShortcutsModal: () => void;
}

export const TopNavBar = ({ onCommandPalette, onShortcutsModal }: TopNavBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-neutral-200 bg-white/95 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 gap-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-4 min-w-0">
        <h1 className="text-lg font-bold text-neutral-900 whitespace-nowrap">VisualDocs</h1>
      </div>

      {/* Center: Search (Desktop & Tablet) */}
      <button
        onClick={onCommandPalette}
        className="hidden sm:flex items-center gap-3 px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-all hover:shadow-sm max-w-md w-full"
      >
        <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <span className="text-sm text-neutral-500 flex-1 text-left truncate">Search projects, files...</span>
        <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 bg-white border border-neutral-200 rounded text-xs text-neutral-600 font-mono shadow-sm">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={onCommandPalette}
        className="sm:hidden flex items-center justify-center w-10 h-10 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
      >
        <Search className="w-5 h-5 text-neutral-600" />
      </button>

      {/* Right: Actions - Professional Spacing */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <NotificationsMenu />

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-6 bg-neutral-200" />

        {/* Settings */}
        <button 
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100 transition-colors group"
          onClick={onShortcutsModal}
          title="Settings & Shortcuts (⌘/)"
        >
          <Settings className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
        </button>

        {/* Vertical Divider */}
        <div className="hidden sm:block w-px h-6 bg-neutral-200" />

        {/* User Menu */}
        <UserMenu />
      </div>
    </div>
  );
};
};
