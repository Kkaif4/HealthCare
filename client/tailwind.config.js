/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#a855f7',
        accent: '#d946ef',
        dark: '#0f172a',  // Should be dark navy
        light: '#f8fafc'  // Off-white
      }
    },
  },
  plugins: [],
}