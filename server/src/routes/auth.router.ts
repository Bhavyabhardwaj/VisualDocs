import { Router } from 'express';
import { authController } from '../controllers';
import { changePasswordSchema, loginSchema, registerSchema, updateProfileSchema, validate } from '../validations';
import { 
  authLimiter,
  authenticateGoogle,
  authenticateGitHub,
  googleCallback,
  gitHubCallback,
  handleOAuthSuccess,
  handleOAuthError
} from '../middleware';

const router = Router();

// Public routes (with auth rate limiting)
router.post('/register',
    authLimiter,
    validate(registerSchema),
    authController.register
);

router.post('/login',
    authLimiter,
    validate(loginSchema),
    authController.login
);

// Protected routes (authentication required)
router.get('/profile',
    authController.getProfile
);

router.put('/profile',
    validate(updateProfileSchema),
    authController.updateProfile
);

router.post('/change-password',
    validate(changePasswordSchema), 
    authController.changePassword
);

router.get('/stats',
    authController.getUserStats
);

router.delete('/account',
    authController.deactivateAccount
);

router.post('/logout',
    authController.logout
);

router.post('/refresh',
    authController.refreshToken
);

// OAuth routes
// Google OAuth
router.get('/google',
    authLimiter,
    authenticateGoogle
);

router.get('/google/callback',
    googleCallback,
    handleOAuthSuccess,
    handleOAuthError
);

// GitHub OAuth
router.get('/github',
    authLimiter,
    authenticateGitHub
);

router.get('/github/callback',
    gitHubCallback,
    handleOAuthSuccess,
    handleOAuthError
);

export default router;
