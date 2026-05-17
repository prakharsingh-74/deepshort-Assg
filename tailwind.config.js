/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface hierarchy — each layer is slightly lighter (Material Design 3 elevation)
        surface: {
          base:  '#0c0c0f',   // page background
          1:     '#111115',   // card
          2:     '#18181d',   // elevated card
          3:     '#1f1f26',   // hover / selected
          4:     '#26262f',   // tooltip / popover
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          strong:  'rgba(255,255,255,0.12)',
          focus:   'rgba(245,158,11,0.5)',
        },
        // Text follows 87% / 60% / 38% / 20% opacity rules
        ink: {
          1: 'rgba(240,240,245,0.92)',  // headings
          2: 'rgba(240,240,245,0.60)',  // body
          3: 'rgba(240,240,245,0.38)',  // captions
          4: 'rgba(240,240,245,0.20)',  // disabled
        },
        // Single accent color — used sparingly
        amber: {
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Semantic status colors
        red:   { 400: '#f87171', 500: '#ef4444' },
        green: { 400: '#4ade80', 500: '#22c55e' },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        sm:  '6px',
        md:  '10px',
        lg:  '14px',
        xl:  '18px',
        '2xl': '22px',
      },
      boxShadow: {
        'card':   '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'modal':  '0 24px 48px rgba(0,0,0,0.7)',
        'glow-sm':'0 0 16px rgba(245,158,11,0.12)',
        'glow':   '0 0 32px rgba(245,158,11,0.18)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease both',
        'slide-up':   'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right':'slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'none' } },
        slideRight:{ from: { opacity: 0, transform: 'translateX(24px)' }, to: { opacity: 1, transform: 'none' } },
        shimmer:   { from: { backgroundPosition: '200% 0' }, to: { backgroundPosition: '-200% 0' } },
      },
    },
  },
  plugins: [],
};
