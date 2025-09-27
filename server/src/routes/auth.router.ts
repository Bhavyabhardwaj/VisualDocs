import { Router } from 'express';
import { authController } from '../controllers';
import { 
    changePasswordSchema, 
    loginSchema, 
    registerSchema, 
    updateProfileSchema, 
    linkOAuthAccountSchema,
    validate 
} from '../validations';
import { authLimiter, isAuthenticated } from '../middleware';

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
    isAuthenticated,
    authController.getProfile
);

router.put('/profile',
    isAuthenticated,
    validate(updateProfileSchema),
    authController.updateProfile
);

router.post('/change-password',
    isAuthenticated,
    validate(changePasswordSchema), 
    authController.changePassword
);

router.get('/stats',
    isAuthenticated,
    authController.getUserStats
);

router.delete('/account',
    isAuthenticated,
    authController.deactivateAccount
);

router.post('/logout',
    isAuthenticated,
    authController.logout
);

router.post('/refresh',
    authController.refreshToken  // No auth required for refresh token
);

// OAuth account management (for authenticated users)
router.post('/oauth/link',
    isAuthenticated,
    validate(linkOAuthAccountSchema),
    authController.linkOAuthAccount
);

router.delete('/oauth/unlink',
    isAuthenticated,
    authController.unlinkOAuthAccount
);

export default router;
