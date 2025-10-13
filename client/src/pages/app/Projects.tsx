import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { PageWrapper } from '@/components/app/PageWrapper';
import { EmptyState } from '@/components/app/LoadingStates';
import {
  Plus,
  Github,
  Search,
  Filter,
  Grid3X3,
  List,
  FileText,
  BarChart3,
  Clock,
  Star,
  MoreHorizontal,
  GitBranch
} from 'lucide-react';

// Mock data
const projects = [
  {
    id: '1',
    name: 'VisualDocs Frontend',
    description: 'React TypeScript frontend application with modern UI components',
    language: 'TypeScript',
    qualityScore: 94,
    lastUpdated: '2 hours ago',
    status: 'analyzing' as const,
    repository: 'github.com/user/visualdocs-frontend',
    linesOfCode: 15420,
    collaborators: 3,
    starred: true,
  },
  {
    id: '2',
    name: 'API Gateway Service',
    description: 'Node.js REST API with Express and comprehensive middleware',
    language: 'JavaScript',
    qualityScore: 89,
    lastUpdated: '1 day ago',
    status: 'completed' as const,
    repository: 'github.com/user/api-gateway',
    linesOfCode: 8932,
    collaborators: 5,
    starred: false,
  },
  {
    id: '3',
    name: 'Mobile App',
    description: 'React Native mobile application with cross-platform support',
    language: 'TypeScript',
    qualityScore: 91,
    lastUpdated: '3 days ago',
    status: 'completed' as const,
    repository: 'github.com/user/mobile-app',
    linesOfCode: 12340,
    collaborators: 2,
    starred: true,
  },
  {
    id: '4',
    name: 'Data Analytics Pipeline',
    description: 'Python ETL pipeline for processing large datasets',
    language: 'Python',
    qualityScore: 87,
    lastUpdated: '1 week ago',
    status: 'completed' as const,
    repository: 'github.com/user/data-pipeline',
    linesOfCode: 6789,
    collaborators: 4,
    starred: false,
  },
];

const languageColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Python': '#3572a5',
  'Java': '#b07219',
};

export const Projects: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || project.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const languages = ['all', ...Array.from(new Set(projects.map(p => p.language)))];

  return (
    <PageWrapper
      title="Projects"
      description={`${projects.length} projects in your workspace`}
      actions={
        <>
          <Button variant="outline" icon={<Github className="w-4 h-4" />}>
            Import Repository
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="flex-1 sm:w-80">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="px-3 py-2 border app-border rounded-md bg-white dark:bg-dark-bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? 'All Languages' : lang}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="w-4 h-4" />}
              >
                More Filters
              </Button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="w-8 h-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="w-8 h-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Projects */}
        {filteredProjects.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-12 h-12" />}
            title="No projects found"
            description={searchQuery 
              ? "Try adjusting your search criteria or filters"
              : "Get started by importing a repository or creating a new project"
            }
            action={
              <div className="flex items-center space-x-3">
                <Button variant="outline" icon={<Github className="w-4 h-4" />}>
                  Import Repository
                </Button>
                <Button icon={<Plus className="w-4 h-4" />}>
                  New Project
                </Button>
              </div>
            }
          />
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredProjects.map((project) => (
              viewMode === 'grid' ? (
                <ProjectCard key={project.id} project={project} />
              ) : (
                <ProjectListItem key={project.id} project={project} />
              )
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: any }> = ({ project }) => {
  return (
    <Card variant="elevated" hover className="group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {project.name}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {project.starred && (
              <Star className="w-4 h-4 text-warning-500 fill-current" />
            )}
            <Button variant="ghost" size="sm" className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: languageColors[project.language] }}
            />
            <span className="text-light-text-secondary dark:text-dark-text-secondary">
              {project.language}
            </span>
          </div>
          <div className="text-light-text-secondary dark:text-dark-text-secondary">
            {project.linesOfCode.toLocaleString()} lines
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-medium text-light-text dark:text-dark-text">
              {project.qualityScore}/100
            </span>
            <span className="text-light-text-tertiary dark:text-dark-text-tertiary ml-1">
              quality
            </span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <Clock className="w-3 h-3" />
            <span>{project.lastUpdated}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <Link to={`/app/projects/${project.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            View Project
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Project List Item Component
const ProjectListItem: React.FC<{ project: any }> = ({ project }) => {
  return (
    <Card variant="flat" className="hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-medium text-light-text dark:text-dark-text truncate">
                  {project.name}
                </h3>
                {project.starred && (
                  <Star className="w-4 h-4 text-warning-500 fill-current flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">
                {project.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 ml-4">
            <div className="text-center">
              <p className="text-sm font-medium text-light-text dark:text-dark-text">
                {project.qualityScore}/100
              </p>
              <p className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary">
                Quality
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: languageColors[project.language] }}
              />
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                {project.language}
              </span>
            </div>
            
            <div className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              {project.lastUpdated}
            </div>
            
            <Link to={`/app/projects/${project.id}`}>
              <Button variant="outline" size="sm">
                View Project
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
