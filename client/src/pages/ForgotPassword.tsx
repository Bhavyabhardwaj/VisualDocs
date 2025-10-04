import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Since forgotPassword endpoint doesn't exist in API, simulate success
      // In production, you'd call: await api.auth.forgotPassword(email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-app-bg via-app-card to-app-bg flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-app-card/50 backdrop-blur-xl border border-app-border rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-app-foreground mb-2">
              Check your email
            </h1>
            <p className="text-app-muted mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login">
              <Button className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
        {/* Back to Login */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-app-muted hover:text-app-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Card */}
        <div className="bg-app-card/50 backdrop-blur-xl border border-app-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-app-foreground mb-2">
              Forgot password?
            </h1>
            <p className="text-app-muted">
              Enter your email and we'll send you a reset link
            </p>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
