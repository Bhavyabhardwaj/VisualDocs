import { Router } from 'express';
import { teamController } from '../controllers';
import { generalLimiter } from '../middleware';

const router = Router();

// Team routes require authentication (applied in main router)

// Initialize team membership (auto-add current user)
router.post('/initialize', 
  generalLimiter,
  teamController.initializeTeamMember
);

// Get team members
router.get('/members', 
  generalLimiter,
  teamController.getTeamMembers
);

// Get team activity
router.get('/activity', 
  generalLimiter,
  teamController.getTeamActivity
);

// Get pending invitations
router.get('/invitations', 
  generalLimiter,
  teamController.getPendingInvitations
);

// Invite team member
router.post('/invite', 
  generalLimiter,
  teamController.inviteTeamMember
);

// Accept invitation
router.post('/invitations/:token/accept', 
  generalLimiter,
  teamController.acceptInvitation
);

// Update member role
router.patch('/members/:userId/role', 
  generalLimiter,
  teamController.updateMemberRole
);

// Remove team member
router.delete('/members/:userId', 
  generalLimiter,
  teamController.removeTeamMember
);

export default router;
