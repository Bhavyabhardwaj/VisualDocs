/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brutalist Monochromatic Palette
        black: "#000000",
        white: "#ffffff", 
        gray: {
          50: "#f9f9f9",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        },
        // Emerald Accent
        emerald: {
          DEFAULT: "#00C896",
          50: "#e6fffe",
          100: "#ccfffc",
          200: "#99fff8",
          300: "#66fff5",
          400: "#33fff1",
          500: "#00ffee",
          600: "#00C896",
          700: "#009570",
          800: "#00624a",
          900: "#003125",
        },
        // Status Colors
        success: "#00C896",
        warning: "#FFB800", 
        error: "#FF4747",
        info: "#4F46E5",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
        accent: ['Satoshi', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'brutalist': '4px 4px 0px #000000',
        'brutalist-lg': '8px 8px 0px #000000',
        'brutalist-emerald': '4px 4px 0px #00C896',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
  ],
}
