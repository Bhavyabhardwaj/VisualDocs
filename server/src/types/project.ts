// project types - matches Prisma schema exactly
export interface Project {
    id: string;
    name: string;
    description: string | null;
    language: 'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'cpp' | 'php' | 'ruby' | 'go';
    framework: string | null;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    visibility: 'PRIVATE' | 'PUBLIC' | 'TEAM';
    settings: any | null; // JsonValue from Prisma
    
    // GitHub integration fields
    githubUrl?: string | null;
    githubRepo?: string | null;
    githubBranch?: string | null;
    importedFromGitHub: boolean;
    githubImportedAt?: Date | null;
    githubStars?: number | null;
    githubForks?: number | null;
    githubLanguage?: string | null;
    
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectSettings {
  autoAnalysis?: boolean;
  diagramStyle?: 'MODERN' | 'MINIMALIST' | 'DETAILED' | 'COLORFUL';
  exportFormats?: string[];
}

export interface CreateProjectRequest {
    name: string;
    description?: string;
    language: string;
    framework?: string;
    visibility?: 'PRIVATE' | 'PUBLIC' | 'TEAM';
}

export interface UpdateProjectRequest {
    name?: string;
    description?: string;
    status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    visibility?: 'PRIVATE' | 'PUBLIC' | 'TEAM';
    settings?: ProjectSettings;
}

// GitHub integration types
export interface GitHubImportRequest {
    githubUrl: string;
    branch?: string; // default: 'main'
    includeTests?: boolean; // default: false
    maxFileSizeMB?: number; // default: 5MB
    fileExtensions?: string[]; // default: common code file extensions
}

export interface GitHubRepository {
    id: number;
    name: string;
    fullName: string; // owner/repo
    description: string | null;
    htmlUrl: string;
    cloneUrl: string;
    defaultBranch: string;
    language: string | null;
    stargazersCount: number;
    forksCount: number;
    size: number;
    private: boolean;
    fork: boolean;
    archived: boolean;
    disabled: boolean;
    pushedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface GitHubFileTree {
    path: string;
    mode: string;
    type: 'blob' | 'tree';
    sha: string;
    size?: number;
    url: string;
}

export interface GitHubImportResult {
    project: Project;
    importedFiles: number;
    skippedFiles: number;
    totalSize: number;
    errors: string[];
}