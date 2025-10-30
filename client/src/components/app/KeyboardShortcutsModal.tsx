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
      <DialogContent className="sm:max-w-2xl bg-white border-neutral-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-primary">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-neutral-600">
            Speed up your workflow with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-brand-primary mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-brand-bg transition-colors"
                    >
                      <span className="text-sm text-neutral-700">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd
                            key={i}
                            className="px-2 py-1 bg-white border border-neutral-300 rounded text-xs font-mono text-brand-primary shadow-sm min-w-[28px] text-center"
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

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500 text-center">
            Use <kbd className="px-1.5 py-0.5 bg-brand-bg border border-neutral-200 rounded text-xs font-mono mx-1 text-brand-primary">Ctrl</kbd> 
            instead of <kbd className="px-1.5 py-0.5 bg-brand-bg border border-neutral-200 rounded text-xs font-mono mx-1 text-brand-primary">⌘</kbd> on Windows
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
