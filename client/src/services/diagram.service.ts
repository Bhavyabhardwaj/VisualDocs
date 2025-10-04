import { apiClient } from '@/lib/api-client';
import type {
  Diagram,
  GenerateDiagramInput,
  ApiResponse,
} from '@/types/api';

export const diagramService = {
  // Diagram CRUD
  async generateDiagram(data: GenerateDiagramInput): Promise<ApiResponse<Diagram>> {
    return apiClient.post<ApiResponse<Diagram>>('/api/diagrams', data);
  },

  async getDiagram(id: string): Promise<ApiResponse<Diagram>> {
    return apiClient.get<ApiResponse<Diagram>>(`/api/diagrams/${id}`);
  },

  async deleteDiagram(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/diagrams/${id}`);
  },

  // Diagram Actions
  async getDiagramProgress(id: string): Promise<ApiResponse<{ progress: number; status: string }>> {
    return apiClient.get<ApiResponse<{ progress: number; status: string }>>(`/api/diagrams/${id}/progress`);
  },

  async regenerateDiagram(id: string): Promise<ApiResponse<Diagram>> {
    return apiClient.post<ApiResponse<Diagram>>(`/api/diagrams/${id}/regenerate`);
  },

  // Project Diagrams
  async getProjectDiagrams(projectId: string): Promise<ApiResponse<Diagram[]>> {
    return apiClient.get<ApiResponse<Diagram[]>>(`/api/projects/${projectId}/diagrams`);
  },
};
