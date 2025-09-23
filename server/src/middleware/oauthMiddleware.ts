import type { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import { logger } from '../utils';

// Initialize Passport middleware
export const initializePassport = passport.initialize();

// OAuth authentication middleware for Google
export const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// OAuth authentication middleware for GitHub
export const authenticateGitHub = passport.authenticate('github', {
  scope: ['user:email']
});

// OAuth callback middleware for Google
export const googleCallback = passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  session: false // We'll use JWT instead of sessions
});

// OAuth callback middleware for GitHub
export const gitHubCallback = passport.authenticate('github', {
  failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  session: false // We'll use JWT instead of sessions
});

// Middleware to handle successful OAuth authentication
export const handleOAuthSuccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as any;
    
    if (!user) {
      logger.error('OAuth success handler called without user');
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    // Generate JWT tokens for the authenticated user
    const { generateTokenPair } = require('../utils');
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Set secure cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend with access token
    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${tokens.accessToken}&user=${encodeURIComponent(JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    }))}`;

    logger.info('OAuth authentication successful', {
      userId: user.id,
      provider: user.provider
    });

    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('OAuth success handling failed:', error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_processing_failed`);
  }
};

// Middleware to handle OAuth errors
export const handleOAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('OAuth authentication error:', err);
  
  // Determine error type and redirect accordingly
  let errorType = 'oauth_error';
  
  if (err.message?.includes('access_denied')) {
    errorType = 'access_denied';
  } else if (err.message?.includes('invalid_request')) {
    errorType = 'invalid_request';
  }
  
  res.redirect(`${process.env.CLIENT_URL}/login?error=${errorType}`);
};