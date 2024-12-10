/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#1a1b1e',
          card: '#25262b',
          text: '#c1c2c5',
          border: '#373A40'
        }
      }
    }
  },
  plugins: []
};