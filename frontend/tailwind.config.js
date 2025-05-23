/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF', // Replace with your main primary color
        secondary: '#F59E0B', // Replace with your secondary primary color
      },
    },
  },
  plugins: [],
}

