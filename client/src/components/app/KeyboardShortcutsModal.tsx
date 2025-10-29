import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: 'General' | 'Navigation' | 'Actions' | 'Editor';
}

const shortcuts: Shortcut[] = [
  // General
  {
    keys: ['⌘', 'K'],
    description: 'Open command palette',
    category: 'General',
  },
  {
    keys: ['⌘', '/'],
    description: 'Show keyboard shortcuts',
    category: 'General',
  },
  {
    keys: ['Esc'],
    description: 'Close modal/dialog',
    category: 'General',
  },
  
  // Navigation
  {
    keys: ['⌘', 'B'],
    description: 'Toggle sidebar',
    category: 'Navigation',
  },
  {
    keys: ['⌘', '1-9'],
    description: 'Go to project 1-9',
    category: 'Navigation',
  },
  
  // Actions
  {
    keys: ['⌘', 'N'],
    description: 'Create new project',
    category: 'Actions',
  },
  {
    keys: ['⌘', 'U'],
    description: 'Upload files',
    category: 'Actions',
  },
  {
    keys: ['⌘', 'E'],
    description: 'Export project',
    category: 'Actions',
  },
  {
    keys: ['⌘', 'S'],
    description: 'Save changes',
    category: 'Actions',
  },
  {
    keys: ['⌘', 'Shift', 'S'],
    description: 'Share project',
    category: 'Actions',
  },
];

export const KeyboardShortcutsModal = ({ open, onOpenChange }: KeyboardShortcutsModalProps) => {
  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50"
                    >
                      <span className="text-sm text-zinc-700">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono text-zinc-700 shadow-sm min-w-[28px] text-center"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-100 pt-4">
          <p className="text-xs text-zinc-500 text-center">
            Use <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-xs font-mono mx-1">Ctrl</kbd> 
            instead of <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-xs font-mono mx-1">⌘</kbd> on Windows
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
