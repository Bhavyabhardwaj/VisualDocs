export type ProjectStatus = 'analyzing' | 'ready' | 'needs_update' | 'error';

export type RepositoryProvider = 'github' | 'gitlab' | 'upload';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'success' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
  actionable?: boolean;
}

export interface Repository {
  provider: RepositoryProvider;
  url?: string;
  branch?: string;
  connected: boolean;
}

export interface ProjectMetrics {
  qualityScore: number; // 0-100
  docsGenerated: number;
  progress: number; // 0-100
  insightsCount: number;
  linesOfCode?: number;
}

export interface DashboardProject {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  progress: number; // 0-100
  qualityScore: number; // 0-100
  docsGenerated: number;
  lastUpdated: Date;
  repository: Repository;
  collaborators: User[];
  insights: AIInsight[];
  thumbnail?: string;
}

export interface DashboardStats {
  totalProjects: number;
  docsGenerated: number;
  aiInsights: number;
  teamCollaborators: number;
}

export interface ActivityItem {
  id: string;
  type: 'generated' | 'insight' | 'collaboration' | 'export';
  projectName?: string;
  description: string;
  message?: string;
  timestamp: Date;
  user?: User;
  projectId?: string;
  userId?: string;
}

export interface QualityTrend {
  date: string;
  score: number;
  coverage: number;
}
