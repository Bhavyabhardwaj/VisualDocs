import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export interface Activity {
  id: string;
  type: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  projectId?: string;
}

export const activityService = {
  async getProjectActivity(projectId: string): Promise<ApiResponse<{ activities: Activity[]; total: number }>> {
    return apiClient.get<ApiResponse<{ activities: Activity[]; total: number }>>(
      `/api/activity/project/${projectId}`
    );
  },

  async getUserActivity(limit = 20): Promise<ApiResponse<{ activities: Activity[]; total: number }>> {
    return apiClient.get<ApiResponse<{ activities: Activity[]; total: number }>>(
      `/api/activity/user?limit=${limit}`
    );
  },

  async getTeamActivity(teamId: string): Promise<ApiResponse<{ activities: Activity[]; total: number }>> {
    return apiClient.get<ApiResponse<{ activities: Activity[]; total: number }>>(
      `/api/activity/team/${teamId}`
    );
  },
};
