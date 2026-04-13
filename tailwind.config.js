/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1B4332',
        'brand-mid': '#2D6A4F',
        'brand-green': '#40916C',
        'brand-light': '#74C69D',
        'brand-pale': '#B7E4C7',
        'brand-cream': '#FDF6EC',
        'cream': '#FAF3E0',
        'cream-dark': '#F0E6D0',
        'text-dark': '#1B4332',
        'text-mid': '#52796F',
        'text-light': '#95A5A0',
        'danger': '#E63946',
        'warn': '#E9C46A',
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'icon': '0 8px 24px -4px rgba(27, 67, 50, 0.15)',
        'card': '0 4px 16px -2px rgba(27, 67, 50, 0.08)',
        'card-hover': '0 8px 30px -4px rgba(27, 67, 50, 0.14)',
        'btn': '0 4px 14px -2px rgba(27, 67, 50, 0.2)',
      }
    },
  },
  plugins: [],
}
