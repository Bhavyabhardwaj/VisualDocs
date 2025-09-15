import type { Request, Response, NextFunction } from 'express';
import { errorResponse, verifyAccessToken } from '../utils';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../types';
import { UnauthorizedError } from '../errors';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | undefined;
    }
  }
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }
      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('Insufficient permissions');
      }
      next();
    } catch (error) {
      throw new UnauthorizedError('Access denied');
    }
  }
}


// Convenience middlewares for common roles
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

// Optional authentication - doesn't throw error if no token
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        req.user = payload;
      } catch (error) {
        // Silently ignore token errors for optional auth
        req.user = undefined;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};