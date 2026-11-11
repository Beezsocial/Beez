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
        // Palette Beez — valeurs définies une seule fois dans les variables
        // CSS de app/globals.css (:root, canaux RGB) ; ici on ne fait que les
        // nommer pour Tailwind, ce qui garde les modificateurs d'opacité (/10…).
        navy: {
          DEFAULT: 'rgb(var(--beez-navy-900) / <alpha-value>)', // fond principal
          950: 'rgb(var(--beez-navy-950) / <alpha-value>)', // fond le plus profond
          900: 'rgb(var(--beez-navy-900) / <alpha-value>)', // fond principal
          800: 'rgb(var(--beez-navy-800) / <alpha-value>)', // surfaces + texte sur cyan
          700: 'rgb(var(--beez-navy-700) / <alpha-value>)', // surfaces surélevées, champs
          500: 'rgb(var(--beez-navy-500) / <alpha-value>)', // bordures, séparateurs
        },
        muted: 'rgb(var(--beez-muted) / <alpha-value>)', // texte secondaire sur fond sombre
        accent: {
          DEFAULT: 'rgb(var(--beez-accent) / <alpha-value>)', // cyan principal
          2: 'rgb(var(--beez-accent-2) / <alpha-value>)', // survol / pressé, dégradés
          deep: 'rgb(var(--beez-accent-deep) / <alpha-value>)', // cyan sur fond blanc (bordures, icônes)
        },
        // Or : réservé au badge Founding Member (et au futur jeton Honey).
        gold: 'rgb(var(--beez-gold) / <alpha-value>)',
      },
      fontFamily: {
        // Outfit, unique police du site : chargée par next/font (app/layout.tsx),
        // exposée via --font-outfit. `heading` reste un alias pour les classes existantes.
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
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
        'card-accent': '0 0 24px rgb(var(--beez-accent) / 0.08)',
      },
    },
  },
  plugins: [],
}

export default config
