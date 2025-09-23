import { Router } from 'express';
import { isAuthenticated } from '../middleware';

// Import individual routers
import authRouter from './auth.router';
import projectRouter from './project.router';
import analysisRouter from './analysis.router';
import diagramRouter, { projectDiagramRouter } from './diagram.router';
import publicRouter from './public.router';

const router = Router();

// Define route structure 
const apiRoutes = [
  { path: '/auth', route: authRouter },
  { path: '/projects', route: projectRouter, isProtected: true },
  { path: '/analysis', route: analysisRouter, isProtected: true },
  { path: '/diagrams', route: diagramRouter, isProtected: true },
  { path: '/public', route: publicRouter },
];

// Loop through routes and apply them 
apiRoutes.forEach(({ path, route, isProtected }) => {
  if (isProtected) {
    router.use(`/api${path}`, isAuthenticated, route);
  } else {
    router.use(`/api${path}`, route);
  }
});

// Special nested routes
// Projects have diagrams as sub-resource
router.use('/api/projects/:projectId/diagrams', isAuthenticated, projectDiagramRouter);

// Keep the root public router for root endpoints 
router.use('/', publicRouter);

// 404 handler for API routes
router.use('/api/*', (req, res) => {
  return res.status(404).json({
    success: false,
    error: `API route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    availableRoutes: {
      auth: '/api/auth/*',
      projects: '/api/projects/*',
      analysis: '/api/analysis/*',
      diagrams: '/api/diagrams/*',
      public: '/api/public/*',
      health: '/health',
      status: '/status',
    }
  });
});

export default router;
