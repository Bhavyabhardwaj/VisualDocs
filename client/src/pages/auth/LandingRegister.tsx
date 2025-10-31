import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Code2, Github, Chrome, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔐 LandingRegister: Attempting registration...');
      await register(formData.email, formData.password, formData.name);
      console.log('✅ LandingRegister: Registration successful!');
      
      // Verify token was saved
      const savedToken = localStorage.getItem('token');
      console.log('✅ LandingRegister: Token in localStorage:', savedToken ? 'Found ✓' : 'NOT FOUND ✗');
      
      // Use React Router navigate instead of window.location.href
      navigate('/app/dashboard', { replace: true });
    } catch (err: unknown) {
      console.error('❌ LandingRegister: Registration error:', err);
      if (err && typeof err === 'object' && 'userMessage' in err) {
        setError(err.userMessage as string);
      } else if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { error?: string; message?: string } } };
        setError(axiosError.response?.data?.error || axiosError.response?.data?.message || 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = (provider: 'google' | 'github') => {
    // OAuth logic here
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F3] font-['Inter'] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E8D5C4]/30 to-transparent blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#D4E8E4]/30 to-transparent blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Registration Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border border-[rgba(55,50,47,0.08)]">
            
            {/* Mobile Logo */}
            <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#37322F] to-[#605A57] flex items-center justify-center">
                <Code2 className="w-6 h-6 text-[#F7F5F3]" />
              </div>
              <span className="text-2xl font-bold text-[#37322F]">VisualDocs</span>
            </Link>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#37322F] mb-2">Create your account</h2>
              <p className="text-[#605A57]">Start documenting your code in minutes</p>
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
                onClick={() => handleOAuthSignup('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] font-medium hover:bg-[#F7F5F3] transition-colors duration-200"
              >
                <Chrome className="w-5 h-5" />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignup('github')}
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

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#605A57]" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] placeholder-[#9D9691] focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#605A57]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] placeholder-[#9D9691] focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#605A57]" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-[#F7F5F3] border border-[rgba(55,50,47,0.12)] rounded-xl text-[#37322F] placeholder-[#9D9691] focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/10 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-[rgba(55,50,47,0.12)] text-[#37322F] focus:ring-[#37322F]/20"
                />
                <span className="text-sm text-[#605A57] group-hover:text-[#37322F] transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-[#37322F] font-medium hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#37322F] font-medium hover:underline">Privacy Policy</a>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#37322F] text-white py-3 rounded-xl font-medium hover:bg-[#2F3037] transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Creating account...'
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[#605A57]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#37322F] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Branding & Info */}
        <div className="hidden lg:flex flex-col gap-8 order-1 lg:order-2">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#37322F] to-[#605A57] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-7 h-7 text-[#F7F5F3]" />
              </div>
              <span className="text-3xl font-bold text-[#37322F]">VisualDocs</span>
            </Link>
            
            <h1 className="text-5xl font-bold text-[#37322F] mb-4 leading-tight">
              Join thousands of developers
              <span className="block bg-gradient-to-r from-[#37322F] to-[#605A57] bg-clip-text text-transparent">
                building better docs
              </span>
            </h1>
            
            <p className="text-xl text-[#605A57] leading-relaxed">
              Start your free trial today. No credit card required.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-4">
            {[
              { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Intelligent code documentation' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Your code stays private' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Generate docs in seconds' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center group-hover:bg-white transition-colors duration-300 flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-[#37322F]" />
                </div>
                <div>
                  <div className="font-semibold text-[#37322F]">{feature.title}</div>
                  <div className="text-sm text-[#605A57]">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[rgba(55,50,47,0.08)]">
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-[#37322F] mb-3 italic">
              "VisualDocs transformed how we document our codebase. It's like having a documentation expert on the team."
            </p>
            <div className="text-sm text-[#605A57]">
              <div className="font-semibold text-[#37322F]">Sarah Chen</div>
              <div>Engineering Lead at TechStart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
