import { Router } from 'express';
import { analysisController } from '../controllers';
import { validate } from '../validations';
import { getProjectSchema, exportQuerySchema } from '../validations'; // Add exportQuerySchema
import { generalLimiter, aiLimiter } from '../middleware';

const router = Router();

// All analysis routes require authentication (applied in main router)

// Analysis operations
router.post('/:projectId',
    aiLimiter, // AI operations are resource intensive
    validate(getProjectSchema),
    analysisController.analyseProject
);

router.get('/:projectId',
    validate(getProjectSchema),
    analysisController.getProjectAnalysis
);

router.get('/results/:analysisId',
    analysisController.getAnalysisById
);

// Analysis actions
router.post('/:projectId/rerun',
    aiLimiter,
    validate(getProjectSchema),
    analysisController.rerunAnalysis
);

router.get('/:projectId/progress',
    validate(getProjectSchema),
    analysisController.getAnalysisProgress
);

router.get('/:projectId/recommendations',
    validate(getProjectSchema),
    analysisController.getRecommendations
);

// Export functionality with validation
router.get('/:projectId/export',
    generalLimiter,
    validate(exportQuerySchema), // Add proper validation
    analysisController.exportAnalysis
);

export default router;
