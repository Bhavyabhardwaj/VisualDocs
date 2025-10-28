import { Router } from 'express';
import { teamController } from '../controllers';
import { generalLimiter } from '../middleware';

const router = Router();

// Team routes require authentication (applied in main router)

// Get team members
router.get('/:id/members', 
  generalLimiter,
  teamController.getTeamMembers
);

// Get team activity
router.get('/:id/activity', 
  generalLimiter,
  teamController.getTeamActivity
);

// Invite team member
router.post('/:id/invite', 
  generalLimiter,
  teamController.inviteTeamMember
);

// Remove team member
router.delete('/:id/members/:userId', 
  generalLimiter,
  teamController.removeTeamMember
);

export default router;
