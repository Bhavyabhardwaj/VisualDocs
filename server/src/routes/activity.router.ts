import { Router } from 'express';
import { activityController } from '../controllers';
import { generalLimiter } from '../middleware';

const router = Router();

// Activity routes require authentication (applied in main router)

// Get project activity
router.get('/project/:projectId', 
  generalLimiter,
  activityController.getProjectActivity
);

// Get user activity
router.get('/user', 
  generalLimiter,
  activityController.getUserActivity
);

// Get team activity
router.get('/team/:teamId', 
  generalLimiter,
  activityController.getTeamActivity
);

export default router;
