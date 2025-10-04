import { apiClient } from '@/lib/api-client';
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectStatistics,
  ProjectFilters,
  PaginatedResponse,
  ApiResponse,
  ProjectFile,
  Collaborator,
  GitHubImportInput,
  GitHubRepoInfo,
} from '@/types/api';

export const projectService = {
  // CRUD Operations
  async getProjects(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isArchived !== undefined) params.append('isArchived', filters.isArchived.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    return apiClient.get<PaginatedResponse<Project>>(`/api/projects?${params.toString()}`);
  },

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return apiClient.get<ApiResponse<Project>>(`/api/projects/${id}`);
  },

  async createProject(data: CreateProjectInput): Promise<ApiResponse<Project>> {
    return apiClient.post<ApiResponse<Project>>('/api/projects', data);
  },

  async updateProject(id: string, data: UpdateProjectInput): Promise<ApiResponse<Project>> {
    return apiClient.put<ApiResponse<Project>>(`/api/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/projects/${id}`);
  },

  // Project Actions
  async toggleArchive(id: string): Promise<ApiResponse<Project>> {
    return apiClient.patch<ApiResponse<Project>>(`/api/projects/${id}/archive`);
  },

  async getProjectStats(id: string): Promise<ApiResponse<ProjectStatistics>> {
    return apiClient.get<ApiResponse<ProjectStatistics>>(`/api/projects/${id}/stats`);
  },

  // File Management
  async uploadFiles(id: string, files: File[]): Promise<ApiResponse<ProjectFile[]>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiClient.post<ApiResponse<ProjectFile[]>>(`/api/projects/${id}/files`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async getProjectFiles(id: string): Promise<ApiResponse<ProjectFile[]>> {
    return apiClient.get<ApiResponse<ProjectFile[]>>(`/api/projects/${id}/files`);
  },

  // Collaboration
  async getCollaborators(id: string): Promise<ApiResponse<Collaborator[]>> {
    return apiClient.get<ApiResponse<Collaborator[]>>(`/api/projects/${id}/collaborators`);
  },

  // GitHub Integration
  async importFromGitHub(data: GitHubImportInput): Promise<ApiResponse<Project>> {
    return apiClient.post<ApiResponse<Project>>('/api/projects/import/github', data);
  },

  async validateGitHubRepo(githubUrl: string): Promise<ApiResponse<{ isValid: boolean; message?: string }>> {
    return apiClient.post<ApiResponse<{ isValid: boolean; message?: string }>>('/api/projects/validate/github', {
      githubUrl,
    });
  },

  async getGitHubRepoInfo(githubUrl: string): Promise<ApiResponse<GitHubRepoInfo>> {
    return apiClient.get<ApiResponse<GitHubRepoInfo>>(`/api/projects/github/info?url=${encodeURIComponent(githubUrl)}`);
  },
};
