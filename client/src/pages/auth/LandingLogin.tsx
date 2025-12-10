import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Code2, Github, Chrome, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingLogin() {
  console.log('🎬 LandingLogin component rendered/mounted');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // TEST: Verify localStorage works on component mount
  React.useEffect(() => {
    console.log('🧪 TEST: Checking if localStorage works...');
    try {
      localStorage.setItem('test-key', 'test-value');
      const retrieved = localStorage.getItem('test-key');
      console.log('🧪 TEST: localStorage.setItem() worked:', retrieved === 'test-value' ? 'YES ✓' : 'NO ✗');
      localStorage.removeItem('test-key');
      
      // Check if authToken exists from previous login
      const existingToken = localStorage.getItem('authToken');
      console.log('🧪 TEST: Existing token found:', existingToken ? 'YES (length: ' + existingToken.length + ')' : 'NO');
    } catch (e) {
      console.error('🧪 TEST: localStorage is BROKEN:', e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔐 LandingLogin: Form submitted!');
      console.log('🔐 LandingLogin: Email:', email);
      console.log('🔐 LandingLogin: Password length:', password.length);
      console.log('🔐 LandingLogin: Token BEFORE login:', localStorage.getItem('authToken') ? 'EXISTS' : 'NONE');
      
      console.log('🔐 LandingLogin: Calling login()...');
      await login(email, password);
      console.log('✅ LandingLogin: Login completed!');
      
      // Verify token was saved
      const savedToken = localStorage.getItem('authToken');
      console.log('✅ LandingLogin: Token AFTER login:', savedToken ? 'Found ✓' : 'NOT FOUND ✗');
      
      if (!savedToken) {
        console.error('❌ LandingLogin: TOKEN WAS NOT SAVED!');
        throw new Error('Token was not saved properly. Please try again.');
      }
      
      // Get the return URL from location state, or default to dashboard
      const from = (location.state as any)?.from?.pathname || '/app/dashboard';
      console.log('✅ LandingLogin: Redirecting to:', from);
      
      // Use React Router navigate instead of window.location.href
      // This maintains the React state and doesn't cause a full page reload
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error('❌ LandingLogin: Login error:', err);
      if (err && typeof err === 'object' && 'userMessage' in err) {
        setError(err.userMessage as string);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
        setError(axiosError.response?.data?.error || axiosError.response?.data?.message || 'Invalid email or password');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    // Redirect to OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3004';
    console.log(`🔐 Redirecting to ${provider} OAuth at:`, `${apiUrl}/api/oauth/${provider}`);
    window.location.href = `${apiUrl}/api/oauth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-['Inter'] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E8D5C4]/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#D4E8E4]/30 to-transparent blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#37322F] to-[#605A57] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-7 h-7 text-[#F7F5F3]" />
              </div>
              <span className="text-3xl font-bold text-[#37322F]">VisualDocs</span>
            </Link>
            
            <h1 className="text-5xl font-bold text-[#37322F] mb-4 leading-tight">
              Transform your code into
              <span className="block bg-gradient-to-r from-[#37322F] to-[#605A57] bg-clip-text text-transparent">
                beautiful documentation
              </span>
            </h1>
            
            <p className="text-xl text-[#605A57] leading-relaxed">
              AI-powered documentation that understands your codebase and keeps your team in sync.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'AI-powered code analysis' },
              { icon: Code2, text: 'Real-time collaboration' },
              { icon: ArrowRight, text: 'Seamless Git integration' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center group-hover:bg-white transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-6 text-sm text-[#605A57]">
            <div>
              <div className="text-2xl font-bold text-[#37322F]">50K+</div>
              <div>Docs Generated</div>
            </div>
            <div className="w-px h-12 bg-[#37322F]/20"></div>
            <div>
              <div className="text-2xl font-bold text-[#37322F]">1000+</div>
              <div>Happy Teams</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-[rgba(55,50,47,0.08)]">
            
            {/* Mobile Logo */}
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#37322F] to-[#605A57] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-[#F7F5F3]" />
              </div>
              <span className="text-2xl font-bold text-[#37322F]">VisualDocs</span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#37322F] mb-2">Welcome back</h2>
              <p className="text-[#605A57]">Sign in to continue to your workspace</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] font-medium hover:bg-[#F7F5F3] transition-colors duration-200"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] font-medium hover:bg-[#F7F5F3] transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]"></div>
              <span className="text-sm text-[#605A57]">or</span>
              <div className="flex-1 h-px bg-[rgba(55,50,47,0.12)]"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#605A57]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] placeholder-[#9D9691] focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#605A57]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] placeholder-[#9D9691] focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[rgba(55,50,47,0.12)] text-[#37322F] focus:ring-[#37322F]/20"
                  />
                  <span className="text-sm text-[#605A57] group-hover:text-[#37322F] transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#37322F] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#37322F] text-white py-3 rounded-xl font-medium hover:bg-[#2F3037] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Signing in...'
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[#605A57]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#37322F] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-sm text-[#605A57]">
            By continuing, you agree to our{' '}
            <a href="#" className="text-[#37322F] hover:underline">Terms</a>
            {' '}and{' '}
            <a href="#" className="text-[#37322F] hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
