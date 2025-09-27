import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { authService } from '../services';
import { logger } from '../utils';
import { authLimiter } from '../middleware';

const router = Router();

// Enhanced OAuth callback handler that uses your authService.handleOAuthLogin
const handleOAuthCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      logger.error('OAuth callback called without user data');
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    // Use the enhanced handleOAuthLogin method from your authService
    const result = await authService.handleOAuthLogin({
      id: user.providerId,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider
    });

    // Set secure HTTP-only cookie for refresh token
    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend with comprehensive user data
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?` + 
      `token=${result.tokens.accessToken}&` +
      `user=${encodeURIComponent(JSON.stringify({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
        role: result.user.role,
        isNewUser: result.isNewUser
      }))}&` +
      `provider=${result.provider}`;

    logger.info('OAuth authentication successful', {
      userId: result.user.id,
      provider: result.provider,
      isNewUser: result.isNewUser
    });

    res.redirect(redirectUrl);
    
  } catch (error) {
    logger.error('OAuth callback handling failed:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_processing_failed`);
  }
};

// Handle OAuth errors
const handleOAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('OAuth authentication error:', err);
  
  let errorType = 'oauth_error';
  if (err.message?.includes('access_denied')) {
    errorType = 'access_denied';
  } else if (err.message?.includes('invalid_request')) {
    errorType = 'invalid_request';
  }
  
  res.redirect(`${process.env.CLIENT_URL}/login?error=${errorType}`);
};

// GitHub OAuth Routes
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  router.get('/github',
    authLimiter,
    passport.authenticate('github', { 
      scope: ['user:email'],
      session: false 
    })
  );

  router.get('/github/callback',
    passport.authenticate('github', { 
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=github_oauth_failed`
    }),
    handleOAuthCallback,
    handleOAuthError
  );
} else {
  // Fallback routes when GitHub OAuth is not configured
  router.get('/github', (req, res) => {
    res.status(501).json({ 
      error: 'GitHub OAuth is not configured',
      message: 'Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables'
    });
  });

  router.get('/github/callback', (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/login?error=service_unavailable`);
  });
}

// Google OAuth Routes
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  router.get('/google',
    authLimiter,
    passport.authenticate('google', { 
      scope: ['profile', 'email'],
      session: false 
    })
  );

  router.get('/google/callback',
    passport.authenticate('google', { 
      session: false,
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_oauth_failed`
    }),
    handleOAuthCallback,
    handleOAuthError
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(501).json({ 
      error: 'Google OAuth is not configured',
      message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables'
    });
  });

  router.get('/google/callback', (req, res) => {
    res.redirect(`${process.env.CLIENT_URL}/login?error=service_unavailable`);
  });
}

// OAuth status endpoint - check which providers are available
router.get('/status', (req, res) => {
  const availableProviders = [];
  
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    availableProviders.push('github');
  }
  
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    availableProviders.push('google');
  }
  
  res.json({
    success: true,
    data: {
      availableProviders,
      endpoints: {
        github: '/api/oauth/github',
        google: '/api/oauth/google'
      }
    }
  });
});

export default router;