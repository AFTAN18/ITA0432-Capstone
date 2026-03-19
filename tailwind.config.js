/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D1B2A", // Deep navy
        secondary: "#1B4332", // Forest green
        accent: "#E63946", // Urgent red
        surface: "#112240",
        background: "#0D1B2A",
        foreground: "#E2E8F0",
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Lato', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
