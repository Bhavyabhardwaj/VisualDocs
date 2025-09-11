// project types
export interface Project {
    id: string;
    name: string;
    description?: string;
    language: 'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'cpp';
    framework?: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
    visibility: 'PRIVATE' | 'PUBLIC' | 'TEAM';
    settings?: ProjectSettings;
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