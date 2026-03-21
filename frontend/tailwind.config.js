/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1FA7D6',
        primaryDark: '#168bb3',
        primaryLight: '#6ec9e6'
      }
    },
  },
  plugins: [],
};

