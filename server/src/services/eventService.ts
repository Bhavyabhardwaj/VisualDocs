import { EventEmitter } from 'events';
import { logger } from '../utils/logger';
import type { AnalysisProgressEvent, CollaborationEvent, DiagramGenerationEvent, EventSubscription, ProjectUpdateEvent, SocketUserData, SystemNotificationEvent } from '../types';

export class EventService extends EventEmitter {
    private connectedUsers: Map<string, SocketUserData> = new Map();    // store connected users(userId, socketId, etc.)
    private subscriptions: Map<string, EventSubscription[]> = new Map();    // store user subscriptions(what user what to listen to)

    constructor() {
        super();
        this.setMaxListeners(100); // Increase limit for multiple users
    }

    // Analysis progress events
    emitAnalysisProgress(event: AnalysisProgressEvent): void {
        try {
            logger.debug('Emitting analysis progress', event);

            this.emit('analysis:progress', event);
            this.emit(`analysis:progress:${event.projectId}`, event);
            this.emit(`user:${event.userId}:analysis:progress`, event);

        } catch (error) {
            logger.error('Failed to emit analysis progress', {
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Diagram generation events
    emitDiagramProgress(event: DiagramGenerationEvent): void {
        try {
            logger.debug('Emitting diagram progress', event);

            this.emit('diagram:progress', event);
            this.emit(`diagram:progress:${event.diagramId}`, event);
            this.emit(`project:${event.projectId}:diagram:progress`, event);
            this.emit(`user:${event.userId}:diagram:progress`, event);

        } catch (error) {
            logger.error('Failed to emit diagram progress', {
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Project update events
    emitProjectUpdate(event: ProjectUpdateEvent): void {
        try {
            logger.debug('Emitting project update', event);

            this.emit('project:update', event);
            this.emit(`project:update:${event.projectId}`, event);
            this.emit(`user:${event.userId}:project:update`, event);

        } catch (error) {
            logger.error('Failed to emit project update', {
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // System notification events
    emitSystemNotification(event: SystemNotificationEvent): void {
        try {
            logger.debug('Emitting system notification', event);

            this.emit('notification:system', event);
            this.emit(`user:${event.userId}:notification`, event);

        } catch (error) {
            logger.error('Failed to emit system notification', {
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // Collaboration events 
    emitCollaborationEvent(event: CollaborationEvent): void {
        try {
            logger.debug('Emitting collaboration event', event);

            this.emit('collaboration:event', event);
            this.emit(`session:${event.sessionId}:collaboration`, event);
            this.emit(`project:${event.projectId}:collaboration`, event);

        } catch (error) {
            logger.error('Failed to emit collaboration event', {
                event,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    // User connection management 
    addConnectedUser(userId: string, userData: Omit<SocketUserData, 'userId'>): void { // remove userId from userData to avoid duplication
        this.connectedUsers.set(userId, {
            userId,
            ...userData,
        });

        logger.info('User connected to real-time service', { userId });
    }

    removeConnectedUser(userId: string): void {
        this.connectedUsers.delete(userId);
        logger.info('User disconnected from real-time service', { userId });
    }

    getConnectedUsers(): SocketUserData[] {
        return Array.from(this.connectedUsers.values());
    }

    isUserConnected(userId: string): boolean {
        return this.connectedUsers.has(userId);
    }

    // Event subscription methods
    subscribeUser(userId: string, subscription: Omit<EventSubscription, 'id' | 'userId' | 'createdAt'>): string {
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fullSubscription: EventSubscription = {
            id: subscriptionId,
            userId,
            createdAt: new Date(),
            ...subscription,
        };

        const userSubscriptions = this.subscriptions.get(userId) || [];
        userSubscriptions.push(fullSubscription);
        this.subscriptions.set(userId, userSubscriptions);

        logger.debug('User subscribed to events', { userId, subscriptionId, eventType: subscription.eventType });

        return subscriptionId;
    }

    unsubscribeUser(userId: string, subscriptionId: string): boolean {
        const userSubscriptions = this.subscriptions.get(userId) || [];
        const index = userSubscriptions.findIndex(sub => sub.id === subscriptionId); // findIndex will return -1 if not found

        if (index > -1) {
            userSubscriptions.splice(index, 1);
            this.subscriptions.set(userId, userSubscriptions);
            logger.debug('User unsubscribed from events', { userId, subscriptionId });
            return true;
        }

        return false;
    }

    getUserSubscriptions(userId: string): EventSubscription[] {
        return this.subscriptions.get(userId) || [];
    }

    // Subscribe to analysis progress for a specific project
    onAnalysisProgress(
        projectId: string,
        callback: (event: AnalysisProgressEvent) => void
    ): () => void {
        const eventName = `analysis:progress:${projectId}`;
        this.on(eventName, callback);

        return () => {
            this.off(eventName, callback);
        };
    }

    // Subscribe to diagram progress for a specific diagram
    onDiagramProgress(
        diagramId: string,
        callback: (event: DiagramGenerationEvent) => void
    ): () => void {
        const eventName = `diagram:progress:${diagramId}`;
        this.on(eventName, callback);

        return () => {
            this.off(eventName, callback);
        };
    }

    // Subscribe to all project updates for a user
    onUserProjectUpdates(
        userId: string,
        callback: (event: ProjectUpdateEvent) => void
    ): () => void {
        const eventName = `user:${userId}:project:update`;
        // start listening to the event
        this.on(eventName, callback);

        return () => {
            // stop listening to the event
            this.off(eventName, callback);
        };
    }
}