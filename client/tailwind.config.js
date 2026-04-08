/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        'primary-dark': '#E55A25',
        secondary: '#2EC4B6',
        cream: '#FFF7F2',
        'text-dark': '#2D2D2D',
        'text-light': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};
