/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: '#f4e4bc',
        'parchment-dark': '#e8d5a3',
        mystic: {
          50: '#faf5eb',
          100: '#f0e4d0',
          200: '#e0c9a0',
          300: '#d4b07a',
          400: '#c99855',
          500: '#b8863d',
          600: '#9a6d32',
          700: '#7c552a',
          800: '#5e3d22',
          900: '#4a3119',
          950: '#2d1b0e'
        },
        gold: {
          100: '#fef7e0',
          200: '#fcedb8',
          300: '#f9dc7a',
          400: '#f5cb3c',
          500: '#d4a84b',
          600: '#b8912e',
          700: '#966e20',
          800: '#734c17',
          900: '#4a3110'
        },
        emerald: {
          mystical: '#1a4d3e',
          dark: '#0f2e26',
          light: '#2a6b55'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        decorative: ['Cinzel', 'Georgia', 'serif']
      },
      backgroundImage: {
        'parchment-texture': "url('/textures/parchment.png')",
        'mystic-gradient': 'radial-gradient(ellipse at center, #2a1f14 0%, #1a1410 100%)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'feather-fall': 'feather-fall 10s linear infinite',
        'card-reveal': 'card-reveal 0.8s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' }
        },
        'feather-fall': {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
        },
        'card-reveal': {
          '0%': { transform: 'perspective(1000px) rotateY(180deg)', opacity: '0' },
          '100%': { transform: 'perspective(1000px) rotateY(0deg)', opacity: '1' }
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 75, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 75, 0.6)' }
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      }
    },
  },
  plugins: [],
}
