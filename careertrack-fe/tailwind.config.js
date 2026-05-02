/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Figma'daki soft renk paletimiz
        'soft-bg': '#F8FAFC',
        'soft-indigo': '#6366F1',
        'soft-indigo-light': '#ECF0FF',
        'soft-text': '#1E293B',
        'soft-muted': '#64748B',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}