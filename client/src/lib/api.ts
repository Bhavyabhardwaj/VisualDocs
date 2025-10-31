/**
 * API Client for VisualDocs Backend
 * Centralized API communication layer with TypeScript support
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3004';

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  githubConnected?: boolean;
  googleConnected?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language?: string;
  repository?: string;
  userId: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  fileCount?: number;
  analysisCount?: number;
  diagramCount?: number;
}

export interface Analysis {
  id: string;
  projectId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results?: any;
  error?: string;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Diagram {
  id: string;
  projectId: string;
  type: string;
  title: string;
  imageUrl: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  filename: string;
  path: string;
  size: number;
  language?: string;
  createdAt: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to handle API requests
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Helper for multipart/form-data requests
async function apiUpload<T = any>(
  endpoint: string,
  formData: FormData
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Upload failed');
    }

    return data;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  // Register new user
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Login user
  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get user profile
  getProfile: () =>
    apiRequest<User>('/api/auth/profile'),

  // Update user profile
  updateProfile: (data: Partial<User>) =>
    apiRequest<User>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get user stats
  getStats: () =>
    apiRequest('/api/auth/stats'),

  // Logout user
  logout: () =>
    apiRequest('/api/auth/logout', {
      method: 'POST',
    }),

  // Refresh token
  refreshToken: () =>
    apiRequest<{ token: string }>('/api/auth/refresh', {
      method: 'POST',
    }),

  // Deactivate account
  deactivateAccount: () =>
    apiRequest('/api/auth/account', {
      method: 'DELETE',
    }),

  // Link OAuth account
  linkOAuthAccount: (data: { provider: string; code: string }) =>
    apiRequest('/api/auth/oauth/link', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Unlink OAuth account
  unlinkOAuthAccount: (data: { provider: string }) =>
    apiRequest('/api/auth/oauth/unlink', {
      method: 'DELETE',
      body: JSON.stringify(data),
    }),
};

// ============================================
// PROJECTS API
// ============================================

export const projectsApi = {
  // Create new project
  create: (data: { name: string; description?: string; language?: string }) =>
    apiRequest<Project>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get all projects (with pagination)
  getAll: (params?: PaginationParams) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest<{ projects: Project[]; total: number; page: number; limit: number }>(`/api/projects${queryString}`);
  },

  // Get single project
  getById: (id: string) =>
    apiRequest<Project>(`/api/projects/${id}`),

  // Update project
  update: (id: string, data: Partial<Project>) =>
    apiRequest<Project>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Delete project
  delete: (id: string) =>
    apiRequest(`/api/projects/${id}`, {
      method: 'DELETE',
    }),

  // Toggle archive status
  toggleArchive: (id: string) =>
    apiRequest<Project>(`/api/projects/${id}/archive`, {
      method: 'PATCH',
    }),

  // Get project statistics
  getStats: (id: string) =>
    apiRequest(`/api/projects/${id}/stats`),

  // Upload files to project
  uploadFiles: (id: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    return apiUpload<{ files: ProjectFile[] }>(`/api/projects/${id}/files`, formData);
  },

  // Get project files
  getFiles: (id: string) =>
    apiRequest<{ files: ProjectFile[] }>(`/api/projects/${id}/files`),

  // Get project collaborators
  getCollaborators: (id: string) =>
    apiRequest(`/api/projects/${id}/collaborators`),

  // Import from GitHub
  importFromGitHub: (data: { repoUrl: string; name?: string; description?: string }) =>
    apiRequest<Project>('/api/projects/import/github', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Validate GitHub repository
  validateGitHub: (data: { repoUrl: string }) =>
    apiRequest('/api/projects/validate/github', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get GitHub repository info
  getGitHubInfo: (repoUrl: string) =>
    apiRequest(`/api/projects/github/info?repoUrl=${encodeURIComponent(repoUrl)}`),
};

// ============================================
// ANALYSIS API
// ============================================

export const analysisApi = {
  // Analyze project
  analyze: (projectId: string, options?: any) =>
    apiRequest<Analysis>(`/api/analysis/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    }),

  // Get project analysis
  getByProject: (projectId: string) =>
    apiRequest<Analysis[]>(`/api/analysis/${projectId}`),

  // Get analysis by ID
  getById: (analysisId: string) =>
    apiRequest<Analysis>(`/api/analysis/results/${analysisId}`),

  // Rerun analysis
  rerun: (projectId: string) =>
    apiRequest<Analysis>(`/api/analysis/${projectId}/rerun`, {
      method: 'POST',
    }),

  // Get analysis progress
  getProgress: (projectId: string) =>
    apiRequest<{ progress: number; status: string }>(`/api/analysis/${projectId}/progress`),

  // Get recommendations
  getRecommendations: (projectId: string) =>
    apiRequest(`/api/analysis/${projectId}/recommendations`),

  // Export analysis
  export: (projectId: string, format: 'json' | 'pdf' | 'markdown' = 'json') =>
    apiRequest(`/api/analysis/${projectId}/export?format=${format}`),
};

// ============================================
// DIAGRAMS API
// ============================================

export const diagramsApi = {
  // Generate diagram
  generate: (data: {
    projectId: string;
    type: string;
    title: string;
    options?: any;
  }) =>
    apiRequest<Diagram>('/api/diagrams', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Get diagram by ID
  getById: (id: string) =>
    apiRequest<Diagram>(`/api/diagrams/${id}`),

  // Delete diagram
  delete: (id: string) =>
    apiRequest(`/api/diagrams/${id}`, {
      method: 'DELETE',
    }),

  // Get diagram progress
  getProgress: (id: string) =>
    apiRequest<{ progress: number; status: string }>(`/api/diagrams/${id}/progress`),

  // Regenerate diagram
  regenerate: (id: string, options?: any) =>
    apiRequest<Diagram>(`/api/diagrams/${id}/regenerate`, {
      method: 'POST',
      body: JSON.stringify(options || {}),
    }),

  // Get all diagrams for a project
  getByProject: (projectId: string) =>
    apiRequest<{ diagrams: Diagram[] }>(`/api/projects/${projectId}/diagrams`),
};

// ============================================
// OAUTH API
// ============================================

export const oauthApi = {
  // Get GitHub OAuth URL
  getGitHubUrl: () => `${API_BASE_URL}/api/oauth/github`,

  // Get Google OAuth URL
  getGoogleUrl: () => `${API_BASE_URL}/api/oauth/google`,

  // Get OAuth status
  getStatus: () =>
    apiRequest('/api/oauth/status'),
};

// ============================================
// PUBLIC API
// ============================================

export const publicApi = {
  // Health check
  health: () =>
    apiRequest('/api/public/health'),

  // Status
  status: () =>
    apiRequest('/api/public/status'),

  // API docs
  docs: () =>
    apiRequest('/api/public/docs'),
};

// ============================================
// ACTIVITY API
// ============================================

export interface Activity {
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
  metadata?: any;
}

export const activityApi = {
  // Get project activity
  getProjectActivity: (projectId: string) =>
    apiRequest<Activity[]>(`/api/activity/project/${projectId}`),

  // Get user activity (notifications)
  getUserActivity: () =>
    apiRequest<Activity[]>('/api/activity/user'),

  // Get team activity
  getTeamActivity: (teamId: string) =>
    apiRequest<Activity[]>(`/api/activity/team/${teamId}`),
};

// ============================================
// TEAM API
// ============================================

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  joinedAt: string;
}

export const teamApi = {
  // Get team members
  getTeamMembers: (teamId: string) =>
    apiRequest<{ members: TeamMember[] }>(`/api/teams/${teamId}/members`),

  // Invite team member
  inviteTeamMember: (teamId: string, data: { email: string; role: string }) =>
    apiRequest(`/api/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Remove team member
  removeTeamMember: (teamId: string, userId: string) =>
    apiRequest(`/api/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    }),

  // Get team activity
  getTeamActivity: (teamId: string) =>
    apiRequest<Activity[]>(`/api/teams/${teamId}/activity`),
};

// ============================================
// SEARCH API
// ============================================

export interface SearchResult {
  id: string;
  type: 'project' | 'file' | 'user' | 'team';
  title: string;
  description?: string;
  icon?: string;
  url?: string;
  metadata?: any;
}

export const searchApi = {
  // Global search
  search: (query: string, filters?: { type?: string; limit?: number }) => {
    const params = new URLSearchParams({ q: query });
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    return apiRequest<{ results: SearchResult[] }>(`/api/search?${params.toString()}`);
  },

  // Search projects
  searchProjects: (query: string) =>
    apiRequest<{ projects: Project[] }>(`/api/search/projects?q=${encodeURIComponent(query)}`),

  // Search files
  searchFiles: (projectId: string, query: string) =>
    apiRequest<{ files: ProjectFile[] }>(`/api/search/files?projectId=${projectId}&q=${encodeURIComponent(query)}`),
};

// Export a default API client object
export default {
  auth: authApi,
  projects: projectsApi,
  analysis: analysisApi,
  diagrams: diagramsApi,
  oauth: oauthApi,
  public: publicApi,
  activity: activityApi,
  team: teamApi,
  search: searchApi,
};
