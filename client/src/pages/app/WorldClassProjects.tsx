import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderGit2, FileText, Clock, GitBranch, Search, Filter,
  Download, Trash2, Archive, MoreHorizontal, Plus, Github,
  Upload, Grid3x3, List, ChevronDown, Calendar, Users,
  TrendingUp, CheckCircle2, AlertCircle, Loader2, ArrowUpDown
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'updated' | 'quality' | 'files';
type SortOrder = 'asc' | 'desc';

export const WorldClassProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data.items || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const getQualityScore = (project: Project) => {
    return Math.min(95, 60 + (project.fileCount || 0) % 35);
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'quality':
          comparison = getQualityScore(a) - getQualityScore(b);
          break;
        case 'files':
          comparison = (a.fileCount || 0) - (b.fileCount || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleProjectSelection = (id: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProjects(newSelected);
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ready', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      analyzing: { label: 'Analyzing', className: 'bg-blue-50 text-blue-700 border-blue-200' },
      archived: { label: 'Archived', className: 'bg-gray-50 text-gray-700 border-gray-200' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1400px] px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Projects</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and organize your documentation projects
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button size="sm" className="gap-2 bg-gray-900 hover:bg-gray-800 shadow-sm">
                <Github className="h-4 w-4" />
                Import from GitHub
              </Button>
            </div>
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                    Ready
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('analyzing')}>
                    Analyzing
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('archived')}>
                    Archived
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-50">
                    <ArrowUpDown className="h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => toggleSort('updated')}>
                    Last Updated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('name')}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('quality')}>
                    Quality Score
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleSort('files')}>
                    File Count
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode === 'table' ? 'bg-gray-900 hover:bg-gray-800' : 'hover:bg-gray-50'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedProjects.size > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-200 bg-blue-50 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  {selectedProjects.size} selected
                </span>
                <Separator orientation="vertical" className="h-5" />
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100">
                  <Archive className="h-3.5 w-3.5" />
                  Archive
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-100 text-red-600">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedProjects(new Set())}>
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-gray-400 mb-4" />
            <p className="text-sm font-medium text-gray-600">Loading projects...</p>
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <Card className="border-gray-200 border-2 border-dashed bg-gray-50/50">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="rounded-full bg-gradient-to-br from-blue-50 to-purple-50 p-5 mb-5">
                <FolderGit2 className="h-14 w-14 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-sm text-gray-600 mb-8 text-center max-w-md">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters to find what you\'re looking for.'
                  : 'Get started by importing a repository or uploading files.'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <div className="flex items-center gap-3">
                  <Button className="gap-2 bg-gray-900 hover:bg-gray-800">
                    <Github className="h-4 w-4" />
                    Import from GitHub
                  </Button>
                  <Button variant="outline" className="gap-2 hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedProjects.map((project) => {
              const qualityScore = getQualityScore(project);
              const isSelected = selectedProjects.has(project.id);
              return (
                <Card
                  key={project.id}
                  className={`group cursor-pointer border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                    isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex-1"
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2.5 shadow-sm">
                            <FolderGit2 className="h-5 w-5 text-white" />
                          </div>
                          {getStatusBadge(project.status || 'active')}
                        </div>
                        <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleProjectSelection(project.id);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 font-medium">Code Quality</span>
                          <span className="font-bold text-gray-900">{qualityScore}%</span>
                        </div>
                        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${qualityScore}%` }}
                          />
                        </div>
                      </div>

                      {project.githubUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <GitBranch className="h-3.5 w-3.5" />
                          <span className="truncate font-mono">{project.githubUrl.split('/').pop()}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-600 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{project.fileCount || 0} files</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex -space-x-2">
                          {['AB', 'CD', 'EF'].map((initials, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white ring-1 ring-gray-200">
                              <AvatarFallback className="text-[10px] font-medium bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-medium text-gray-600 ring-1 ring-gray-200">
                            +3
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProjects(new Set(filteredAndSortedProjects.map(p => p.id)));
                          } else {
                            setSelectedProjects(new Set());
                          }
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('name')}>
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('quality')}>
                      Quality
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('files')}>
                      Files
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => toggleSort('updated')}>
                      Updated
                    </th>
                    <th className="w-12 px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedProjects.map((project) => {
                    const qualityScore = getQualityScore(project);
                    const isSelected = selectedProjects.has(project.id);
                    return (
                      <tr
                        key={project.id}
                        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''
                        }`}
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProjectSelection(project.id)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2 shadow-sm">
                              <FolderGit2 className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{project.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {project.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(project.status || 'active')}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: `${qualityScore}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{qualityScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{project.fileCount || 0}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex -space-x-2">
                            {['AB', 'CD', 'EF'].slice(0, 3).map((initials, i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-white">
                                <AvatarFallback className="text-[10px] bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                                  {initials}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {filteredAndSortedProjects.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredAndSortedProjects.length} of {projects.length} projects
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
