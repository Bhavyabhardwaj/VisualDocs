import { useState } from 'react';
import { PremiumSidebar } from './PremiumSidebar';
import { CommandPalette } from '../app/CommandPalette';

interface PremiumLayoutProps {
  children: React.ReactNode;
}

export const PremiumLayout = ({ children }: PremiumLayoutProps) => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <PremiumSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
    </div>
  );
};
