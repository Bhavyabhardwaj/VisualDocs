import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseGlobalShortcutsOptions {
  onCommandPalette?: () => void;
  onShortcutsModal?: () => void;
  onToggleSidebar?: () => void;
}

export const useGlobalShortcuts = ({
  onCommandPalette,
  onShortcutsModal,
  onToggleSidebar,
}: UseGlobalShortcutsOptions = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ignore shortcuts when typing in input fields
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Only allow Command Palette and Escape in input fields
        if (!(modifier && e.key === 'k') && e.key !== 'Escape') {
          return;
        }
      }

      // Command Palette: Cmd/Ctrl + K
      if (modifier && e.key === 'k') {
        e.preventDefault();
        onCommandPalette?.();
        return;
      }

      // Keyboard Shortcuts Modal: Cmd/Ctrl + /
      if (modifier && e.key === '/') {
        e.preventDefault();
        onShortcutsModal?.();
        return;
      }

      // Toggle Sidebar: Cmd/Ctrl + B
      if (modifier && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar?.();
        return;
      }

      // Navigation Shortcuts
      if (modifier && !e.shiftKey) {
        switch (e.key) {
          case 'd':
            e.preventDefault();
            navigate('/app/dashboard');
            break;
          case 'p':
            e.preventDefault();
            navigate('/app/projects');
            break;
          case 'a':
            e.preventDefault();
            navigate('/app/analysis');
            break;
          case 'g':
            e.preventDefault();
            navigate('/app/diagrams');
            break;
          case 'o':
            e.preventDefault();
            navigate('/app/documentation');
            break;
          case 'y':
            e.preventDefault();
            navigate('/app/analytics');
            break;
          case 't':
            e.preventDefault();
            navigate('/app/team');
            break;
          case ',':
            e.preventDefault();
            navigate('/app/settings');
            break;
          // Project quick access: 1-9
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
            e.preventDefault();
            // This will be handled by the projects page
            console.log(`Quick access to project ${e.key}`);
            break;
        }
      }

      // Action Shortcuts
      if (modifier) {
        if (e.key === 'n') {
          e.preventDefault();
          // Trigger create new project modal
          const createBtn = document.querySelector('[data-action="create-project"]') as HTMLElement;
          createBtn?.click();
        }

        if (e.key === 'u') {
          e.preventDefault();
          // Trigger upload files
          const uploadBtn = document.querySelector('[data-action="upload-files"]') as HTMLElement;
          uploadBtn?.click();
        }

        if (e.key === 'e') {
          e.preventDefault();
          // Trigger export project
          const exportBtn = document.querySelector('[data-action="export-project"]') as HTMLElement;
          exportBtn?.click();
        }

        if (e.key === 's') {
          e.preventDefault();
          if (e.shiftKey) {
            // Share project: Cmd/Ctrl + Shift + S
            const shareBtn = document.querySelector('[data-action="share-project"]') as HTMLElement;
            shareBtn?.click();
          } else {
            // Save changes: Cmd/Ctrl + S
            const saveBtn = document.querySelector('[data-action="save-changes"]') as HTMLElement;
            saveBtn?.click();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onCommandPalette, onShortcutsModal, onToggleSidebar]);
};
