/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system', 
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        serif: [
          'Instrument Serif',
          'ui-serif',
          'Georgia',
          'serif'
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'monospace'
        ],
      },
      colors: {
        // Marketing Theme (Landing Page) - PRESERVED
        marketing: {
          dark: '#0a0a0f',
          primary: '#00d4aa',
          secondary: '#6366f1',
          accent: '#f59e0b',
        },
        
        // Premium App Interior (Linear/Vercel/Shadcn style)
        background: '#ffffff',
        foreground: '#0c0c0c',
        muted: {
          DEFAULT: '#f8f9fa',
          foreground: '#6c757d',
        },
        border: '#e9ecef',
        input: '#e9ecef',
        ring: '#0c0c0c',
        
        // Neutral scale (Shadcn-style)
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        
        // Subtle accent (minimal use)
        accent: {
          DEFAULT: '#f8f9fa',
          foreground: '#0c0c0c',
        },
        
        // Status colors (very subtle)
        success: {
          DEFAULT: '#198754',
          muted: '#d1e7dd',
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
        },
        warning: {
          DEFAULT: '#ffc107',
          muted: '#fff3cd',
          50: '#fffbeb', 
          500: '#f59e0b',
          600: '#d97706',
        },
        error: {
          DEFAULT: '#dc3545',
          muted: '#f8d7da',
          50: '#fef2f2',
          500: '#ef4444', 
          600: '#dc2626',
        },
        info: {
          DEFAULT: '#0dcaf0',
          muted: '#cff4fc',
        },
        
        // Primary for apps (black-based)
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          500: '#0c0c0c',
          600: '#000000',
        },
      },
      
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1.5': '0.375rem',  // 6px
        '2.5': '0.625rem',  // 10px
        '3.5': '0.875rem',  // 14px
      },
      
      borderRadius: {
        'lg': '0.5rem',     // 8px - standard
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
      },
      
      boxShadow: {
        // Minimal professional shadows
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.08)',
        'md': '0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'lg': '0 4px 6px -1px rgb(0 0 0 / 0.08)',
        'xl': '0 8px 12px -2px rgb(0 0 0 / 0.08)',
        'none': '0 0 #0000',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
