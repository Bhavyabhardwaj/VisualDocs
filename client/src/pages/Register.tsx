import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Mail, Loader2, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRequirements.every(req => req.met)) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = (provider: 'google' | 'github') => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/oauth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-card to-app-bg flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-app-muted hover:text-app-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-app-card/50 backdrop-blur-xl border border-app-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-app-foreground mb-2">
              Create account
            </h1>
            <p className="text-app-muted">
              Start visualizing your code in minutes
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthRegister('github')}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthRegister('google')}
            >
              <Mail className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-app-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-app-card px-2 text-app-muted">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-500"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-app-foreground mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-app-foreground mb-2">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-app-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          req.met
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-app-border text-app-muted'
                        }`}
                      >
                        {req.met && <Check className="w-3 h-3" />}
                      </div>
                      <span className={req.met ? 'text-green-500' : 'text-app-muted'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-app-foreground mb-2">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>

            <p className="text-xs text-app-muted text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-app-muted mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
