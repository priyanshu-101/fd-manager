/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#0A0A0F',
          900: '#0F0F18',
          800: '#161622',
          700: '#1E1E2E',
          600: '#2A2A3D',
          500: '#3D3D5C',
          400: '#6B6B8A',
          300: '#9494B0',
          200: '#C2C2D6',
          100: '#E8E8F0',
          50:  '#F5F5FA',
        },
        gold: {
          600: '#B8860B',
          500: '#D4A017',
          400: '#E8B84B',
          300: '#F2CC7A',
          200: '#F7E0A8',
          100: '#FBF0D0',
        },
        emerald: {
          700: '#064E3B',
          600: '#047857',
          500: '#059669',
          400: '#34D399',
          100: '#D1FAE5',
        },
        crimson: {
          700: '#991B1B',
          600: '#B91C1C',
          500: '#EF4444',
          100: '#FEE2E2',
        },
        amber: {
          700: '#92400E',
          600: '#B45309',
          500: '#F59E0B',
          100: '#FEF3C7',
        },
        sky: {
          700: '#0369A1',
          600: '#0284C7',
          500: '#0EA5E9',
          100: '#E0F2FE',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'card': '0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)',
        'glow-gold': '0 0 20px rgba(212,160,23,0.25)',
        'glow-emerald': '0 0 20px rgba(52,211,153,0.2)',
        'inner-gold': 'inset 0 1px 0 rgba(212,160,23,0.15)',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, hsla(240,60%,8%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(240,50%,6%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(240,55%,7%,1) 0px, transparent 50%)',
        'card-surface': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'gold-shimmer': 'linear-gradient(135deg, #D4A017 0%, #E8B84B 50%, #D4A017 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'fade-in': 'fadeIn 0.3s ease both',
        'slide-in': 'slideIn 0.35s ease both',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
