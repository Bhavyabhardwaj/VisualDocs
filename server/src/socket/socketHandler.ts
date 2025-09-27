import type { AuthenticatedSocket, ConnectionResponse, CursorMovePayload, CursorPosition, JoinProjectPayload, LiveComment, ProjectCommentPayload, ProjectUsersResponse, SocketStatus, StatusUpdatePayload, UserJoinedProjectResponse, UserLeftProjectResponse, UserPresence } from "../types";
import { Server as SocketIoServer } from "socket.io";
import { logger, verifyAccessToken } from "../utils";
import { eventService } from "../services";

class SocketManager {
    private io: SocketIoServer;
    private connectedUsers: Map<string, UserPresence> = new Map();
    private projectRooms: Map<string, Set<string>> = new Map();

    constructor(io: SocketIoServer) {
        this.io = io;
        this.setupListeners();
    }

    // authentication middleware
    private setupListeners() {
        this.io.use(async (socket: AuthenticatedSocket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
                if (!token) {
                    return next(new Error("Authentication error: No token provided"));
                }
                const payload = verifyAccessToken(token);
                // Attach user info to socket
                socket.user = {
                    userId: payload.userId,
                    name: payload.name,
                    email: payload.email
                }
                logger.debug(`User ${socket.user.userId} connected`);
                next();
            } catch (error) {
                logger.error("Socket authentication error:", error);
                next(new Error("Authentication error"));
            }
        })
        // handle new connections
        this.io.on("connection", (socket: AuthenticatedSocket) => {
            this.handleConnection(socket);
        })
        this.setupEventServiceIntegration();
    }
    // handle new connections 
    private handleConnection(socket: AuthenticatedSocket) {
        const user = socket.user;
        if (!user) {
            logger.error("Socket connected without user info");
            return;
        }

        logger.info(`User ${user.userId} connected with socket ID ${socket.id}`);

        // Add user to connected users
        this.connectedUsers.set(user.userId, {
            userId: user.userId,
            userName: user.name,
            email: user.email,
            socketId: socket.id,
            status: "online",
            lastSeen: new Date()
        });

        // notify others users about new user
        const connectionResponse: ConnectionResponse = {
            message: "User connected",
            userId: user.userId,
            timestamp: new Date().toISOString(),
        }
        socket.emit("connected", connectionResponse);

        // join project rooms if any
        socket.on('join-project', (data: JoinProjectPayload) => {
            this.handleJoinProject(socket, data.projectId);
        })

        // leave the project
        socket.on('leave-project', (data: JoinProjectPayload) => {
            this.handleLeaveProject(socket, data.projectId);
        });

        // user status update
        socket.on('status-update', (data: StatusUpdatePayload) => {
            this.handleStatusUpdate(socket, data);
        });
        // real-time comments
        socket.on('project-comment', (data: ProjectCommentPayload) => {
            this.handleProjectComment(socket, data);
        });
        // cursor sharing 
        socket.on('cursor-move', (data: CursorMovePayload) => {
            this.handleCursorPosition(socket, data);
        });
        // handle disconnection
        socket.on('disconnect', (reason) => {
            this.handleDisconnection(socket, reason);
        });
    }
    // handle user joining a project room
    private handleJoinProject(socket: AuthenticatedSocket, projectId: string) {
        const user = socket.user!;
        socket.join(`project-${projectId}`);

        // update user's project
        const UserPresence = this.connectedUsers.get(user.userId);
        if (UserPresence) {
            UserPresence.projectId = projectId;
            UserPresence.status = 'viewing';
        }

        // add to project room tracking
        if (!this.projectRooms.has(projectId)) {
            this.projectRooms.set(projectId, new Set());
        }
        this.projectRooms.get(projectId)!.add(user.userId);
        logger.info(`User ${user.userId} joined project ${projectId}`);

        // notify others in the project room
        const joinedResponse: UserJoinedProjectResponse = {
            userId: user.userId,
            userName: user.name,
            projectId,
            timestamp: new Date().toISOString()
        }
        // emit to all others 
        socket.to(`project-${projectId}`).emit('user-joined', joinedResponse);
        // send current project users to new user
        const projectUsers = Array.from(this.projectRooms.get(projectId) || []).map(userId => this.connectedUsers.get(userId)).filter(Boolean) as UserPresence[];

        const userResponse: ProjectUsersResponse = {
            projectId,
            users: projectUsers,
            timestamp: new Date().toISOString()
        }
        socket.emit('project-users', userResponse);
    }
    // handle user leaving project rooom
    private handleLeaveProject(socket: AuthenticatedSocket, projectId: string) {
        const user = socket.user!;
        socket.leave(`project-${projectId}`);

        // update user's project
        const UserPresence = this.connectedUsers.get(user.userId);
        if (UserPresence && UserPresence.projectId === projectId) {
            delete UserPresence.projectId;
            UserPresence.status = 'online';
        }

        // update project room tracking
        this.projectRooms.get(projectId)?.delete(user.userId);
        logger.info(`User ${user.userId} left project ${projectId}`);

        // notify others in the project room
        const leftResponse: UserLeftProjectResponse = {
            userId: user.userId,
            userName: user.name,
            projectId,
            timestamp: new Date().toISOString()
        }
        socket.to(`project-${projectId}`).emit('user-left', leftResponse);
    }
    // handle user status updates
    private handleStatusUpdate(socket: AuthenticatedSocket, data: StatusUpdatePayload) {
        const user = socket.user!;
        const { status, projectId } = data;
        const UserPresence = this.connectedUsers.get(user.userId);
        if (UserPresence) {
            UserPresence.status = status as any;
            UserPresence.lastSeen = new Date();
        }
        if (projectId) {
            socket.to(`project-${projectId}`).emit('status-updated', {
                userId: user.userId,
                projectId,
                status,
                timestamp: new Date().toISOString()
            });
        }
        logger.debug('User status updated', { userId: user.userId, status, projectId });
    }
    // project comments
    private handleProjectComment(socket: AuthenticatedSocket, data: ProjectCommentPayload) {
        const user = socket.user!;
        const { projectId, content, position } = data;
        const comment: LiveComment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            projectId,
            userId: user.userId,
            userName: user.name,
            content,
            position: position || { x: 0, y: 0 },
            timestamp: new Date().toISOString()
        }
        // broadcast to others in the project room
        this.io.to(`project-${projectId}`).emit('new-comment', comment);
        logger.debug('New project comment', {
            userId: user.userId,
            projectId,
            commentId: comment.id
        });
    }
    // cursor position sharing
    private handleCursorPosition(socket: AuthenticatedSocket, data: CursorMovePayload) {
        const user = socket.user!;
        const { projectId, cursor } = data;

        const cursorUpdate: CursorPosition = {
            userId: user.userId,
            userName: user.name,
            file: cursor.file || '',
            x: cursor.x,
            y: cursor.y,
            timestamp: new Date().toISOString()
        }
        // broadcast to others in the project room
        socket.to(`project-${projectId}`).emit('cursor-updated', cursorUpdate);
    }
    // handle user disconnection
    private handleDisconnection(socket: AuthenticatedSocket, reason: string) {
        const user = socket.user;
        if (!user) {
            logger.error("Disconnected socket without user info");
            return;
        }
        logger.info('User disconnected from Socket.IO', {
            userId: user.userId,
            socketId: socket.id,
            reason
        });
        const userPresence = this.connectedUsers.get(user.userId);
        if (userPresence?.projectId) {
            // Notify project members
            const leftResponse: UserLeftProjectResponse = {
                userId: user.userId,
                userName: user.name,
                projectId: userPresence.projectId,
                timestamp: new Date().toISOString(),
            };
            socket.to(`project-${userPresence.projectId}`).emit('user-left-project', leftResponse);

            // Remove from project room
            this.projectRooms.get(userPresence.projectId)?.delete(user.userId);
        }
        // Remove from connected users
        this.connectedUsers.delete(user.userId);

    }

   // Integrate with existing event service for progress updates
    private setupEventServiceIntegration() {
        // Listen for analysis progress and broadcast to relevant project rooms
        eventService.on('analysis:progress', (event) => {
            this.io.to(`project-${event.projectId}`).emit('analysis:progress', event);
        });

        // Listen for diagram generation progress
        eventService.on('diagram:progress', (event) => {
            this.io.to(`project-${event.projectId}`).emit('diagram:progress', event);
        });

        // Listen for project updates
        eventService.on('project:update', (event) => {
            this.io.to(`project-${event.projectId}`).emit('project:update', event);
        });

        logger.info('✅ Socket.IO integrated with event service');
    }

    /**
     * Get connected users stats
     */
    getStats(): SocketStatus {
        return {
            connectedUsers: this.connectedUsers.size,
            activeProjects: this.projectRooms.size,
            totalRooms: this.io.sockets.adapter.rooms.size,
        };
    }
}

// Socket.IO setup function
export function setupSocketIO(io: SocketIoServer) {
    const socketManager = new SocketManager(io);

    logger.info('🔄 Socket.IO server initialized');
    logger.info('📡 Real-time features enabled:');
    logger.info('  - Live collaboration');
    logger.info('  - Progress tracking');
    logger.info('  - Real-time comments');
    logger.info('  - User presence');

    // Add stats endpoint (optional)
    setInterval(() => {
        const stats = socketManager.getStats();
        logger.debug('Socket.IO Stats', stats);
    }, 30000); // Log stats every 30 seconds

    return socketManager;

}
