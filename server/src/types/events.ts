export interface AnalysisProgressEvent {
  projectId: string;
  userId: string;
  status: 'STARTING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  currentFile?: string;
  totalFiles?: number;
  completedFiles?: number;
  error?: string;
}

export interface DiagramGenerationEvent {
  diagramId: string;
  projectId: string;
  userId: string;
  status: 'STARTING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  progress: number; // 0-100
  stage?: 'PROMPT_GENERATION' | 'AI_PROCESSING' | 'IMAGE_PROCESSING' | 'STORAGE';
  error?: string;
}

export interface ProjectUpdateEvent {
  projectId: string;
  userId: string;
  type: 'FILE_UPLOADED' | 'PROJECT_UPDATED' | 'ANALYSIS_COMPLETED' | 'DIAGRAM_GENERATED';
  data: any;
}

export interface SystemNotificationEvent {
  id: string;
  userId: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  title: string;
  message: string;
  metadata?: any;
  createdAt: Date;
}

export interface CollaborationEvent {
  sessionId: string;
  projectId: string;
  userId: string;
  type: 'USER_JOINED' | 'USER_LEFT' | 'CURSOR_MOVE' | 'FILE_EDIT' | 'COMMENT_ADDED';
  data: any;
}

// Event subscription types
export interface EventSubscription {
  id: string;
  userId: string;
  eventType: string;
  filters?: Record<string, any>;
  createdAt: Date;
}

// Socket connection types
export interface SocketUserData {
  userId: string;
  projectId?: string;
  sessionId?: string;
  connectedAt: Date;
}
