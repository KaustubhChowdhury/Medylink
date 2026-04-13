/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f3ff',
          100: '#e0e8ff',
          200: '#c7d5ff',
          300: '#a3baff',
          400: '#7b93ff',
          500: '#5a6dd8',
          600: '#3f51d9',
          700: '#3344c4',
          800: '#2c37a6',
          900: '#1f2668',
          950: '#161b3f',
        },
        accent: {
          50: '#fff5e6',
          100: '#ffe4b5',
          200: '#ffd98c',
          300: '#ffcd63',
          400: '#ffc240',
          500: '#ffb700',
          600: '#e6a500',
          700: '#cc9300',
          800: '#b38100',
          900: '#8a6600',
        },
      },
      boxShadow: {
        'premium': '0 20px 50px rgba(63, 81, 217, 0.15)',
        'card': '0 10px 30px rgba(31, 38, 104, 0.08)',
        'hover': '0 25px 60px rgba(63, 81, 217, 0.2)',
        'glow': '0 0 30px rgba(122, 147, 255, 0.3)',
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(135deg, #3f51d9 0%, #5a6dd8 50%, #1f2668 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ffb700 0%, #ffc240 100%)',
        'gradient-light': 'linear-gradient(135deg, #f0f3ff 0%, #fff5e6 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(122, 147, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(122, 147, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
