import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Lock, ArrowRight, Code2, Github, Chrome, Zap, Sparkles, Star } from 'lucide-react';
import { authService } from '@/services';

export default function SplitLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login({ email, password });
      if (response.success) {
        // Force a full page reload to ensure token is properly loaded
        window.location.replace('/app/dashboard');
      } else {
        setError(response.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'userMessage' in err) {
        setError(err.userMessage as string);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
        setError(axiosError.response?.data?.error || axiosError.response?.data?.message || 'Invalid email or password');
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b14] flex overflow-hidden font-['Inter']">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-violet-600 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VisualDocs</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">
              Welcome back
            </h1>
            <p className="text-gray-400 text-lg">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#1a1b26] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-[#1a1b26] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-[#1a1b26] text-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0a0b14] text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';
                window.location.href = `${apiUrl}/api/oauth/google`;
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1a1b26] border border-gray-800 rounded-xl text-gray-300 hover:bg-[#252632] hover:border-gray-700 transition-all"
            >
              <Chrome className="w-5 h-5" />
              <span className="font-medium">Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';
                window.location.href = `${apiUrl}/api/oauth/github`;
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#1a1b26] border border-gray-800 rounded-xl text-gray-300 hover:bg-[#252632] hover:border-gray-700 transition-all"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Animated Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-violet-600/20 to-blue-500/20" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Floating Elements */}
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="relative w-full max-w-lg">
            {/* Main Feature Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="bg-[#1a1b26]/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-violet-600 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI-Powered Analysis</h3>
                    <p className="text-sm text-gray-400">Instant code insights</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  Transform your code into beautiful, interactive documentation with our AI-powered platform.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">10x Faster</span>
                  </div>
                  <div className="flex items-center gap-2 text-violet-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-semibold">99% Accurate</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Feature Pills */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -top-6 -right-6 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-6 py-3"
            >
              <span className="text-emerald-400 font-semibold text-sm">Real-time Collaboration</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-violet-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-6 py-3"
            >
              <span className="text-violet-400 font-semibold text-sm">GitHub Integration</span>
            </motion.div>

            {/* Sparkles */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/4 right-1/4"
            >
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute bottom-1/3 left-1/4"
            >
              <Sparkles className="w-6 h-6 text-violet-400" />
            </motion.div>
          </div>
        </div>

        {/* Animated Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}
