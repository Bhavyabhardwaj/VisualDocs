import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Command, Zap } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: 'General' | 'Navigation' | 'Actions';
  icon?: React.ReactNode;
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
      <DialogContent className="sm:max-w-3xl !bg-white !border-neutral-200 p-0 gap-0 overflow-hidden">
        {/* Header - Light Theme */}
        <div className="!bg-gradient-to-r !from-neutral-50 !to-neutral-100 px-6 py-5 border-b !border-neutral-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 !text-neutral-900 text-xl">
              <div className="w-10 h-10 rounded-lg !bg-neutral-200 flex items-center justify-center">
                <Command className="w-5 h-5 !text-neutral-700" />
              </div>
              Keyboard Shortcuts
            </DialogTitle>
            <DialogDescription className="!text-neutral-600 mt-2">
              Master these shortcuts to boost your productivity
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto !bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b !border-neutral-200">
                  <Zap className="w-4 h-4 !text-neutral-600" />
                  <h3 className="text-sm font-semibold !text-neutral-900">
                    {category}
                  </h3>
                </div>
                <div className="space-y-3">
                  {shortcuts
                    .filter((s) => s.category === category)
                    .map((shortcut, index) => (
                      <div
                        key={index}
                        className="group"
                      >
                        <div className="text-xs !text-neutral-600 mb-1.5">
                          {shortcut.description}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {shortcut.keys.map((key, i) => (
                            <kbd
                              key={i}
                              className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 !bg-neutral-50 !border !border-neutral-300 rounded-md text-xs font-semibold !text-neutral-900 shadow-sm group-hover:!border-neutral-400 group-hover:!bg-neutral-100 transition-colors"
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
        </div>

        {/* Footer */}
        <div className="!bg-neutral-50 border-t !border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-center gap-2 text-xs !text-neutral-600">
            <span>Windows users: Replace</span>
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 !bg-white !border !border-neutral-300 rounded text-xs font-semibold !text-neutral-900">⌘</kbd>
            <span>with</span>
            <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 !bg-white !border !border-neutral-300 rounded text-xs font-semibold !text-neutral-900">Ctrl</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
