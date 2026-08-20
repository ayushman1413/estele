/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f7f6f3',
          100: '#ecebe5',
          200: '#d8d6cc',
          300: '#a9a59b',
          500: '#5b574d',
          700: '#2c2a26',
          900: '#15140f',
        },
        gold: {
          50:  '#fbf7ec',
          100: '#f1e8c9',
          300: '#d8b86a',
          500: '#b48a3a',
          700: '#7a5b1f',
        },
      },
      boxShadow: {
        soft: '0 12px 40px -16px rgba(20, 18, 12, 0.18)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        shimmer: 'shimmer 2.4s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
