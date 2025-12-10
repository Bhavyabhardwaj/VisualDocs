/**
 * OAuth Callback Handler
 * Handles the redirect from OAuth providers (Google, GitHub)
 * Extracts token and user data from URL, stores in localStorage, and redirects to dashboard
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle2, XCircle, Github, Chrome } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleOAuthToken } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [provider, setProvider] = useState<string>('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const providerParam = searchParams.get('provider');
        const error = searchParams.get('error');

        setProvider(providerParam || '');

        // Handle errors from OAuth provider
        if (error) {
          console.error('OAuth error:', error);
          setStatus('error');
          switch (error) {
            case 'access_denied':
              setMessage('You denied access. Please try again.');
              break;
            case 'github_oauth_failed':
              setMessage('GitHub authentication failed. Please try again.');
              break;
            case 'google_oauth_failed':
              setMessage('Google authentication failed. Please try again.');
              break;
            case 'service_unavailable':
              setMessage('OAuth service is not configured. Please contact support.');
              break;
            default:
              setMessage('Authentication failed. Please try again.');
          }
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Validate required parameters
        if (!token) {
          console.error('No token received from OAuth callback');
          setStatus('error');
          setMessage('No authentication token received. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Store the token
        console.log('🔐 OAuthCallback: Storing token...');

        // Parse user data if provided
        let userData = null;
        if (userParam) {
          try {
            userData = JSON.parse(decodeURIComponent(userParam));
            console.log('✅ OAuthCallback: User data received:', userData);
          } catch (e) {
            console.warn('Could not parse user data from URL:', e);
          }
        }

        // Use AuthContext to handle the OAuth token
        await handleOAuthToken(token, userData);

        setStatus('success');
        setMessage(`Successfully signed in with ${providerParam === 'GITHUB' ? 'GitHub' : 'Google'}!`);

        // Small delay to show success message, then redirect
        setTimeout(() => {
          // Check if this is a new user for potential onboarding
          if (userData?.isNewUser) {
            navigate('/select-plan');
          } else {
            navigate('/app/dashboard');
          }
        }, 1500);

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, handleOAuthToken]);

  const getProviderIcon = () => {
    if (provider === 'GITHUB') {
      return <Github className="w-8 h-8" />;
    }
    return <Chrome className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-[#F7F5F3] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-[#E8D5C4]"
      >
        {/* Provider Icon */}
        <div className={`
          w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center
          ${status === 'loading' ? 'bg-[#F7F5F3] text-[#37322F]' : ''}
          ${status === 'success' ? 'bg-green-100 text-green-600' : ''}
          ${status === 'error' ? 'bg-red-100 text-red-600' : ''}
        `}>
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-8 h-8" />
            </motion.div>
          )}
          {status === 'success' && <CheckCircle2 className="w-8 h-8" />}
          {status === 'error' && <XCircle className="w-8 h-8" />}
        </div>

        {/* Status Message */}
        <h1 className={`
          text-xl font-semibold mb-2
          ${status === 'loading' ? 'text-[#37322F]' : ''}
          ${status === 'success' ? 'text-green-700' : ''}
          ${status === 'error' ? 'text-red-700' : ''}
        `}>
          {status === 'loading' && 'Authenticating...'}
          {status === 'success' && 'Welcome!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>

        <p className="text-[#605A57] mb-6">{message}</p>

        {/* Provider Badge */}
        {provider && status !== 'error' && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F7F5F3] rounded-full text-sm text-[#37322F]">
            {getProviderIcon()}
            <span>via {provider === 'GITHUB' ? 'GitHub' : 'Google'}</span>
          </div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-2 bg-[#37322F] text-white rounded-lg hover:bg-[#37322F]/90 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#37322F]/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
