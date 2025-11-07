/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
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
        // Landing Page Theme - UNIFIED ACROSS ENTIRE APP
        brand: {
          bg: '#F7F5F3',           // Warm off-white background
          primary: '#37322F',       // Dark brown (primary buttons, text)
          secondary: '#322D2B',     // Darker brown
          tertiary: '#49423D',      // Medium brown
          muted: '#605A57',         // Light brown for muted text
          accent: '#2F3037',        // Accent color
        },
        
        // Override default colors to match landing page
        background: '#F7F5F3',
        foreground: '#37322F',
        muted: {
          DEFAULT: '#E8D5C4',      // Warm muted background
          foreground: '#605A57',    // Muted text
        },
        border: 'rgba(55,50,47,0.12)',
        input: 'rgba(55,50,47,0.12)',
        ring: '#37322F',
        
        // Neutral scale matching landing page warmth
        neutral: {
          50: '#F7F5F3',
          100: '#EDE9E6',
          200: '#E0DEDB',
          300: '#C9C5C2',
          400: '#A3A09D',
          500: '#7D7A77',
          600: '#605A57',
          700: '#49423D',
          800: '#37322F',
          900: '#322D2B',
          950: '#1A1816',
        },
        
        // Status colors (keep subtle)
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
        
        // Primary for apps (dark brown based)
        primary: {
          50: '#F7F5F3',
          100: '#EDE9E6',
          500: '#37322F',
          600: '#322D2B',
          700: '#1A1816',
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
