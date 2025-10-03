import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Github, Mail, Lock, User, ArrowLeft, Sparkles, Check } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration
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

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/60">Start documenting your code in minutes</p>
          </div>

          {/* GitHub Sign Up */}
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
              <span className="px-4 bg-transparent text-white/60">Or sign up with email</span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  className="pl-11 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-emerald-500 focus:ring-emerald-500/20"
                  required
                />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs text-white/60">
                  <Check className="w-3 h-3 mr-1 text-emerald-400" />
                  At least 8 characters
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
                required
              />
              <label className="ml-2 text-sm text-white/70">
                I agree to the{' '}
                <a href="#" className="text-emerald-400 hover:text-emerald-300">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-emerald-400 hover:text-emerald-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg"
            >
              Create Account
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-white/60">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-white/40 text-xs">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            Free forever
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            No credit card
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-emerald-400" />
            Cancel anytime
          </div>
        </div>
      </motion.div>
    </div>
  );
};
