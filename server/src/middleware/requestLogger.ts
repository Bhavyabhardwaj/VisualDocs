import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Request ID middleware
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = Math.random().toString(36).substr(2, 9);
  (req as any).id = id;
  res.setHeader('X-Request-ID', id);
  next();
};

// Enhanced request logging
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request:', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.userId,
    requestId: (req as any).id,
    timestamp: new Date().toISOString(),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - start;
    
    // Log response
    logger.info('Response sent:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: body?.success,
      requestId: (req as any).id,
      timestamp: new Date().toISOString(),
    });

    return originalJson.call(this, body);
  };

  next();
};
