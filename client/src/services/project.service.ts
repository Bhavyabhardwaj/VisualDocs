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
  UploadFilesResponse,
  UploadedFileSummary,
} from '@/types/api';

interface UploadFilesOptions {
  batchSize?: number;
  onChunkStart?: (info: {
    chunkIndex: number;
    totalChunks: number;
    from: number;
    to: number;
    chunkSize: number;
  }) => void;
  onChunkComplete?: (info: {
    chunkIndex: number;
    totalChunks: number;
    from: number;
    to: number;
    chunkSize: number;
    response: ApiResponse<UploadFilesResponse>;
  }) => void;
}

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
  async uploadFiles(
    id: string,
    files: File[],
    options?: UploadFilesOptions
  ): Promise<ApiResponse<UploadFilesResponse>> {
    if (!files.length) {
      return {
        success: true,
        data: {
          uploadedFiles: [],
          totalCreated: 0,
          totalUploaded: 0,
          totalUpdated: 0,
          totalSkipped: 0,
          totalFailed: 0,
          totalProcessed: 0,
          projectId: id,
          processingTimeMs: 0,
        },
        message: 'No files provided',
      };
    }

    const resolvedBatchSize = Math.max(1, options?.batchSize ?? Number(import.meta.env.VITE_UPLOAD_BATCH_SIZE ?? 250) || 250);
    const totalChunks = Math.ceil(files.length / resolvedBatchSize);

    const aggregatedFiles: UploadedFileSummary[] = [];
    let totalCreated = 0;
    let totalUploaded = 0;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalFailed = 0;
    let totalProcessingTimeMs = 0;
    let totalProcessed = 0;
    let wasTruncated = false;
    let lastMessage: string | undefined;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const from = chunkIndex * resolvedBatchSize;
      const chunk = files.slice(from, from + resolvedBatchSize);
      const to = from + chunk.length;

      options?.onChunkStart?.({
        chunkIndex,
        totalChunks,
        from,
        to,
        chunkSize: chunk.length,
      });

      const formData = new FormData();
      chunk.forEach((file) => {
        const relativeName = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
        formData.append('files', file, relativeName);
      });

      const response = await apiClient.post<ApiResponse<UploadFilesResponse>>(`/api/projects/${id}/files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      lastMessage = response.message;

      const payload = response.data;
      if (payload) {
        aggregatedFiles.push(...(payload.uploadedFiles || []));
        totalCreated += payload.totalCreated || 0;
        totalUploaded += payload.totalUploaded || 0;
        totalUpdated += payload.totalUpdated || 0;
        totalSkipped += payload.totalSkipped || 0;
        totalFailed += payload.totalFailed || 0;
        totalProcessingTimeMs += payload.processingTimeMs || 0;
        totalProcessed += payload.totalProcessed || 0;
        wasTruncated = wasTruncated || Boolean(payload.responseTruncated);
      }

      options?.onChunkComplete?.({
        chunkIndex,
        totalChunks,
        from,
        to,
        chunkSize: chunk.length,
        response,
      });
    }

    return {
      success: true,
      message: lastMessage || 'Files uploaded',
      data: {
        uploadedFiles: aggregatedFiles,
        totalCreated,
        totalUploaded,
        totalUpdated,
        totalSkipped,
        totalFailed,
        totalProcessed: totalProcessed || totalUploaded + totalSkipped,
        projectId: id,
        processingTimeMs: totalProcessingTimeMs,
        responseTruncated: wasTruncated,
      },
    };
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
