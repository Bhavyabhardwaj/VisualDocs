import { PrismaClient } from "../generated/prisma";
import { logger } from "../utils";

// Configure Prisma Client with proper connection pooling
const prisma = new PrismaClient({
  log: ['error', 'warn'],
  // Remove datasources override as it's causing type issues
  // The connection string will be read from DATABASE_URL environment variable
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, disconnecting Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

// Test connection on startup
prisma.$connect()
  .then(() => {
    logger.info('✅ Database connected successfully');
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1);
  });

export default prisma;