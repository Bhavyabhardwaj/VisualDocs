// Dashboard Type Definitionsexport type ProjectStatus = 'analyzing' | 'ready' | 'needs_update' | 'error';



export type ProjectStatus = 'analyzing' | 'ready' | 'needs_update' | 'error';export type RepositoryProvider = 'github' | 'gitlab' | 'upload';



export type RepositoryProvider = 'github' | 'gitlab' | 'upload';export interface User {

  id: string;

export interface User {  name: string;

  id: string;  email: string;

  name: string;  avatar?: string;

  email: string;}

  avatar?: string;

}export interface AIInsight {

  id: string;

export interface AIInsight {  type: 'warning' | 'suggestion' | 'success' | 'info';

  id: string;  title: string;

  type: 'warning' | 'suggestion' | 'success' | 'info';  description: string;

  title: string;  priority: 'high' | 'medium' | 'low';

  description: string;  createdAt: Date;

  priority: 'high' | 'medium' | 'low';  actionable?: boolean;

  createdAt: Date;}

  actionable?: boolean;

}export interface Repository {

  provider: RepositoryProvider;

export interface Repository {  url?: string;

  provider: RepositoryProvider;  branch?: string;

  url?: string;  connected: boolean;

  branch?: string;}

  connected: boolean;

}export interface ProjectMetrics {

  qualityScore: number; // 0-100

export interface ProjectMetrics {  docsGenerated: number;

  qualityScore: number;  progress: number; // 0-100

  docsGenerated: number;  insightsCount: number;

  progress: number;  linesOfCode?: number;

  insightsCount: number;}

  linesOfCode?: number;

}export interface DashboardProject {

  id: string;

export interface DashboardProject {  name: string;

  id: string;  description?: string;

  name: string;  status: ProjectStatus;

  description?: string;  progress: number; // 0-100

  status: ProjectStatus;  qualityScore: number; // 0-100

  progress: number;  docsGenerated: number;

  qualityScore: number;  lastUpdated: Date;

  docsGenerated: number;  repository: Repository;

  lastUpdated: Date;  collaborators: User[];

  repository: Repository;  insights: AIInsight[];

  collaborators: User[];  thumbnail?: string;

  insights: AIInsight[];}

  thumbnail?: string;

}export interface DashboardStats {

  totalProjects: number;

export interface DashboardStats {  docsGenerated: number;

  totalProjects: number;  aiInsights: number;

  docsGenerated: number;  teamCollaborators: number;

  aiInsights: number;}

  teamCollaborators: number;

}export interface ActivityItem {

  id: string;

export interface ActivityItem {  type: 'generated' | 'insight' | 'collaboration' | 'export';

  id: string;  projectName?: string;

  type: 'generated' | 'insight' | 'collaboration' | 'export';  description: string;

  projectName?: string;  message?: string;

  description: string;  timestamp: Date;

  message?: string;  user?: User;

  timestamp: Date;  projectId?: string;

  user?: User;  userId?: string;

  projectId?: string;}

  userId?: string;

}export interface QualityTrend {

  date: string;

export interface QualityTrend {  score: number;

  date: string;  coverage: number;

  score: number;}

  coverage: number;
}
