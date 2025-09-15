import type { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return errorResponse(res, 'Access token required', 401);
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, 'Invalid or expired token', 403);
    }

}