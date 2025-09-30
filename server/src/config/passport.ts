import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { authService } from '../services';
import { logger } from '../utils';

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await authService.getUserById(id);
    done(null, user);
  } catch (error) {
    logger.error('Error deserializing user:', error);
    done(error, null);
  }
});

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/oauth/google/callback`
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
  try {
    logger.info('Google OAuth profile received:', {
      id: profile.id,
      email: profile.emails?.[0]?.value,
      name: profile.displayName
    });

    const user = await authService.findOrCreateOAuthUser({
      provider: 'GOOGLE',
      providerId: profile.id,
      email: profile.emails?.[0]?.value || '',
      name: profile.displayName || '',
      avatar: profile.photos?.[0]?.value || undefined
    });

    // Return user with provider info for callback handling
    done(null, {
      ...user,
      provider: 'GOOGLE',
      providerId: profile.id
    });
  } catch (error) {
    logger.error('Google OAuth error:', error);
    done(error, false);
  }
  }));
}

// GitHub OAuth Strategy (only if credentials are provided)
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/oauth/github/callback`
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      logger.info('GitHub OAuth profile received:', {
        id: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      const user = await authService.findOrCreateOAuthUser({
        provider: 'GITHUB',
        providerId: profile.id,
        email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
        name: profile.displayName || profile.username || '',
        avatar: profile.photos?.[0]?.value || undefined
      });

      // Return user with provider info for callback handling
      done(null, {
        ...user,
        provider: 'GITHUB',
        providerId: profile.id
      });
    } catch (error) {
      logger.error('GitHub OAuth error:', error);
      done(error, false);
    }
  }));
}

export default passport;