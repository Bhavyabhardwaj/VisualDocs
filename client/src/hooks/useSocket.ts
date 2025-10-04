import { useEffect, useRef, useCallback } from 'react';
import { socketService } from '../services';

export function useSocket() {
  const socketRef = useRef(socketService);

  useEffect(() => {
    // Connect socket when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      socketRef.current.connect(token);
    }

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Project collaboration
  const joinProject = useCallback((projectId: string) => {
    socketRef.current.joinProject(projectId);
  }, []);

  const leaveProject = useCallback((projectId: string) => {
    socketRef.current.leaveProject(projectId);
  }, []);

  // Comments
  const sendComment = useCallback((projectId: string, comment: string, fileId?: string) => {
    socketRef.current.sendComment(projectId, comment, fileId);
  }, []);

  const onComment = useCallback((callback: (data: any) => void) => {
    socketRef.current.onComment(callback);
  }, []);

  // Cursor sharing
  const sendCursorPosition = useCallback((
    projectId: string,
    fileId: string,
    position: { line: number; column: number }
  ) => {
    socketRef.current.sendCursorPosition(projectId, fileId, position);
  }, []);

  const onCursorMove = useCallback((callback: (data: any) => void) => {
    socketRef.current.onCursorMove(callback);
  }, []);

  // User events
  const onUserJoined = useCallback((callback: (data: any) => void) => {
    socketRef.current.onUserJoined(callback);
  }, []);

  const onUserLeft = useCallback((callback: (data: any) => void) => {
    socketRef.current.onUserLeft(callback);
  }, []);

  const onProjectUsers = useCallback((callback: (data: any) => void) => {
    socketRef.current.onProjectUsers(callback);
  }, []);

  // Analysis events
  const onAnalysisProgress = useCallback((callback: (data: any) => void) => {
    socketRef.current.onAnalysisProgress(callback);
  }, []);

  const onAnalysisComplete = useCallback((callback: (data: any) => void) => {
    socketRef.current.onAnalysisComplete(callback);
  }, []);

  // Diagram events
  const onDiagramProgress = useCallback((callback: (data: any) => void) => {
    socketRef.current.onDiagramProgress(callback);
  }, []);

  const onDiagramComplete = useCallback((callback: (data: any) => void) => {
    socketRef.current.onDiagramComplete(callback);
  }, []);

  // Status
  const updateStatus = useCallback((status: 'online' | 'away' | 'busy' | 'offline') => {
    socketRef.current.updateStatus(status);
  }, []);

  const isConnected = useCallback(() => {
    return socketRef.current.isConnected();
  }, []);

  return {
    joinProject,
    leaveProject,
    sendComment,
    onComment,
    sendCursorPosition,
    onCursorMove,
    onUserJoined,
    onUserLeft,
    onProjectUsers,
    onAnalysisProgress,
    onAnalysisComplete,
    onDiagramProgress,
    onDiagramComplete,
    updateStatus,
    isConnected,
  };
}
