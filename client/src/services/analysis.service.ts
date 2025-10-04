import { apiClient } from '@/lib/api-client';
import type {
  Analysis,
  Recommendation,
  ApiResponse,
  ExportFormat,
} from '@/types/api';

export const analysisService = {
  // Analysis Operations
  async analyzeProject(projectId: string): Promise<ApiResponse<Analysis>> {
    return apiClient.post<ApiResponse<Analysis>>(`/api/analysis/${projectId}`);
  },

  async getProjectAnalysis(projectId: string): Promise<ApiResponse<Analysis>> {
    return apiClient.get<ApiResponse<Analysis>>(`/api/analysis/${projectId}`);
  },

  async getAnalysisById(analysisId: string): Promise<ApiResponse<Analysis>> {
    return apiClient.get<ApiResponse<Analysis>>(`/api/analysis/results/${analysisId}`);
  },

  // Analysis Actions
  async rerunAnalysis(projectId: string): Promise<ApiResponse<Analysis>> {
    return apiClient.post<ApiResponse<Analysis>>(`/api/analysis/${projectId}/rerun`);
  },

  async getAnalysisProgress(projectId: string): Promise<ApiResponse<{ progress: number; status: string }>> {
    return apiClient.get<ApiResponse<{ progress: number; status: string }>>(`/api/analysis/${projectId}/progress`);
  },

  async getRecommendations(projectId: string): Promise<ApiResponse<Recommendation[]>> {
    return apiClient.get<ApiResponse<Recommendation[]>>(`/api/analysis/${projectId}/recommendations`);
  },

  // Export Analysis
  async exportAnalysis(projectId: string, format: ExportFormat['format']): Promise<Blob> {
    const response = await apiClient.get<Blob>(`/api/analysis/${projectId}/export?format=${format}`, {
      responseType: 'blob',
    });
    return response;
  },
};
