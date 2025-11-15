import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

const UPLOAD_RATE_LIMIT = Number(process.env.UPLOAD_REQUEST_LIMIT || 60);
const UPLOAD_WINDOW_MS = Number(process.env.UPLOAD_RATE_WINDOW_MS || 15 * 60 * 1000);

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
        // Skip rate limiting in development for health checks
        return process.env.NODE_ENV === 'development' && req.path === '/health';
    },
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, 
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true
})

export const fileUploadLimiter = rateLimit({
    windowMs: UPLOAD_WINDOW_MS,
    max: UPLOAD_RATE_LIMIT,
    message: {
        success: false,
        error: 'Too many file upload requests, please slow down and try again shortly.',
        timestamp: new Date().toISOString(),
    },
    keyGenerator: (req: Request) => {
        const typedReq = req as Request & { user?: { userId?: string } };
        return typedReq.user?.userId || req.ip;
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3,
    message: {
        success: false,
        error: 'AI generation limit exceeded, please wait before generating more diagrams.',
        timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
})

export const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};