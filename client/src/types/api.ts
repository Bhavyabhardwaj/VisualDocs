// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalProjects: number;
  totalAnalyses: number;
  totalDiagrams: number;
  storageUsed: number;
  storageLimit: number;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description?: string;
  githubUrl?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  fileCount?: number;
  lastAnalyzedAt?: string;
  status?: 'active' | 'analyzing' | 'archived';
}

export interface ProjectStatistics {
  totalFiles: number;
  totalLines: number;
  languages: Record<string, number>;
  complexity: number;
  lastAnalyzed: string;
  filesAnalyzed: number;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  githubUrl?: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
}

// Analysis Types
export interface Analysis {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: AnalysisResults;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AnalysisResults {
  summary: string;
  codeQuality: {
    score: number;
    issues: CodeIssue[];
  };
  architecture: {
    overview: string;
    patterns: string[];
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
  };
  metrics: {
    linesOfCode: number;
    files: number;
    complexity: number;
  };
}

export interface CodeIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  line: number;
  message: string;
  category: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  impact: string;
}

// Diagram Types
export interface Diagram {
  id: string;
  projectId: string;
  type: 'flowchart' | 'sequence' | 'class' | 'architecture' | 'erd';
  title: string;
  content: string;
  format: 'mermaid' | 'plantuml' | 'svg';
  status: 'generating' | 'completed' | 'failed';
  progress?: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateDiagramInput {
  projectId: string;
  type: 'flowchart' | 'sequence' | 'class' | 'architecture' | 'erd';
  title?: string;
  options?: {
    includeComments?: boolean;
    maxDepth?: number;
    theme?: string;
  };
}

// GitHub Types
export interface GitHubRepo {
  owner: string;
  repo: string;
  branch?: string;
  path?: string;
}

export interface GitHubRepoInfo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  defaultBranch: string;
  size: number;
  updatedAt: string;
}

export interface GitHubImportInput {
  githubUrl: string;
  projectName?: string;
  branch?: string;
}

// File Types
export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  path: string;
  size: number;
  type: string;
  content?: string;
  language?: string;
  uploadedAt: string;
}

// Collaborator Types
export interface Collaborator {
  id: string;
  userId: string;
  projectId: string;
  role: 'owner' | 'editor' | 'viewer';
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  addedAt: string;
}

// Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  name?: string;
  avatar?: string;
}

// Query/Filter Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ProjectFilters extends PaginationParams {
  search?: string;
  isArchived?: boolean;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ExportFormat {
  format: 'json' | 'pdf' | 'markdown';
}
