import { Router } from 'express';
import { successResponse } from '../utils/response';
import { logger } from '../utils/logger';
import { eventService } from '../services';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const eventStats = eventService.getStats();
  return successResponse(
    res,
    {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    'Service is healthy'
  );
});

// API status endpoint
router.get('/status', (req, res) => {
  const eventStats = eventService.getStats();
  return successResponse(
    res,
    {
      api: 'VisualDocs API',
      version: '1.0.0',
      status: 'operational',
      services: {
        database: 'connected',
        ai: 'available',
        fileStorage: 'operational',
        realTime: 'active',
      },
      realTimeStats: eventStats,
      timestamp: new Date().toISOString(),
    },
    'API status retrieved successfully'
  );
});

// API documentation endpoint (future implementation)
router.get('/docs', (req, res) => {
  return successResponse(
    res,
    {
      documentation: 'API documentation coming soon',
      swagger: '/api/swagger',
      postman: '/api/postman',
    },
    'API documentation information'
  );
});

// Root endpoint
router.get('/', (req, res) => {
  return successResponse(
    res,
    {
      message: 'Welcome to VisualDocs API',
      version: '1.0.0',
      description: 'AI-powered code visualization and analysis platform',
      endpoints: {
        health: '/health',
        status: '/status',
        docs: '/docs',
        api: '/api',
      },
    },
    'Welcome to VisualDocs API'
  );
});

export default router;
