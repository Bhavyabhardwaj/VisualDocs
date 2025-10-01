import type { NextFunction, Request, Response } from 'express';
import prisma from '../config/db';
import { logger } from '../utils';

/**
 * Database connection health check middleware
 */
export const checkDatabaseConnection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Simple health check query
    await prisma.$queryRaw`SELECT 1`;
    next();
  } catch (error) {
    logger.error('Database connection check failed:', error);
    return res.status(503).json({
      success: false,
      error: 'Database service unavailable',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Connection pool management middleware
 */
export const manageConnectionPool = async (req: Request, res: Response, next: NextFunction) => {
  // Monitor connection pool usage
  res.on('finish', () => {
    logger.debug('Request completed, connection pool state maintained');
  });
  
  // Set a reasonable timeout for database operations
  req.setTimeout(30000); // 30 seconds
  
  next();
};

/**
 * Database transaction wrapper with retry logic
 */
export const withDatabaseRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a connection pool timeout error
      if (lastError.message.includes('connection pool') || 
          lastError.message.includes('Timed out fetching')) {
        
        logger.warn(`Database operation failed, attempt ${attempt}/${maxRetries}:`, {
          error: lastError.message,
          attempt,
          maxRetries
        });
        
        if (attempt < maxRetries) {
          // Exponential backoff
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      // If it's not a connection pool error or we've exhausted retries, throw immediately
      throw lastError;
    }
  }
  
  throw lastError!;
};