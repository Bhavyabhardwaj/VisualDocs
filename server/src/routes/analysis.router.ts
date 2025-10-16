import { Router } from 'express';
import { analysisController } from '../controllers';
import { validate } from '../validations';
import { getProjectSchema, exportQuerySchema } from '../validations'; // Add exportQuerySchema
import { generalLimiter, aiLimiter } from '../middleware';

const router = Router();

// All analysis routes require authentication (applied in main router)

// Analysis operations
router.post('/:id',
    aiLimiter, // AI operations are resource intensive
    validate(getProjectSchema),
    analysisController.analyseProject
);

router.get('/:id',
    validate(getProjectSchema),
    analysisController.getProjectAnalysis
);

router.get('/results/:analysisId',
    analysisController.getAnalysisById
);

// Analysis actions
router.post('/:id/rerun',
    aiLimiter,
    validate(getProjectSchema),
    analysisController.rerunAnalysis
);

router.get('/:id/progress',
    validate(getProjectSchema),
    analysisController.getAnalysisProgress
);

router.get('/:id/recommendations',
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
