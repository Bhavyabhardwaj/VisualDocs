import dotenv from 'dotenv'
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import type { Request, Response } from 'express';
import { corsOptions, errorHandler, initializePassport, notFoundHandler, requestId, requestLogger } from './middleware';
import { createServer } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { transport, transports } from 'winston';
import { logger, morganStream } from './utils';
import router from './routes';
import config from './config';
import { setupSocketIO } from './socket/socketHandler';

dotenv.config();

const app = express();

// create http server
const httpServer = createServer(app);
// create socket.io server
const io = new SocketIoServer(httpServer, {
  cors: {
    origin: config.cors.allowedOrigins,
    credentials: true
  },
  transports: ['websocket', 'polling']
});

app.set('trust proxy', 1); // trust first proxy
const PORT = process.env.PORT || 3004;

app.use(helmet());  // secure the application
app.use(require('compression')());  // compress response bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));  // enable CORS

// request logging
app.use(requestId);
app.use(morgan('combined', { stream: morganStream }));  // log all requests
app.use(requestLogger);

// database connection management
const { manageConnectionPool } = require('./middleware/database');
app.use(manageConnectionPool);


// Initialize Passport
app.use(initializePassport);

app.use('/uploads', express.static('uploads'));

app.use('/', router);

app.use(notFoundHandler);
app.use(errorHandler);

// setup socket io
setupSocketIO(io);

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');

  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');

  httpServer.close(() => {
    logger.info('HTTP server closed');
  });

  io.close(() => {
    logger.info('Socket.IO server closed');
  });

  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start server
async function startServer() {
  try {
    // Start HTTP server
    const PORT = config.server.port;
    const HOST = config.server.host;

    httpServer.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running on http://${HOST}:${PORT}`);
      logger.info(`📖 API Health Check: http://${HOST}:${PORT}/health`);
      logger.info(`📊 API Status: http://${HOST}:${PORT}/status`);
      logger.info(`🔗 Socket.IO: Real-time features enabled`);
      logger.info(`🌍 Environment: ${config.server.nodeEnv}`);

      // Log all available routes
      logger.info('\n📋 Available API Endpoints:');
      logger.info('  🔐 Auth: /api/auth/*');
      logger.info('  📊 Projects: /api/projects/*');
      logger.info('  📈 Analysis: /api/analysis/*');
      logger.info('  🎨 Diagrams: /api/diagrams/*');
      logger.info('  🌍 Public: /api/public/*');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export { app, httpServer, io };
