import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Mail, Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    // Redirect to OAuth endpoint
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
              Welcome back
            </h1>
            <p className="text-app-muted">
              Sign in to your account to continue
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin('github')}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin('google')}
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
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-app-muted cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-app-border bg-app-bg text-primary focus:ring-2 focus:ring-primary/20"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-app-muted mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
