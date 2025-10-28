import { apiClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  lastActive: string;
  projectCount: number;
}

export interface TeamActivity {
  id: string;
  type: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
}

export const teamService = {
  async getTeamMembers(teamId: string): Promise<ApiResponse<{ members: TeamMember[]; total: number }>> {
    return apiClient.get<ApiResponse<{ members: TeamMember[]; total: number }>>(
      `/api/teams/${teamId}/members`
    );
  },

  async getTeamActivity(teamId: string): Promise<ApiResponse<{ activities: TeamActivity[]; total: number }>> {
    return apiClient.get<ApiResponse<{ activities: TeamActivity[]; total: number }>>(
      `/api/teams/${teamId}/activity`
    );
  },

  async inviteTeamMember(teamId: string, email: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/api/teams/${teamId}/invite`, { email });
  },

  async removeTeamMember(teamId: string, userId: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/api/teams/${teamId}/members/${userId}`);
  },
};
