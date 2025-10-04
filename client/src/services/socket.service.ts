import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';

    this.socket = io(apiUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupEventListeners();
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('connected', (data: any) => {
      console.log('🎉 User connected:', data);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  // Project collaboration
  joinProject(projectId: string) {
    if (!this.socket) return;
    this.socket.emit('join-project', { projectId });
    console.log('📂 Joined project:', projectId);
  }

  leaveProject(projectId: string) {
    if (!this.socket) return;
    this.socket.emit('leave-project', { projectId });
    console.log('📂 Left project:', projectId);
  }

  // User presence
  updateStatus(status: 'online' | 'away' | 'busy' | 'offline') {
    if (!this.socket) return;
    this.socket.emit('status-update', { status });
    console.log('👤 Status updated:', status);
  }

  // Comments
  sendComment(projectId: string, comment: string, fileId?: string) {
    if (!this.socket) return;
    this.socket.emit('project-comment', { projectId, comment, fileId });
    console.log('💬 Comment sent:', comment);
  }

  onComment(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('new-comment', callback);
  }

  // Cursor sharing
  sendCursorPosition(projectId: string, fileId: string, position: { line: number; column: number }) {
    if (!this.socket) return;
    this.socket.emit('cursor-move', { projectId, fileId, position });
  }

  onCursorMove(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('cursor-position', callback);
  }

  // User joined/left events
  onUserJoined(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('user-joined-project', callback);
  }

  onUserLeft(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('user-left-project', callback);
  }

  // Project users
  onProjectUsers(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('project-users', callback);
  }

  // Analysis progress
  onAnalysisProgress(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('analysis-progress', callback);
  }

  onAnalysisComplete(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('analysis-complete', callback);
  }

  // Diagram progress
  onDiagramProgress(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('diagram-progress', callback);
  }

  onDiagramComplete(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('diagram-complete', callback);
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Socket disconnected');
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;
