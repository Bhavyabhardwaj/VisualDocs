import type { AuthenticatedSocket, UserPresence } from "../types";
import { Server as SocketIoServer } from "socket.io";

class SocketManager {
    private io: SocketIoServer;
    private connectedUsers: Map<string, UserPresence> = new Map();
    private projectRooms: Map<string, Set<string>> = new Map();

    constructor(io: SocketIoServer) {
        this.io = io;
        this.setupListeners();
    }


    private setupListeners() {
        this.io.use(async (socket: AuthenticatedSocket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
            } catch (error) {

            }
        })

    }
}