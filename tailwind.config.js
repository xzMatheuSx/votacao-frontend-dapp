/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e17',
        'dark-card': '#151b2b',
        'dark-border': '#1f2937',
        'dark-text': '#e5e7eb',
        'dark-muted': '#9ca3af',
        'light-bg': '#f8fafc',
        'light-card': '#ffffff',
        'light-border': '#e2e8f0',
        'light-text': '#1e293b',
        'light-muted': '#64748b',
      },
    },
  },
  plugins: [],
}

