import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrl = false,
          meta = false,
          shift = false,
          alt = false,
          callback,
        } = shortcut;

        const isCtrlPressed = ctrl ? event.ctrlKey : !event.ctrlKey;
        const isMetaPressed = meta ? event.metaKey : !event.metaKey;
        const isShiftPressed = shift ? event.shiftKey : !event.shiftKey;
        const isAltPressed = alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          (isCtrlPressed || !ctrl) &&
          (isMetaPressed || !meta) &&
          (isShiftPressed || !shift) &&
          (isAltPressed || !alt)
        ) {
          // Check if we should trigger (both Ctrl OR Meta for cross-platform)
          const shouldTrigger =
            (!ctrl && !meta) || // No modifier required
            (ctrl && event.ctrlKey) || // Ctrl pressed
            (meta && event.metaKey) || // Cmd pressed
            ((ctrl || meta) && (event.ctrlKey || event.metaKey)); // Either pressed

          if (shouldTrigger && event.key.toLowerCase() === key.toLowerCase()) {
            event.preventDefault();
            callback();
            break;
          }
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Hook for displaying keyboard shortcuts modal
export const useKeyboardShortcutsModal = () => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      meta: true,
      callback: () => {},
      description: 'Open command palette',
    },
    {
      key: 'n',
      meta: true,
      callback: () => {},
      description: 'Create new project',
    },
    {
      key: 'b',
      meta: true,
      callback: () => {},
      description: 'Toggle sidebar',
    },
    {
      key: '/',
      callback: () => {},
      description: 'Show keyboard shortcuts',
    },
    {
      key: 'Escape',
      callback: () => {},
      description: 'Close modal/dialog',
    },
  ];

  return shortcuts;
};
