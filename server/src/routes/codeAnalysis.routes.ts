import { Router } from 'express';
import { codeAnalysisController } from '../controllers/codeAnalysis.controller';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(isAuthenticated);

// Run AI code analysis on a project
router.post('/:projectId/analyze', (req, res) => 
  codeAnalysisController.analyzeProject(req, res)
);

// Get analysis results for a project
router.get('/:projectId', (req, res) => 
  codeAnalysisController.getAnalysis(req, res)
);

// Get ignored issues for a project
router.get('/:projectId/ignored', (req, res) => 
  codeAnalysisController.getIgnoredIssues(req, res)
);

// Ignore a specific issue
router.post('/:projectId/issues/:issueId/ignore', (req, res) => 
  codeAnalysisController.ignoreIssue(req, res)
);

// Apply AI-suggested fix to an issue
router.post('/:projectId/issues/:issueId/apply', (req, res) => 
  codeAnalysisController.applyFix(req, res)
);

export default router;
