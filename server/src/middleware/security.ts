import helmet from 'helmet';
import cors from 'cors';
import type { Request } from 'express';
import config from '../config';

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = config.cors.allowedOrigins.map(o => o.replace(/\/$/, ''));

    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['X-Request-ID'],
  optionsSuccessStatus: 200,
};

// Helmet configuration for security headers
export const helmetConfig = helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.gemini.com'], // For AI API calls
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Compression configuration
export const compressionConfig = () => {
  const compressionModule = require('compression');
  return compressionModule({
    level: 6,
    threshold: 1024,
    filter: (req: Request, res: any) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compressionModule.filter(req, res);
    },
  });
};
