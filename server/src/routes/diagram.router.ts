import { Router } from 'express';
import { diagramController } from '../controllers';
import { validate } from '../validations';
import { getProjectSchema } from '../validations';
import { aiLimiter, generalLimiter } from '../middleware';

const router = Router();

// All diagram routes require authentication (applied in main router)

// Diagram CRUD
router.post('/', 
  aiLimiter, // AI generation is resource intensive
  diagramController.generateDiagram
);

router.get('/:id', 
  diagramController.getDiagram
);

router.delete('/:id', 
  diagramController.deleteDiagram
);

// Diagram actions
router.get('/:id/progress', 
  diagramController.getDiagramProgress
);

router.post('/:id/regenerate', 
  aiLimiter,
  diagramController.regenerateDiagram
);

// Project diagrams (mounted under projects route)
// This will be accessible as /api/projects/:projectId/diagrams
export const projectDiagramRouter = Router({ mergeParams: true });

projectDiagramRouter.get('/', 
  validate(getProjectSchema),
  diagramController.getProjectDiagrams
);

export default router;
