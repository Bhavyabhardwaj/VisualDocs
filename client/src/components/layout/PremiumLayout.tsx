import { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { PremiumSidebar } from './PremiumSidebar';
import { CommandPalette } from '../app/CommandPalette';
import { NotificationsPanel } from '../notifications/NotificationsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout = ({ children }: PremiumLayoutProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <PremiumSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search projects, files, or press ⌘K"
                className="pl-10 h-9 bg-neutral-50 border-neutral-200 focus:bg-white"
                onClick={() => setCommandPaletteOpen(true)}
                readOnly
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCommandPaletteOpen(true)}
              className="h-9 px-3"
            >
              <Command className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <NotificationsPanel />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
};
