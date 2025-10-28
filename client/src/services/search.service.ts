import { apiClient } from '@/lib/api-client';
import type { ApiResponse, Project } from '@/types/api';

export interface SearchResult {
  type: 'project' | 'file' | 'member' | 'documentation';
  id: string;
  title: string;
  description?: string;
  url: string;
  highlight?: string;
  metadata?: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
}

export const searchService = {
  // Global search across all content
  async search(params: {
    query: string;
    type?: 'all' | 'projects' | 'files' | 'members' | 'documentation';
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<SearchResponse>> {
    const query = new URLSearchParams();
    query.append('q', params.query);
    if (params.type && params.type !== 'all') query.append('type', params.type);
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.offset) query.append('offset', params.offset.toString());

    return apiClient.get<ApiResponse<SearchResponse>>(
      `/api/search?${query.toString()}`
    );
  },

  // Search projects
  async searchProjects(query: string, limit = 10): Promise<ApiResponse<Project[]>> {
    return apiClient.get<ApiResponse<Project[]>>(
      `/api/search/projects?q=${encodeURIComponent(query)}&limit=${limit}`
    );
  },

  // Search within a project's files
  async searchInProject(projectId: string, query: string): Promise<ApiResponse<SearchResult[]>> {
    return apiClient.get<ApiResponse<SearchResult[]>>(
      `/api/projects/${projectId}/search?q=${encodeURIComponent(query)}`
    );
  },
};
