import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SmartSimpleBrilliant from '@/components/smart-simple-brilliant';
import YourWorkInSync from '@/components/your-work-in-sync';
import EffortlessIntegration from '@/components/effortless-integration-updated';
import NumbersThatSpeak from '@/components/numbers-that-speak';
import TestimonialsSection from '@/components/testimonials-section';
import FaqSection from '@/components/faq-section';
import PricingSection from '@/components/pricing-section';
import CtaSection from '@/components/cta-section';
import FooterSection from '@/components/footer-section';

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, stop observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return { ref, isVisible };
}

// Custom hook for parallax effect
function useParallax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    
    // Throttle scroll events for better performance
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  return offset;
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Reusable Badge Component with pulse animation
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs animate-fade-in hover:shadow-md transition-shadow duration-300">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center animate-pulse-slow">{icon}</div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  );
}

// FeatureCard component with enhanced hover animations
function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="group w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 relative border-b md:border-b-0 last:border-b-0 transition-all duration-300 border-l-0 border-r-0 md:border border-[#E0DEDB]/80 hover:bg-white/50 hover:shadow-md"
    >
      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans group-hover:text-[#322D2B] transition-colors">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  );
}

export default function NewLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHero, setActiveHero] = useState(0);
  const parallaxOffset = useParallax();

  // Hero content variations
  const heroContent = [
    {
      title: ['Transform code into', 'beautiful documentation', 'instantly'],
      subtitle: 'Automate your documentation workflow with AI-powered analysis. Generate comprehensive docs from your codebase in seconds.',
      cta: 'Get Started Free'
    },
    {
      title: ['Ship better docs', 'without the', 'hassle'],
      subtitle: 'Stop writing documentation manually. Let AI understand your code and create professional docs automatically.',
      cta: 'Try It Now'
    },
    {
      title: ['Keep your team', 'aligned with', 'smart docs'],
      subtitle: 'Real-time collaboration meets AI intelligence. Update once, sync everywhere, keep everyone on the same page.',
      cta: 'Start Collaborating'
    }
  ];

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate hero content every 5 seconds
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroContent.length);
    }, 5000);

    return () => clearInterval(heroInterval);
  }, [heroContent.length]);
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      {/* Animated gradient orbs background with subtle parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float will-change-transform"
          style={{ transform: `translate3d(0, ${parallaxOffset * 0.05}px, 0)` }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl animate-float will-change-transform" 
          style={{ animationDelay: '2s', animationDuration: '8s', transform: `translate3d(0, ${parallaxOffset * 0.08}px, 0)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float will-change-transform" 
          style={{ animationDelay: '4s', animationDuration: '10s', transform: `translate3d(0, ${parallaxOffset * 0.06}px, 0)` }}
        ></div>
      </div>
      
      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Enhanced Navigation with scroll effects */}
            <div className={`w-full h-12 sm:h-14 md:h-16 lg:h-[84px] absolute left-0 top-0 flex justify-center items-center z-20 px-6 sm:px-8 md:px-12 lg:px-0 transition-all duration-300 ${
              scrolled ? 'sticky top-0 backdrop-blur-md bg-[#F7F5F3]/80 shadow-lg' : ''
            }`}>
              <div className="w-full h-0 absolute left-0 top-6 sm:top-7 md:top-8 lg:top-[42px] border-t border-[rgba(55,50,47,0.12)] shadow-[0px_1px_0px_white]"></div>

              <div className={`w-full max-w-[calc(100%-32px)] sm:max-w-[calc(100%-48px)] md:max-w-[calc(100%-64px)] lg:max-w-[700px] lg:w-[700px] h-10 sm:h-11 md:h-12 py-1.5 sm:py-2 px-3 sm:px-4 md:px-4 pr-2 sm:pr-3 bg-[#F7F5F3] backdrop-blur-sm shadow-[0px_0px_0px_2px_white] overflow-hidden rounded-[50px] flex justify-between items-center relative z-30 transition-all duration-300 ${
                scrolled ? 'shadow-lg hover:shadow-xl' : ''
              }`}>
                <div className="flex justify-center items-center">
                  <div className="flex justify-start items-center">
                    <div className="flex flex-col justify-center text-[#2F3037] text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-5 font-sans">
                      VisualDocs
                    </div>
                  </div>
                  <div className="pl-3 sm:pl-4 md:pl-5 lg:pl-5 flex justify-start items-start hidden sm:flex flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
                    <div className="flex justify-start items-center group cursor-pointer relative">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans group-hover:text-[#2F3037] transition-colors">
                        Features
                      </div>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F3037] group-hover:w-full transition-all duration-300"></div>
                    </div>
                    <div className="flex justify-start items-center group cursor-pointer relative">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans group-hover:text-[#2F3037] transition-colors">
                        Pricing
                      </div>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F3037] group-hover:w-full transition-all duration-300"></div>
                    </div>
                    <div className="flex justify-start items-center group cursor-pointer relative">
                      <div className="flex flex-col justify-center text-[rgba(49,45,43,0.80)] text-xs md:text-[13px] font-medium leading-[14px] font-sans group-hover:text-[#2F3037] transition-colors">
                        Docs
                      </div>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2F3037] group-hover:w-full transition-all duration-300"></div>
                    </div>
                  </div>
                </div>
                <div className="h-6 sm:h-7 md:h-8 flex justify-start items-start gap-2 sm:gap-3">
                  <Link 
                    to="/login" 
                    className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-white shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center hover:bg-[#F7F5F3] transition-colors duration-200 group"
                  >
                    <div className="flex flex-col justify-center text-[#37322F] text-xs md:text-[13px] font-medium leading-5 font-sans group-hover:text-[#2F3037]">
                      Log in
                    </div>
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-2 sm:px-3 md:px-[14px] py-1 sm:py-[6px] bg-[#37322F] shadow-[0px_1px_2px_rgba(55,50,47,0.12)] overflow-hidden rounded-full flex justify-center items-center hover:bg-[#2F3037] transition-colors duration-200 group"
                  >
                    <div className="flex flex-col justify-center text-white text-xs md:text-[13px] font-medium leading-5 font-sans">
                      Sign up
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[216px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full relative">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 relative z-10">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  {/* Rotating Hero Titles */}
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center relative min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[360px] flex items-center justify-center">
                    {heroContent.map((content, index) => (
                      <h1
                        key={index}
                        className={`absolute inset-0 text-[#37322F] text-[28px] xs:text-[32px] sm:text-[40px] md:text-[56px] lg:text-[80px] font-normal leading-[1.15] sm:leading-[1.2] md:leading-[1.25] lg:leading-[1.2] font-serif px-2 sm:px-4 md:px-0 transition-all duration-700 ease-in-out flex flex-col items-center justify-center ${
                          activeHero === index
                            ? 'opacity-100 scale-100 blur-0'
                            : 'opacity-0 scale-95 blur-sm pointer-events-none'
                        }`}
                      >
                        {content.title.map((line, lineIndex) => (
                          <span
                            key={lineIndex}
                            className={`block transition-all duration-700 ${
                              activeHero === index ? 'translate-y-0' : 'translate-y-4'
                            }`}
                            style={{
                              transitionDelay: activeHero === index ? `${lineIndex * 100}ms` : '0ms'
                            }}
                          >
                            {line}
                          </span>
                        ))}
                      </h1>
                    ))}
                  </div>

                  {/* Rotating Subtitles */}
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center relative min-h-[80px] sm:min-h-[90px] md:min-h-[100px] flex items-center justify-center">
                    {heroContent.map((content, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 flex justify-center flex-col text-[rgba(55,50,47,0.80)] text-sm sm:text-base md:text-lg lg:text-xl leading-[1.5] sm:leading-[1.55] md:leading-[1.6] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 font-medium transition-all duration-700 ease-in-out ${
                          activeHero === index
                            ? 'opacity-100 scale-100 blur-0 translate-y-0'
                            : 'opacity-0 scale-95 blur-sm translate-y-4 pointer-events-none'
                        }`}
                        style={{
                          transitionDelay: activeHero === index ? '200ms' : '0ms'
                        }}
                      >
                        {content.subtitle}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                {/* Rotating CTA Buttons */}
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4 relative min-h-[48px] sm:min-h-[52px] md:min-h-[56px]">
                  {heroContent.map((content, index) => (
                    <div
                      key={index}
                      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out ${
                        activeHero === index
                          ? 'opacity-100 scale-100 blur-0'
                          : 'opacity-0 scale-90 blur-sm pointer-events-none'
                      }`}
                      style={{
                        transitionDelay: activeHero === index ? '300ms' : '0ms'
                      }}
                    >
                      <div className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] relative bg-[#37322F] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] overflow-hidden rounded-full flex justify-center items-center cursor-pointer hover:bg-[#2A2520] transition-all duration-300 hover:scale-105 hover:shadow-lg group whitespace-nowrap">
                        <div className="w-20 sm:w-24 md:w-28 lg:w-44 h-[41px] absolute left-0 top-[-0.5px] bg-gradient-to-b from-[rgba(255,255,255,0)] to-[rgba(0,0,0,0.10)] mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                        <div className="flex flex-col justify-center text-white text-sm sm:text-base md:text-[15px] font-medium leading-5 font-sans relative z-10">
                          {content.cta}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 items-center">
                  {heroContent.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveHero(index)}
                      className={`transition-all duration-300 rounded-full ${
                        activeHero === index
                          ? 'w-8 h-2 bg-[#37322F]'
                          : 'w-2 h-2 bg-[#E0DEDB] hover:bg-[#A39D98] hover:scale-125'
                      }`}
                      aria-label={`View hero ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                {/* Animated floating particles - no parallax to prevent shifting */}
                <div 
                  className="absolute -top-20 left-10 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-40" 
                  style={{ animationDuration: '3s' }}
                ></div>
                <div 
                  className="absolute -top-32 right-20 w-3 h-3 bg-orange-400 rounded-full animate-float opacity-30" 
                  style={{ animationDuration: '4s', animationDelay: '1s' }}
                ></div>
                <div 
                  className="absolute -top-10 left-1/3 w-1.5 h-1.5 bg-amber-400 rounded-full animate-float opacity-50" 
                  style={{ animationDuration: '5s', animationDelay: '0.5s' }}
                ></div>
                <div 
                  className="absolute -top-40 right-1/3 w-2.5 h-2.5 bg-teal-400 rounded-full animate-float opacity-35" 
                  style={{ animationDuration: '6s', animationDelay: '2s' }}
                ></div>
                
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
                  style={{
                    filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
                  }}
                />
              </div>
            </div>

            {/* Dashboard Preview Section - Right after Hero */}
            <div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0 animate-fade-in">
              {/* Floating decorative elements */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
              
              <div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start hover:shadow-2xl transition-all duration-500 group relative">
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: 'linear-gradient(145deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1), rgba(236,72,153,0.1))',
                    filter: 'blur(1px)',
                  }}
                ></div>
                
                {/* Dashboard Content */}
                <div className="self-stretch flex-1 flex justify-start items-start relative z-10">
                  {/* Main Content - Single Static Dashboard Preview */}
                  <div className="w-full h-full flex items-center justify-center bg-[#F7F5F3]">
                    <div className="relative w-full h-full overflow-hidden p-4 sm:p-6 md:p-8 lg:p-12">
                      {/* Elegant Dashboard Preview - Matches Landing Theme */}
                      <div className="w-full h-full bg-white rounded-lg shadow-[0px_2px_8px_rgba(55,50,47,0.12)] border border-[rgba(55,50,47,0.08)] overflow-hidden">
                        {/* Dashboard Header */}
                        <div className="border-b border-[#E0DEDB] bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                              <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                            </div>
                            <div className="hidden sm:block text-[#37322F] text-sm font-medium font-sans">
                              Project Documentation
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="hidden md:flex items-center gap-2 bg-[#F7F5F3] px-3 py-1.5 rounded-full border border-[#E0DEDB]">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium text-[#605A57]">Live</span>
                            </div>
                          </div>
                        </div>

                        {/* Dashboard Content Grid */}
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-[#FAFAF9]">
                          {/* Stats Cards Row */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)]">
                              <div className="text-xs text-[#605A57] font-medium mb-1">Total Files</div>
                              <div className="text-xl sm:text-2xl font-bold text-[#37322F]">247</div>
                              <div className="text-xs text-emerald-600 mt-1">↑ 12% this week</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)]">
                              <div className="text-xs text-[#605A57] font-medium mb-1">Code Quality</div>
                              <div className="text-xl sm:text-2xl font-bold text-[#37322F]">94%</div>
                              <div className="text-xs text-emerald-600 mt-1">↑ 3% improved</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)]">
                              <div className="text-xs text-[#605A57] font-medium mb-1">Complexity</div>
                              <div className="text-xl sm:text-2xl font-bold text-[#37322F]">4.2</div>
                              <div className="text-xs text-amber-600 mt-1">Optimal range</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)]">
                              <div className="text-xs text-[#605A57] font-medium mb-1">Team</div>
                              <div className="text-xl sm:text-2xl font-bold text-[#37322F]">12</div>
                              <div className="text-xs text-[#605A57] mt-1">Active members</div>
                            </div>
                          </div>

                          {/* Main Content Area */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Left: Recent Activity */}
                            <div className="lg:col-span-2 bg-white rounded-lg border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)] overflow-hidden">
                              <div className="border-b border-[#E0DEDB] px-4 py-3 bg-[#FAFAF9]">
                                <h3 className="text-sm font-semibold text-[#37322F]">Recent Analysis</h3>
                              </div>
                              <div className="p-4 space-y-3">
                                {/* Progress bars with landing page colors */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#605A57] font-medium">src/components/Header.tsx</span>
                                    <span className="text-[#37322F] font-semibold">98%</span>
                                  </div>
                                  <div className="w-full h-2 bg-[#E0DEDB] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#37322F] to-[#49423D] rounded-full" style={{ width: '98%' }}></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#605A57] font-medium">src/utils/helpers.ts</span>
                                    <span className="text-[#37322F] font-semibold">92%</span>
                                  </div>
                                  <div className="w-full h-2 bg-[#E0DEDB] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#37322F] to-[#49423D] rounded-full" style={{ width: '92%' }}></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#605A57] font-medium">src/pages/Dashboard.tsx</span>
                                    <span className="text-[#37322F] font-semibold">87%</span>
                                  </div>
                                  <div className="w-full h-2 bg-[#E0DEDB] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#37322F] to-[#49423D] rounded-full" style={{ width: '87%' }}></div>
                                  </div>
                                </div>

                                {/* Code snippet preview */}
                                <div className="mt-4 bg-[#F7F5F3] rounded-md p-3 border border-[#E0DEDB] font-mono text-xs">
                                  <div className="text-[#605A57]">
                                    <span className="text-purple-600">function</span>{' '}
                                    <span className="text-blue-600">analyzeCode</span>
                                    <span className="text-[#37322F]">(</span>
                                    <span className="text-orange-600">files</span>
                                    <span className="text-[#37322F]">) {'{'}</span>
                                  </div>
                                  <div className="text-[#605A57] ml-4">
                                    <span className="text-purple-600">return</span>{' '}
                                    <span className="text-green-600">"Documentation generated"</span>
                                    <span className="text-[#37322F]">;</span>
                                  </div>
                                  <div className="text-[#605A57]">
                                    <span className="text-[#37322F]">{'}'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right: Team Activity */}
                            <div className="bg-white rounded-lg border border-[#E0DEDB] shadow-[0px_1px_3px_rgba(55,50,47,0.08)] overflow-hidden">
                              <div className="border-b border-[#E0DEDB] px-4 py-3 bg-[#FAFAF9]">
                                <h3 className="text-sm font-semibold text-[#37322F]">Team Activity</h3>
                              </div>
                              <div className="p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5744] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                    SK
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-[#37322F]">Sarah updated docs</div>
                                    <div className="text-xs text-[#605A57] truncate">API documentation revised</div>
                                    <div className="text-xs text-[#A39D98] mt-1">2 min ago</div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9B8B7E] to-[#7B6B5E] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                    MC
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-[#37322F]">Mike added files</div>
                                    <div className="text-xs text-[#605A57] truncate">New component analysis</div>
                                    <div className="text-xs text-[#A39D98] mt-1">12 min ago</div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#AB9B8E] to-[#8B7B6E] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                    AL
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-[#37322F]">Alex reviewed</div>
                                    <div className="text-xs text-[#605A57] truncate">Code quality approved</div>
                                    <div className="text-xs text-[#A39D98] mt-1">1 hour ago</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Section with Diagonal Lines */}
            <div className="self-stretch border-t border-[#E0DEDB] border-b border-[#E0DEDB] flex justify-center items-start">
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                {/* Left decorative pattern */}
                <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="flex-1 px-0 sm:px-2 md:px-0 flex flex-col md:flex-row justify-center items-stretch gap-0">
                {/* Feature Cards */}
                <FeatureCard
                  title="AI-Powered Analysis"
                  description="Automatically analyze your codebase and generate comprehensive documentation with intelligent AI insights."
                />
                <FeatureCard
                  title="Real-Time Collaboration"
                  description="Work together seamlessly with your team. Share, review, and update documentation in real-time."
                />
                <FeatureCard
                  title="Version Control Integration"
                  description="Sync with Git repositories and automatically update docs when code changes. Stay always in sync."
                />
              </div>

              <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                {/* Right decorative pattern */}
                <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Proof Section */}
            <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
              <div className="self-stretch px-4 sm:px-6 md:px-24 py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none animate-fade-in">
                  <Badge
                    icon={
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="3" width="4" height="6" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="7" y="1" width="4" height="8" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="2" y="4" width="1" height="1" fill="#37322F" />
                        <rect x="3.5" y="4" width="1" height="1" fill="#37322F" />
                        <rect x="2" y="5.5" width="1" height="1" fill="#37322F" />
                        <rect x="3.5" y="5.5" width="1" height="1" fill="#37322F" />
                        <rect x="8" y="2" width="1" height="1" fill="#37322F" />
                        <rect x="9.5" y="2" width="1" height="1" fill="#37322F" />
                        <rect x="8" y="3.5" width="1" height="1" fill="#37322F" />
                        <rect x="9.5" y="3.5" width="1" height="1" fill="#37322F" />
                        <rect x="8" y="5" width="1" height="1" fill="#37322F" />
                        <rect x="9.5" y="5" width="1" height="1" fill="#37322F" />
                      </svg>
                    }
                    text="Social Proof"
                  />
                  <div className="w-full max-w-[472.55px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                    Trusted by developers worldwide
                  </div>
                  <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                    Join thousands of teams who've transformed their documentation workflow
                    <br className="hidden sm:block" />
                    with VisualDocs intelligent automation and seamless collaboration.
                  </div>
                  
                  {/* Animated Stats Counter */}
                  <div className="w-full grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8">
                    <div className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#322D2B] group-hover:scale-110 transition-transform">
                        <AnimatedCounter end={50} suffix="K+" />
                      </div>
                      <div className="text-xs sm:text-sm text-[#605A57] text-center">Docs Generated</div>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#322D2B] group-hover:scale-110 transition-transform">
                        <AnimatedCounter end={95} suffix="%" />
                      </div>
                      <div className="text-xs sm:text-sm text-[#605A57] text-center">Time Saved</div>
                    </div>
                    <div className="flex flex-col items-center gap-2 group cursor-default">
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#322D2B] group-hover:scale-110 transition-transform">
                        <AnimatedCounter end={1000} suffix="+" />
                      </div>
                      <div className="text-xs sm:text-sm text-[#605A57] text-center">Happy Teams</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Grid with Animations */}
              <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t border-b-0">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Left decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                  {/* Logo Grid - 8 company logos with staggered animation */}
                  {['DevHub', 'CodeFlow', 'TechStart', 'BuildIt', 'DataSync', 'CloudNine', 'GitTeam', 'APIFirst'].map((companyName, index) => {
                    const isMobileFirstColumn = index % 2 === 0;
                    const isDesktopFirstColumn = index % 4 === 0;
                    const isDesktopLastColumn = index % 4 === 3;
                    const isDesktopTopRow = index < 4;
                    const isDesktopBottomRow = index >= 4;

                    return (
                      <div
                        key={index}
                        className={`
                          h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex justify-center items-center gap-1 xs:gap-2 sm:gap-3
                          border-b border-[rgba(227,226,225,0.5)]
                          ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                          ${index >= 6 ? "border-b" : ""}
                          ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                          sm:border-r-[0.5px] sm:border-l-0
                          ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                          ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                          ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                          ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}
                          border-[#E3E2E1]
                          group hover:bg-white/50 transition-all duration-300
                          animate-fade-in
                        `}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 relative shadow-[0px_-4px_8px_rgba(255,255,255,0.64)_inset] overflow-hidden rounded-full transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                          <img 
                            src="/horizon-icon.svg" 
                            alt="Partner Company" 
                            className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                          />
                        </div>
                        <div className="text-center flex justify-center flex-col text-[#37322F] text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight md:leading-9 font-sans group-hover:text-[#2F3037] transition-colors duration-300">
                          {companyName}
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#322D2B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-lg">
                          Powered by VisualDocs
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#322D2B]"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Right decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Section */}
            <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
              {/* Header Section */}
              <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                  <Badge
                    icon={
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="7" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="1" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                        <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                      </svg>
                    }
                    text="Bento grid"
                  />
                  <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                    Built for absolute clarity and focused work
                  </div>
                  <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                    Stay focused with tools that organize, connect
                    <br />
                    and turn information into confident decisions.
                  </div>
                </div>
              </div>

              {/* Bento Grid Content */}
              <div className="self-stretch flex justify-center items-start">
                <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                  {/* Left decorative pattern */}
                  <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                    {Array.from({ length: 200 }).map((_, i) => (
                      <div
                        key={i}
                        className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                      />
                    ))}
                  </div>
                </div>                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Top Left - AI-Powered Documentation */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 group hover:bg-white/30 transition-all duration-500 animate-fade-in">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans group-hover:text-[#2F3037] transition-colors duration-300">
                          AI-Powered Documentation
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Intelligent analysis transforms your codebase into comprehensive, beautiful documentation automatically.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                        <SmartSimpleBrilliant
                          width="100%"
                          height="100%"
                          theme="light"
                          className="scale-50 sm:scale-65 md:scale-75 lg:scale-90"
                        />
                      </div>
                    </div>

                    {/* Top Right - Real-Time Collaboration */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 group hover:bg-white/30 transition-all duration-500 animate-fade-in" style={{ animationDelay: '100ms' }}>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl group-hover:text-[#2F3037] transition-colors duration-300">
                          Real-Time Collaboration
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Work together seamlessly with live updates and shared documentation across your entire team.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                        <YourWorkInSync
                          width="400"
                          height="250"
                          theme="light"
                          className="scale-60 sm:scale-75 md:scale-90"
                        />
                      </div>
                    </div>

                    {/* Bottom Left - Version Control Integration */}
                    <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent group hover:bg-white/30 transition-all duration-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans group-hover:text-[#2F3037] transition-colors duration-300">
                          Version Control Integration
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Seamlessly sync with Git repositories and keep documentation updated with every code change.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent transform group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                          <EffortlessIntegration width={400} height={250} className="max-w-full max-h-full" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Bottom Right - Visual Code Analysis */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 group hover:bg-white/30 transition-all duration-500 animate-fade-in" style={{ animationDelay: '300ms' }}>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans group-hover:text-[#2F3037] transition-colors duration-300">
                          Visual Code Analysis
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          Transform complex codebases into clear visual diagrams and interactive documentation.
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative transform group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <NumbersThatSpeak
                            width="100%"
                            height="100%"
                            theme="light"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Sections */}
            <TestimonialsSection />
            <PricingSection />
            <FaqSection />
            <CtaSection />

            <FooterSection />
        </div>
      </div>
    </div>
  );
}
