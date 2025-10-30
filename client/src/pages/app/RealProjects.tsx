import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  FolderGit2, Clock, Search, Filter,
  Download, Trash2, MoreHorizontal, Github,
  Upload, Grid3x3, List,
  Loader2, ArrowUpDown, Eye, FileCode
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { FileUploadDialog } from '@/components/app/FileUploadDialog';
import { GitHubImportDialog } from '@/components/app/GitHubImportDialog';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { projectService } from '@/services/project.service';
import type { Project } from '@/types/api';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'table';
type SortField = 'name' | 'updatedAt' | 'fileCount';
type SortOrder = 'asc' | 'desc';

export const RealProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects({ limit: 100 });
      setProjects(response.data.items || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadProjects();
    setUploadDialogOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectService.deleteProject(id);
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const getQualityScore = (project: Project) => {
    const baseScore = 70;
    const fileBonus = Math.min((project.fileCount || 0) * 2, 20);
    const analysisBonus = project.status === 'active' ? 10 : 0;
    return Math.min(baseScore + fileBonus + analysisBonus, 100);
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
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortField === 'fileCount') {
        comparison = (a.fileCount || 0) - (b.fileCount || 0);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const statusCounts = {
    all: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    analyzing: projects.filter(p => p.status === 'analyzing').length,
    archived: projects.filter(p => p.status === 'archived').length,
  };

  return (
    <PremiumLayout>
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-brand-primary">Projects</h1>
              <p className="text-neutral-600 mt-2 text-[15px]">
                Manage and analyze your codebase projects
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-9 text-sm border-neutral-300">
                <Github className="w-4 h-4 mr-2" />
                Import from GitHub
              </Button>
              <Button onClick={() => setUploadDialogOpen(true)} className="h-9 text-sm bg-brand-primary hover:bg-brand-secondary">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 border-neutral-200 bg-white"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 h-9 text-sm">
                    <Filter className="w-4 h-4" />
                    Filter
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {filterStatus === 'all' ? 'All' : filterStatus}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'all'}
                    onCheckedChange={() => setFilterStatus('all')}
                  >
                    All ({statusCounts.all})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'active'}
                    onCheckedChange={() => setFilterStatus('active')}
                  >
                    Active ({statusCounts.active})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'analyzing'}
                    onCheckedChange={() => setFilterStatus('analyzing')}
                  >
                    Analyzing ({statusCounts.analyzing})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'archived'}
                    onCheckedChange={() => setFilterStatus('archived')}
                  >
                    Archived ({statusCounts.archived})
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'name'}
                    onCheckedChange={() => setSortField('name')}
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'updatedAt'}
                    onCheckedChange={() => setSortField('updatedAt')}
                  >
                    Last Updated
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'fileCount'}
                    onCheckedChange={() => setSortField('fileCount')}
                  >
                    File Count
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'asc'}
                    onCheckedChange={() => setSortOrder('asc')}
                  >
                    Ascending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'desc'}
                    onCheckedChange={() => setSortOrder('desc')}
                  >
                    Descending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="w-9 h-9 p-0"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="w-9 h-9 p-0"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <Card className="border-2 border-dashed border-neutral-200">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <FolderGit2 className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-neutral-900">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-neutral-600 text-center max-w-md mb-6 text-sm">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Get started by uploading your code or importing from GitHub'}
              </p>
              {!searchQuery && (
                <div className="flex gap-3">
                  <Button onClick={() => setUploadDialogOpen(true)} className="h-9">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-9">
                    <Github className="w-4 h-4 mr-2" />
                    Import from GitHub
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAndSortedProjects.map((project) => {
              const qualityScore = getQualityScore(project);
              
              return (
                <Card
                  key={project.id}
                  className="group hover:shadow-md transition-all duration-200 cursor-pointer border border-neutral-200 bg-white"
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FolderGit2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg truncate group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-neutral-600 line-clamp-2 mt-1">
                            {project.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 -mr-2"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/projects/${project.id}`);
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1.5">
                          <FileCode className="w-4 h-4" />
                          <span className="font-medium">{project.fileCount || 0}</span>
                          <span className="text-neutral-500">files</span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600">Quality Score</span>
                          <span className="font-medium">{qualityScore}%</span>
                        </div>
                        <Progress value={qualityScore} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Badge
                          variant={
                            project.status === 'active'
                              ? 'default'
                              : project.status === 'analyzing'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={cn(
                            'text-xs',
                            project.status === 'analyzing' && 'animate-pulse'
                          )}
                        >
                          {project.status === 'active'
                            ? 'Ready'
                            : project.status === 'analyzing'
                            ? 'Analyzing'
                            : project.status || 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left text-sm text-neutral-600">
                    <th className="p-4 font-medium">Project</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Files</th>
                    <th className="p-4 font-medium">Quality</th>
                    <th className="p-4 font-medium">Updated</th>
                    <th className="p-4 font-medium w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProjects.map((project) => {
                    const qualityScore = getQualityScore(project);
                    
                    return (
                      <tr
                        key={project.id}
                        className="border-b last:border-0 hover:bg-neutral-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/app/projects/${project.id}`)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <FolderGit2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{project.name}</div>
                              <div className="text-sm text-neutral-600 truncate max-w-md">
                                {project.description || 'No description'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={
                              project.status === 'active'
                                ? 'default'
                                : project.status === 'analyzing'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={cn(
                              project.status === 'analyzing' && 'animate-pulse'
                            )}
                          >
                            {project.status === 'active'
                              ? 'Ready'
                              : project.status === 'analyzing'
                              ? 'Analyzing'
                              : project.status || 'Pending'}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm">{project.fileCount || 0}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Progress value={qualityScore} className="h-2 w-20" />
                            <span className="text-sm font-medium">{qualityScore}%</span>
                          </div>
                        </td>
                        <td className="p-4"></td>
                        <td className="p-4 text-sm text-neutral-600">
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/app/projects/${project.id}`);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(project.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
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
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadSuccess}
      />
      <GitHubImportDialog
        open={githubDialogOpen}
        onOpenChange={setGithubDialogOpen}
        onImportComplete={handleUploadSuccess}
      />
    </PremiumLayout>
  );
};
