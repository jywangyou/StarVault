/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e9edff',
          200: '#d6dcff',
          300: '#b5bfff',
          400: '#8b98ff',
          500: '#646cff',
          600: '#5056dd',
          700: '#4045b0',
          800: '#33388a',
          900: '#2a2f70',
        },
      },
      boxShadow: {
        card: '0 6px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}