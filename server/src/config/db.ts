import { PrismaClient } from "../generated/prisma";
import { logger } from "../utils";

// Configure Prisma Client with proper connection pooling
// Connection pooling is configured via DATABASE_URL query params:
// ?connection_limit=10&pool_timeout=20
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  // Remove datasources override as it's causing type issues
  // The connection string will be read from DATABASE_URL environment variable
});

// Connection health check interval (every 30 seconds)
let healthCheckInterval: NodeJS.Timeout | null = null;

// Start health check after initial connection
const startHealthCheck = () => {
  if (healthCheckInterval) return;
  
  healthCheckInterval = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      logger.error('Database health check failed, attempting reconnection...', error);
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        logger.info('Database reconnected successfully');
      } catch (reconnectError) {
        logger.error('Failed to reconnect to database:', reconnectError);
      }
    }
  }, 30000); // Check every 30 seconds
};

// Graceful shutdown handling
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, disconnecting Prisma...');
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, disconnecting Prisma...');
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
  await prisma.$disconnect();
  process.exit(0);
});

// Test connection on startup with retry logic
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
      startHealthCheck(); // Start periodic health checks
      return;
    } catch (error) {
      logger.error(`❌ Database connection attempt ${i + 1}/${retries} failed:`, error);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error('❌ All database connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
};

connectWithRetry();

export default prisma;