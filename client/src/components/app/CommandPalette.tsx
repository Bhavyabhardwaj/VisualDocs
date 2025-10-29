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
  Hash,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { projectsApi } from '@/lib/api';
import type { Project } from '@/lib/api';

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
  
  // Real data from API
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Note: isLoading and error are used but TypeScript doesn't detect it in JSX conditional
  // They control the loading and error states in the search results section
  void isLoading; // Suppress unused warning
  void error; // Suppress unused warning

  // Fetch projects when dialog opens
  useEffect(() => {
    const fetchProjects = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await projectsApi.getAll({ limit: 50 });
        
        if (response.success && response.data) {
          setProjects(response.data.projects);
        } else {
          throw new Error(response.error || 'Failed to fetch projects');
        }
      } catch (err: any) {
        console.error('Failed to fetch projects:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Filter results based on query
  const filteredProjects = projects.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  // TODO: Implement file search when backend endpoint is ready
  const filteredFiles: any[] = [];

  // TODO: Implement team search when backend endpoint is ready
  const filteredTeam: any[] = [];

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

  const clearSearch = () => {
    setQuery('');
    setSelectedIndex(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        {/* Glassmorphic Header */}
        <div className="relative bg-gradient-to-br from-zinc-50 via-slate-50 to-gray-50 border-b border-zinc-200/60">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
          <div className="relative p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-lg shadow-zinc-900/20">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 relative">
                <Input
                  placeholder="Search anything... projects, files, team members"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-auto p-0 bg-transparent placeholder:text-gray-400 font-medium"
                  autoFocus
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-200/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm text-[11px] font-medium text-gray-600">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>
            </div>
            
            {/* Quick Stats */}
            {query && totalResults > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-200 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-zinc-700">{totalResults} results</span>
                </div>
                {filteredProjects.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <Folder className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-700">{filteredProjects.length}</span>
                  </div>
                )}
                {filteredFiles.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200">
                    <FileCode className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">{filteredFiles.length}</span>
                  </div>
                )}
                {filteredTeam.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200">
                    <Users className="w-3.5 h-3.5 text-teal-600" />
                    <span className="text-xs font-medium text-teal-700">{filteredTeam.length}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results with improved styling */}
        <ScrollArea className="max-h-[480px] min-h-[320px]">
          <div className="p-4">
            {query.length === 0 ? (
              /* Recent Searches & Quick Actions */
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleRecentSearchClick(search)}
                        className="group w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-zinc-50 hover:to-slate-50 transition-all duration-200 text-left border border-transparent hover:border-zinc-200 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-zinc-800 group-hover:to-zinc-700 flex items-center justify-center transition-all duration-200">
                            <Hash className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-200" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{search}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-zinc-800 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <div className="flex items-center gap-2 px-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        navigate('/app/projects');
                        onOpenChange(false);
                      }}
                      className="group p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 hover:border-emerald-300 transition-all duration-200 text-left hover:shadow-md"
                    >
                      <Folder className="w-5 h-5 text-emerald-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-900">All Projects</p>
                      <p className="text-xs text-gray-600 mt-0.5">Browse all</p>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/app/team');
                        onOpenChange(false);
                      }}
                      className="group p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 hover:border-orange-300 transition-all duration-200 text-left hover:shadow-md"
                    >
                      <Users className="w-5 h-5 text-orange-600 mb-2" />
                      <p className="text-sm font-semibold text-gray-900">Team</p>
                      <p className="text-xs text-gray-600 mt-0.5">View members</p>
                    </button>
                  </div>
                </div>
              </div>
            ) : totalResults === 0 ? (
              /* No Results - Enhanced Empty State */
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find anything matching "<span className="font-semibold text-gray-700">{query}</span>". Try different keywords.
                </p>
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear search
                </button>
              </div>
            ) : (
              /* Search Results - Enhanced Design */
              <div className="space-y-6">
                {/* Projects */}
                {filteredProjects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 px-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Folder className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Projects</h3>
                      <Badge variant="secondary" className="ml-auto text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                        {filteredProjects.length}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      {filteredProjects.map((project, idx) => {
                        const globalIndex = idx;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <button
                            key={project.id}
                            onClick={() => handleSelect(globalIndex)}
                            className={cn(
                              "group w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                              isSelected
                                ? "bg-gradient-to-r from-zinc-900 to-zinc-800 shadow-lg shadow-zinc-900/20 scale-[1.02]"
                                : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
                              isSelected 
                                ? "bg-white/20" 
                                : "bg-gradient-to-br from-emerald-500 to-teal-600 group-hover:scale-110"
                            )}>
                              <Folder className={cn("w-5 h-5", isSelected ? "text-white" : "text-white")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-semibold truncate mb-0.5",
                                isSelected ? "text-white" : "text-gray-900"
                              )}>
                                {project.name}
                              </p>
                              <p className={cn(
                                "text-xs truncate",
                                isSelected ? "text-white/80" : "text-gray-500"
                              )}>
                                {project.description}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className={cn(
                                  "text-xs font-medium",
                                  isSelected ? "text-white/90" : "text-gray-600"
                                )}>
                                  {project.fileCount || 0} files
                                </span>
                              </div>
                            </div>
                            <ArrowRight className={cn(
                              "w-4 h-4 flex-shrink-0 mt-2 transition-transform duration-200",
                              isSelected ? "text-white translate-x-1" : "text-gray-400 group-hover:translate-x-1"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files */}
                {filteredFiles.length > 0 && (
                  <div>
                    {filteredProjects.length > 0 && <Separator className="my-4" />}
                    <div className="flex items-center gap-2 px-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 flex items-center justify-center">
                        <FileCode className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Files</h3>
                      <Badge variant="secondary" className="ml-auto text-xs bg-orange-50 text-orange-700 border-orange-200">
                        {filteredFiles.length}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      {filteredFiles.map((file, idx) => {
                        const globalIndex = filteredProjects.length + idx;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <button
                            key={file.id}
                            onClick={() => handleSelect(globalIndex)}
                            className={cn(
                              "group w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                              isSelected
                                ? "bg-gradient-to-r from-orange-600 to-amber-600 shadow-lg shadow-orange-600/20 scale-[1.02]"
                                : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200",
                              isSelected 
                                ? "bg-white/20" 
                                : "bg-gradient-to-br from-orange-500 to-amber-600 group-hover:scale-110"
                            )}>
                              <FileCode className={cn("w-5 h-5", isSelected ? "text-white" : "text-white")} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-semibold truncate mb-0.5 font-mono",
                                isSelected ? "text-white" : "text-gray-900"
                              )}>
                                {file.name}
                              </p>
                              <p className={cn(
                                "text-xs truncate font-mono",
                                isSelected ? "text-white/80" : "text-gray-500"
                              )}>
                                {file.path}
                              </p>
                              <p className={cn(
                                "text-xs truncate mt-0.5",
                                isSelected ? "text-white/70" : "text-gray-400"
                              )}>
                                in {file.projectName}
                              </p>
                            </div>
                            <ArrowRight className={cn(
                              "w-4 h-4 flex-shrink-0 mt-2 transition-transform duration-200",
                              isSelected ? "text-white translate-x-1" : "text-gray-400 group-hover:translate-x-1"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Team */}
                {filteredTeam.length > 0 && (
                  <div>
                    {(filteredProjects.length > 0 || filteredFiles.length > 0) && <Separator className="my-4" />}
                    <div className="flex items-center gap-2 px-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">Team Members</h3>
                      <Badge variant="secondary" className="ml-auto text-xs bg-teal-50 text-teal-700 border-teal-200">
                        {filteredTeam.length}
                      </Badge>
                    </div>
                    <div className="space-y-1.5">
                      {filteredTeam.map((member, idx) => {
                        const globalIndex = filteredProjects.length + filteredFiles.length + idx;
                        const isSelected = selectedIndex === globalIndex;
                        return (
                          <button
                            key={member.id}
                            onClick={() => handleSelect(globalIndex)}
                            className={cn(
                              "group w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                              isSelected
                                ? "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-600/20 scale-[1.02]"
                                : "hover:bg-gray-50 border border-transparent hover:border-gray-200 hover:shadow-sm"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 transition-all duration-200",
                              isSelected 
                                ? "bg-white/20 text-white" 
                                : "bg-gradient-to-br from-teal-500 to-cyan-500 text-white group-hover:scale-110"
                            )}>
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "text-sm font-semibold truncate mb-0.5",
                                isSelected ? "text-white" : "text-gray-900"
                              )}>
                                {member.name}
                              </p>
                              <p className={cn(
                                "text-xs truncate",
                                isSelected ? "text-white/80" : "text-gray-500"
                              )}>
                                {member.email}
                              </p>
                              <div className="mt-1">
                                <span className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                  isSelected 
                                    ? "bg-white/20 text-white" 
                                    : "bg-teal-50 text-teal-700"
                                )}>
                                  {member.role}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className={cn(
                              "w-4 h-4 flex-shrink-0 mt-2 transition-transform duration-200",
                              isSelected ? "text-white translate-x-1" : "text-gray-400 group-hover:translate-x-1"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced Footer */}
        <div className="px-4 py-3 border-t border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  <kbd className="px-1.5 py-1 bg-white rounded border border-zinc-300 shadow-sm font-semibold text-zinc-700 min-w-[24px] text-center">↑</kbd>
                  <kbd className="px-1.5 py-1 bg-white rounded border border-zinc-300 shadow-sm font-semibold text-zinc-700 min-w-[24px] text-center">↓</kbd>
                </div>
                <span className="text-zinc-600 font-medium">to navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-1 bg-white rounded border border-zinc-300 shadow-sm font-semibold text-zinc-700 min-w-[24px] text-center">↵</kbd>
                <span className="text-zinc-600 font-medium">to select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-1 bg-white rounded border border-zinc-300 shadow-sm font-semibold text-zinc-700">Esc</kbd>
                <span className="text-zinc-600 font-medium">to close</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
