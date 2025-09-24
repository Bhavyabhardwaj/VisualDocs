import type { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
    user?:{
        userId: string;
        email: string;
        name: string;
    }
}

export interface UserPresence {
    userId: string;
    userName: string;
    email: string;
    socketId: string;
    projectId?: string;
    lastSeen: Date;
    status: 'online' | 'analyzing' | 'viewing' | 'editing' | 'offline';
}

export interface ProjectRoom {
    projectId: string;
    users: Set<string>; // Set of userIds
}

export interface LiveComment {
    id: string;
    projectId: string;
    userId: string;
    userName: string;
    content: string;
    position?: {
        line?: number;
        file?: string;
        x?: number;
        y?: number;
    };
    timestamp: string;
}

export interface CursorPosition {
    userId: string;
    userName: string;
    file?: string;
    x: number;
    y: number;
    timestamp: string;
}

export interface UserStatusUpdate {
    userId: string;
    status: 'online' | 'analyzing' | 'viewing' | 'editing' | 'offline';
    timestamp: string;
    projectId?: string;
}

export interface SocketStatus {
    connectedUsers: number;
    activeProjects: number;
    totalRooms: number;
}

// socket event payload
export interface JoinProjectPayload {
    projectId: string;
}

export interface LeaveProjectPayload {
    projectId: string;
}

export interface StatusUpdatePayload {
    status: string;
    projectId?: string;
}

export interface ProjectCommentPayload {
    projectId: string;
    content: string;
    position?: {
        line?: number;
        file?: string;
        x?: number;
        y?: number;
    };
}

export interface CursorMovePayload {
    projectId: string;
    cursor: {
        x: number;
        y: number;
        file?: string;
    };
}

// socket response types
export interface ConnectionResponse {
    message: string;
    socketId: string;
    timestamp: string;
}

export interface ProjectUsersResponse {
    projectId: string;
    timestamp: string;
    users: UserPresence[];
}

export interface UserJoinedProjectResponse {
  userId: string;
  userName: string;
  projectId: string;
  timestamp: string;
}

export interface UserLeftProjectResponse {
  userId: string;
  userName: string;
  projectId: string;
  timestamp: string;
}