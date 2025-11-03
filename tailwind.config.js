/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'brand-dark': '#0A0A0A',
        'brand-surface': '#141414',
        'brand-surface-light': '#1F1F1F',
        'brand-primary': '#007BFF',
        'brand-secondary': '#0056b3',
        'brand-text-primary': '#EAEAEA',
        'brand-text-secondary': '#888888',
      },
      boxShadow: {
        'glow': '0 0 15px 0 rgba(0, 123, 255, 0.1)',
        'glow-lg': '0 0 30px 0 rgba(0, 123, 255, 0.15)',
      }
    },
  },
  plugins: [],
}
