import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Github, Mail, Lock, ArrowLeft, Sparkles } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual authentication
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900 flex items-center justify-center p-4">
      {/* Subtle Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/60">Sign in to continue to VisualDocs</p>
          </div>

          {/* GitHub Sign In */}
          <Button
            type="button"
            className="w-full mb-6 bg-white hover:bg-gray-100 text-gray-900 border-0"
          >
            <Github className="w-5 h-5 mr-2" />
            Continue with GitHub
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="password"
                  placeholder="Enter your password"
                  className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
                />
                <span className="ml-2 text-sm text-white/70">Remember me</span>
              </label>
              <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-white/60">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-white/40 text-sm">
          <p>Trusted by 10,000+ developers worldwide</p>
        </div>
      </motion.div>
    </div>
  );
};
