/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#5b5bf0',
        brand2: '#8b5cf6',
        bg: '#f4f6fb',
        card: '#ffffff',
        ink: '#1d2433',
        muted: '#667089',
        line: '#e3e8f2',
        plus: '#16a34a',
        minus: '#e11d48',
        ask: '#2563eb',
        rule: '#7c3aed',
        dark: {
          bg: '#0f1220',
          card: '#181c30',
          ink: '#eef1ff',
          muted: '#9aa4c4',
          line: '#2a3050',
        }
      },
      fontFamily: {
        ui: ['"Inter"', 'system-ui', '-apple-system', '"Noto Sans"', 'Arial', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', '-apple-system', '"Noto Sans"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}