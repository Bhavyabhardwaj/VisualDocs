import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  FileCode,
  Folder,
  Users,
  Clock,
  Command,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data - replace with real API calls
const mockSearchResults = {
  projects: [
    { id: '1', name: 'VisualDocs Frontend', description: 'React TypeScript frontend application', files: 45 },
    { id: '2', name: 'Backend API', description: 'Node.js Express server with MongoDB', files: 32 },
  ],
  files: [
    { id: '1', name: 'App.tsx', path: 'src/App.tsx', projectId: '1', projectName: 'VisualDocs Frontend' },
    { id: '2', name: 'server.ts', path: 'src/server.ts', projectId: '2', projectName: 'Backend API' },
  ],
  team: [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner' },
    { id: '2', name: 'Sarah Adams', email: 'sarah@example.com', role: 'Admin' },
  ],
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'authentication flow',
    'payment integration',
    'dashboard components',
  ]);

  // Filter results based on query
  const filteredProjects = mockSearchResults.projects.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFiles = mockSearchResults.files.filter(
    (f) => f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.path.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTeam = mockSearchResults.team.filter(
    (t) => t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.email.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filteredProjects.length + filteredFiles.length + filteredTeam.length;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelect(selectedIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, totalResults]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpenChange]);

  const handleSelect = (index: number) => {
    let currentIndex = 0;
    
    // Navigate to projects
    for (let i = 0; i < filteredProjects.length; i++) {
      if (currentIndex === index) {
        navigate(`/app/projects/${filteredProjects[i].id}`);
        onOpenChange(false);
        addToRecentSearches(query);
        return;
      }
      currentIndex++;
    }

    // Navigate to files
    for (let i = 0; i < filteredFiles.length; i++) {
      if (currentIndex === index) {
        navigate(`/app/projects/${filteredFiles[i].projectId}`);
        onOpenChange(false);
        addToRecentSearches(query);
        return;
      }
      currentIndex++;
    }

    // Navigate to team
    for (let i = 0; i < filteredTeam.length; i++) {
      if (currentIndex === index) {
        navigate(`/app/team`);
        onOpenChange(false);
        addToRecentSearches(query);
        return;
      }
      currentIndex++;
    }
  };

  const addToRecentSearches = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setRecentSearches((prev) => [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ].slice(0, 5));
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-neutral-400" />
            <Input
              placeholder="Search projects, files, team members..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              className="border-0 focus-visible:ring-0 text-base h-auto p-0"
              autoFocus
            />
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <kbd className="px-2 py-1 bg-neutral-100 rounded border border-neutral-200 font-mono">
                <Command className="w-3 h-3 inline" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            {query.length === 0 ? (
              /* Recent Searches */
              <div className="space-y-1">
                <div className="px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                </div>
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-neutral-100 transition-colors text-left"
                  >
                    <span className="text-sm text-neutral-700">{search}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </div>
            ) : totalResults === 0 ? (
              /* No Results */
              <div className="py-12 text-center">
                <Search className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-neutral-900 mb-1">No results found</p>
                <p className="text-xs text-neutral-500">Try searching with different keywords</p>
              </div>
            ) : (
              /* Search Results */
              <div className="space-y-4">
                {/* Projects */}
                {filteredProjects.length > 0 && (
                  <div>
                    <div className="px-3 py-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                        <Folder className="w-3.5 h-3.5" />
                        <span>Projects</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {filteredProjects.length}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {filteredProjects.map((project, idx) => {
                        const globalIndex = idx;
                        return (
                          <button
                            key={project.id}
                            onClick={() => handleSelect(globalIndex)}
                            className={cn(
                              "w-full flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-left",
                              selectedIndex === globalIndex
                                ? "bg-blue-50 border border-blue-200"
                                : "hover:bg-neutral-100"
                            )}
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <Folder className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 truncate">
                                {project.name}
                              </p>
                              <p className="text-xs text-neutral-500 truncate">
                                {project.description} • {project.files} files
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files */}
                {filteredFiles.length > 0 && (
                  <>
                    {filteredProjects.length > 0 && <Separator />}
                    <div>
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Files</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {filteredFiles.length}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {filteredFiles.map((file, idx) => {
                          const globalIndex = filteredProjects.length + idx;
                          return (
                            <button
                              key={file.id}
                              onClick={() => handleSelect(globalIndex)}
                              className={cn(
                                "w-full flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-left",
                                selectedIndex === globalIndex
                                  ? "bg-blue-50 border border-blue-200"
                                  : "hover:bg-neutral-100"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                <FileCode className="w-4 h-4 text-neutral-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
                                  {file.projectName} • {file.path}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-1" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* Team */}
                {filteredTeam.length > 0 && (
                  <>
                    {(filteredProjects.length > 0 || filteredFiles.length > 0) && <Separator />}
                    <div>
                      <div className="px-3 py-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
                          <Users className="w-3.5 h-3.5" />
                          <span>Team Members</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {filteredTeam.length}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {filteredTeam.map((member, idx) => {
                          const globalIndex = filteredProjects.length + filteredFiles.length + idx;
                          return (
                            <button
                              key={member.id}
                              onClick={() => handleSelect(globalIndex)}
                              className={cn(
                                "w-full flex items-start gap-3 px-3 py-2.5 rounded-md transition-colors text-left",
                                selectedIndex === globalIndex
                                  ? "bg-blue-50 border border-blue-200"
                                  : "hover:bg-neutral-100"
                              )}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">
                                  {member.name}
                                </p>
                                <p className="text-xs text-neutral-500 truncate">
                                  {member.email} • {member.role}
                                </p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-1" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-neutral-200">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <span>{totalResults} results</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
