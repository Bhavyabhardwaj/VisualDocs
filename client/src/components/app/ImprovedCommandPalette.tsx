import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  FileCode,
  Folder,
  Sparkles,
  Clock,
  GitBranch,
  Users,
  Settings,
  Home,
  FileText,
  BarChart3,
} from 'lucide-react';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';

interface ImprovedCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImprovedCommandPalette = ({ open, onOpenChange }: ImprovedCommandPaletteProps) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Quick actions
  const quickActions = [
    { label: 'Dashboard', icon: Home, path: '/app/dashboard', shortcut: '⌘D' },
    { label: 'Projects', icon: Folder, path: '/app/projects', shortcut: '⌘P' },
    { label: 'AI Analysis', icon: Sparkles, path: '/app/analysis', shortcut: '⌘A' },
    { label: 'Diagrams', icon: GitBranch, path: '/app/diagrams', shortcut: '⌘G' },
    { label: 'Documentation', icon: FileText, path: '/app/documentation', shortcut: '⌘O' },
    { label: 'Analytics', icon: BarChart3, path: '/app/analytics', shortcut: '⌘Y' },
    { label: 'Team', icon: Users, path: '/app/team', shortcut: '⌘T' },
    { label: 'Settings', icon: Settings, path: '/app/settings', shortcut: '⌘,' },
  ];

  // Fetch projects when dialog opens
  useEffect(() => {
    const fetchProjects = async () => {
      if (!open) return;
      
      setIsLoading(true);
      
      try {
        const response = await projectService.getProjects();
        setProjects(response.data.items || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [open]);

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search projects, navigate, or run commands..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Navigation */}
        <CommandGroup heading="Quick Navigation">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <CommandItem
                key={action.path}
                onSelect={() => handleSelect(action.path)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Icon className="h-4 w-4 text-neutral-500" />
                <span className="flex-1">{action.label}</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-600">
                  {action.shortcut}
                </kbd>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Recent Projects */}
        <CommandGroup heading="Recent Projects">
          {isLoading ? (
            <CommandItem disabled>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Loading projects...
            </CommandItem>
          ) : (
            projects.slice(0, 5).map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => handleSelect(`/app/projects/${project.id}`)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <FileCode className="h-4 w-4 text-neutral-500" />
                <div className="flex-1">
                  <div className="font-medium text-brand-primary">{project.name}</div>
                  {project.description && (
                    <div className="text-xs text-neutral-500 truncate">{project.description}</div>
                  )}
                </div>
                {project.lastAnalyzedAt && (
                  <Badge variant="secondary" className="text-xs">
                    Analyzed
                  </Badge>
                )}
              </CommandItem>
            ))
          )}
        </CommandGroup>

        {projects.length > 5 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="All Projects">
              {projects.slice(5).map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleSelect(`/app/projects/${project.id}`)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Folder className="h-4 w-4 text-neutral-500" />
                  <span className="flex-1">{project.name}</span>
                  {project.fileCount && (
                    <span className="text-xs text-neutral-500">{project.fileCount} files</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
