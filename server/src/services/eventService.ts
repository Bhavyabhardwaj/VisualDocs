import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import type { AnalysisProgressEvent, DiagramGenerationEvent, ProjectUpdateEvent, SystemNotificationEvent } from '../types';

// Simple callback type
type EventCallback<T> = (event: T) => void;

class EnhancedEventService extends EventEmitter {
  private callbacks = {
    analysis: new Map<string, EventCallback<AnalysisProgressEvent>[]>(),
    diagram: new Map<string, EventCallback<DiagramGenerationEvent>[]>(),
    project: new Map<string, EventCallback<ProjectUpdateEvent>[]>(),
  };

  constructor() {
    super();
    this.setMaxListeners(100); // Handle multiple Socket.IO connections
    
    // Always handle errors to prevent crashes
    this.on('error', (error) => {
      logger.error('EventService error:', error);
    });
  }

  /**
   * Emit analysis progress (for Socket.IO + local callbacks)
   */
  emitAnalysisProgress(event: AnalysisProgressEvent): void {
    try {
      // Beautiful logging
      logger.info('📊 Analysis Progress Update', {
        projectId: event.projectId,
        status: event.status,
        progress: `${event.progress}%`,
        currentFile: event.currentFile,
        completedFiles: event.completedFiles,
        totalFiles: event.totalFiles,
      });

      // Call local callbacks (existing functionality)
      const projectCallbacks = this.callbacks.analysis.get(event.projectId) || [];
      projectCallbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          logger.error('Analysis callback failed', { error });
        }
      });

      // Emit for Socket.IO integration (new functionality)
      this.emit('analysis:progress', event);

    } catch (error) {
      logger.error('Failed to emit analysis progress', { 
        event, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      this.emit('error', error);
    }
  }

  /**
   * Emit diagram generation progress
   */
  emitDiagramProgress(event: DiagramGenerationEvent): void {
    try {
      logger.info('🎨 Diagram Generation Progress', {
        diagramId: event.diagramId,
        projectId: event.projectId,
        status: event.status,
        progress: `${event.progress}%`,
        stage: event.stage,
      });

      // Local callbacks
      const diagramCallbacks = this.callbacks.diagram.get(event.diagramId) || [];
      diagramCallbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          logger.error('Diagram callback failed', { error });
        }
      });

      // Socket.IO integration
      this.emit('diagram:progress', event);

    } catch (error) {
      logger.error('Failed to emit diagram progress', { 
        event, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      this.emit('error', error);
    }
  }

  /**
   * Emit project update
   */
  emitProjectUpdate(event: ProjectUpdateEvent): void {
    try {
      logger.info('📁 Project Update', {
        projectId: event.projectId,
        type: event.type,
        userId: event.userId,
      });

      // Local callbacks
      const projectCallbacks = this.callbacks.project.get(event.projectId) || [];
      projectCallbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          logger.error('Project callback failed', { error });
        }
      });

      // Socket.IO integration
      this.emit('project:update', event);

    } catch (error) {
      logger.error('Failed to emit project update', { 
        event, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      this.emit('error', error);
    }
  }

  /**
   * System notifications (optional)
   */
  emitSystemNotification(event: SystemNotificationEvent): void {
    try {
      logger.info('🔔 System Notification', {
        userId: event.userId,
        type: event.type,
        message: event.message,
      });

      this.emit('notification:system', event);

    } catch (error) {
      logger.error('Failed to emit system notification', { event, error });
      this.emit('error', error);
    }
  }

  /**
   * Subscribe to analysis progress for specific project
   */
  onAnalysisProgress(
    projectId: string,
    callback: EventCallback<AnalysisProgressEvent>
  ): () => void {
    const callbacks = this.callbacks.analysis.get(projectId) || [];
    callbacks.push(callback);
    this.callbacks.analysis.set(projectId, callbacks);

    // Return cleanup function
    return () => {
      const updatedCallbacks = this.callbacks.analysis.get(projectId) || [];
      const index = updatedCallbacks.indexOf(callback);
      if (index > -1) {
        updatedCallbacks.splice(index, 1);
        this.callbacks.analysis.set(projectId, updatedCallbacks);
      }
    };
  }

  /**
   * Subscribe to diagram progress for specific diagram
   */
  onDiagramProgress(
    diagramId: string,
    callback: EventCallback<DiagramGenerationEvent>
  ): () => void {
    const callbacks = this.callbacks.diagram.get(diagramId) || [];
    callbacks.push(callback);
    this.callbacks.diagram.set(diagramId, callbacks);

    return () => {
      const updatedCallbacks = this.callbacks.diagram.get(diagramId) || [];
      const index = updatedCallbacks.indexOf(callback);
      if (index > -1) {
        updatedCallbacks.splice(index, 1);
        this.callbacks.diagram.set(diagramId, updatedCallbacks);
      }
    };
  }

  /**
   * Subscribe to project updates
   */
  onProjectUpdate(
    projectId: string,
    callback: EventCallback<ProjectUpdateEvent>
  ): () => void {
    const callbacks = this.callbacks.project.get(projectId) || [];
    callbacks.push(callback);
    this.callbacks.project.set(projectId, callbacks);

    return () => {
      const updatedCallbacks = this.callbacks.project.get(projectId) || [];
      const index = updatedCallbacks.indexOf(callback);
      if (index > -1) {
        updatedCallbacks.splice(index, 1);
        this.callbacks.project.set(projectId, updatedCallbacks);
      }
    };
  }

  /**
   * Get service statistics
   */
  getStats(): {
    analysisSubscriptions: number;
    diagramSubscriptions: number;
    projectSubscriptions: number;
    totalCallbacks: number;
    eventListeners: number;
    uptime: number;
  } {
    return {
      analysisSubscriptions: this.callbacks.analysis.size,
      diagramSubscriptions: this.callbacks.diagram.size,
      projectSubscriptions: this.callbacks.project.size,
      totalCallbacks: Array.from(this.callbacks.analysis.values()).flat().length +
                      Array.from(this.callbacks.diagram.values()).flat().length +
                      Array.from(this.callbacks.project.values()).flat().length,
      eventListeners: this.listenerCount('analysis:progress') + 
                      this.listenerCount('diagram:progress') + 
                      this.listenerCount('project:update'),
      uptime: process.uptime(),
    };
  }

  /**
   * Clean up all callbacks and listeners
   */
  cleanup(): void {
    this.callbacks.analysis.clear();
    this.callbacks.diagram.clear();
    this.callbacks.project.clear();
    this.removeAllListeners();
    logger.info('EventService cleanup completed');
  }
}

// Create singleton instance
export const eventService = new EnhancedEventService();
export default eventService;
