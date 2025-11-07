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
      const projectsData = response.data.items || [];
      
      // Map the projects to include fileCount from _count.codeFiles and latest analysis
      const mappedProjects = projectsData.map((project: any) => ({
        ...project,
        fileCount: project._count?.codeFiles || 0,
        diagramCount: project._count?.diagrams || 0,
        analysis: project.analyses?.[0] || null, // Get the latest analysis
      }));
      
      console.log('📊 Loaded projects with file counts:', mappedProjects);
      setProjects(mappedProjects);
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

  const getQualityScore = (project: any) => {
    // If project has analysis data, use it for quality score
    if (project.analysis?.averageComplexity !== undefined) {
      const complexity = project.analysis.averageComplexity;
      // Convert complexity to quality score (inverse relationship)
      // Lower complexity = higher quality
      if (complexity <= 5) return 95;
      if (complexity <= 10) return 85;
      if (complexity <= 15) return 75;
      if (complexity <= 20) return 65;
      return 55;
    }
    
    // Fallback calculation based on file count and status
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
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-brand-primary">Projects</h1>
              <p className="text-neutral-600 mt-1 sm:mt-2 text-sm sm:text-[15px]">
                Manage and analyze your codebase projects
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button 
                variant="outline" 
                onClick={() => setGithubDialogOpen(true)} 
                className="h-8 sm:h-9 text-xs sm:text-sm border-neutral-300 flex-1 sm:flex-none"
                data-action="create-project"
              >
                <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Import from GitHub</span>
                <span className="sm:hidden">GitHub Import</span>
              </Button>
              <Button 
                onClick={() => setUploadDialogOpen(true)} 
                className="h-8 sm:h-9 text-xs sm:text-sm bg-brand-primary hover:bg-brand-secondary flex-1 sm:flex-none"
                data-action="upload-files"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                <span className="hidden sm:inline">Upload Files</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:pl-10 h-8 sm:h-9 border-neutral-200 bg-white text-xs sm:text-sm"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
                    <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Filter</span>
                    <Badge variant="secondary" className="ml-0.5 sm:ml-1 text-xs px-1.5 sm:px-2">
                      {filterStatus === 'all' ? 'All' : filterStatus}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 sm:w-48">
                  <DropdownMenuLabel className="text-xs sm:text-sm">Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'all'}
                    onCheckedChange={() => setFilterStatus('all')}
                    className="text-xs sm:text-sm"
                  >
                    All ({statusCounts.all})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'active'}
                    onCheckedChange={() => setFilterStatus('active')}
                    className="text-xs sm:text-sm"
                  >
                    Active ({statusCounts.active})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'analyzing'}
                    onCheckedChange={() => setFilterStatus('analyzing')}
                    className="text-xs sm:text-sm"
                  >
                    Analyzing ({statusCounts.analyzing})
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filterStatus === 'archived'}
                    onCheckedChange={() => setFilterStatus('archived')}
                    className="text-xs sm:text-sm"
                  >
                    Archived ({statusCounts.archived})
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3">
                    <ArrowUpDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 sm:w-48">
                  <DropdownMenuLabel className="text-xs sm:text-sm">Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'name'}
                    onCheckedChange={() => setSortField('name')}
                    className="text-xs sm:text-sm"
                  >
                    Name
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'updatedAt'}
                    onCheckedChange={() => setSortField('updatedAt')}
                    className="text-xs sm:text-sm"
                  >
                    Last Updated
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortField === 'fileCount'}
                    onCheckedChange={() => setSortField('fileCount')}
                    className="text-xs sm:text-sm"
                  >
                    File Count
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'asc'}
                    onCheckedChange={() => setSortOrder('asc')}
                    className="text-xs sm:text-sm"
                  >
                    Ascending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={sortOrder === 'desc'}
                    onCheckedChange={() => setSortOrder('desc')}
                    className="text-xs sm:text-sm"
                  >
                    Descending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="w-8 h-8 sm:w-9 sm:h-9 p-0"
              >
                <Grid3x3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="w-8 h-8 sm:w-9 sm:h-9 p-0"
              >
                <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 md:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12 sm:py-16">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-neutral-400" />
          </div>
        ) : filteredAndSortedProjects.length === 0 ? (
          <Card className="border-2 border-dashed border-neutral-200">
            <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3 sm:mb-4">
                <FolderGit2 className="w-6 h-6 sm:w-8 sm:h-8 text-neutral-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-neutral-900">
                {searchQuery ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-neutral-600 text-center max-w-md mb-4 sm:mb-6 text-xs sm:text-sm px-4">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Get started by uploading your code or importing from GitHub'}
              </p>
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-xs sm:max-w-none">
                  <Button onClick={() => setUploadDialogOpen(true)} className="h-8 sm:h-9 text-xs sm:text-sm">
                    <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Upload Files
                  </Button>
                  <Button variant="outline" onClick={() => setGithubDialogOpen(true)} className="h-8 sm:h-9 text-xs sm:text-sm">
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                    Import from GitHub
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProjects.map((project) => {
              const qualityScore = getQualityScore(project);
              
              // Subtle, professional color variations
              const colorSchemes = [
                { 
                  border: 'border-l-neutral-800',
                  iconBg: 'bg-neutral-800',
                  textAccent: 'text-neutral-800',
                  progressFrom: 'from-neutral-700',
                  progressTo: 'to-neutral-900'
                },
                { 
                  border: 'border-l-neutral-700',
                  iconBg: 'bg-neutral-700',
                  textAccent: 'text-neutral-700',
                  progressFrom: 'from-neutral-600',
                  progressTo: 'to-neutral-800'
                },
                { 
                  border: 'border-l-neutral-600',
                  iconBg: 'bg-neutral-600',
                  textAccent: 'text-neutral-600',
                  progressFrom: 'from-neutral-500',
                  progressTo: 'to-neutral-700'
                },
              ];
              const colorIndex = project.name.length % colorSchemes.length;
              const colors = colorSchemes[colorIndex];
              
              return (
                <Card
                  key={project.id}
                  className={`group relative hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer border border-neutral-200 bg-white overflow-hidden ${colors.border} border-l-4`}
                  onClick={() => navigate(`/app/projects/${project.id}`)}
                >
                  <CardContent className="p-6">
                    {/* Header with Icon */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-lg ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <FolderGit2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-neutral-900 truncate mb-1.5">
                          {project.name}
                        </h3>
                        <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-neutral-100"
                          >
                            <MoreHorizontal className="w-4 h-4 text-neutral-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/app/projects/${project.id}`);
                            }}
                          >
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

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 mb-5 pb-5 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-500">
                          <span className={`font-semibold ${colors.textAccent}`}>{project.fileCount || 0}</span> files
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs text-neutral-500 truncate">
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Quality Score - Clean and Minimal */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-600">Code Quality</span>
                        <span className={`text-2xl font-bold ${colors.textAccent}`}>
                          {qualityScore}%
                        </span>
                      </div>
                      <Progress value={qualityScore} className="h-2" />
                      <p className="text-xs text-neutral-500">
                        {qualityScore >= 80 ? '✨ Excellent quality' : qualityScore >= 60 ? '👍 Good quality' : '⚠️ Needs improvement'}
                      </p>
                    </div>

                    {/* Footer with Status */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <Badge
                        variant={
                          project.status === 'active'
                            ? 'default'
                            : project.status === 'analyzing'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={cn(
                          'font-medium',
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
                            <div className="w-8 h-8 rounded bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0">
                              <FolderGit2 className="w-4 h-4 text-white" />
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
