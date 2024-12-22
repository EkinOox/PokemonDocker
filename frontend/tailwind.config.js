/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "!./node_modules/**",
  ],
  theme: {
    extend: {
      colors: {
        main: '#f8c400',
        secondary: '#01679c',
      },
      height: {
        '100': '35rem',
      },
    },
  },
  plugins: [],
}

