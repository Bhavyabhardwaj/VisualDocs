import prisma from '../config/db';
import { logger } from '../utils';

/**
 * Database health monitoring utility
 */
export class DatabaseMonitor {
  private static instance: DatabaseMonitor;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  
  private constructor() {}
  
  static getInstance(): DatabaseMonitor {
    if (!DatabaseMonitor.instance) {
      DatabaseMonitor.instance = new DatabaseMonitor();
    }
    return DatabaseMonitor.instance;
  }
  
  /**
   * Start periodic health checks
   */
  startHealthCheck(intervalMs: number = 30000) { // 30 seconds default
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        const start = Date.now();
        await prisma.$queryRaw`SELECT 1`;
        const duration = Date.now() - start;
        
        if (duration > 5000) { // Log if query takes more than 5 seconds
          logger.warn('Database health check slow response', { duration: `${duration}ms` });
        } else {
          logger.debug('Database health check successful', { duration: `${duration}ms` });
        }
      } catch (error) {
        logger.error('Database health check failed', { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }, intervalMs);
  }
  
  /**
   * Stop health checks
   */
  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
  
  /**
   * Get database connection status
   */
  async getConnectionStatus(): Promise<{
    isConnected: boolean;
    responseTime?: number;
    error?: string;
  }> {
    try {
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const responseTime = Date.now() - start;
      
      return {
        isConnected: true,
        responseTime
      };
    } catch (error) {
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Force connection pool refresh (use carefully)
   */
  async refreshConnectionPool(): Promise<void> {
    try {
      await prisma.$disconnect();
      await prisma.$connect();
      logger.info('Database connection pool refreshed');
    } catch (error) {
      logger.error('Failed to refresh connection pool', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

// Export singleton instance
export const dbMonitor = DatabaseMonitor.getInstance();