import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#082b44',
          50: '#e8f0f7',
          100: '#c5d9ea',
          200: '#9bbdda',
          300: '#6f9fc9',
          400: '#4d87bc',
          500: '#2b6faf',
          600: '#1d5a94',
          700: '#134776',
          800: '#0d3459',
          900: '#082b44',
          950: '#041624',
        },
        gold: {
          DEFAULT: '#ebaf57',
          50: '#fef9ee',
          100: '#fdf0d5',
          200: '#fbe0aa',
          300: '#f7ca74',
          400: '#f3b24b',
          500: '#ebaf57',
          600: '#d4912a',
          700: '#b07322',
          800: '#8d5b21',
          900: '#744c1f',
          950: '#40270e',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      clipPath: {
        hex: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      },
      borderRadius: {
        beez: '10px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.2)',
        'card-gold': '0 0 24px rgba(235,175,87,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
