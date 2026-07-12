/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0D1117',
        panel: '#161B22',
        panel2: '#1C2333',
        border: '#2A3242',
        amber: '#F5A623',
        teal: '#2DD4BF',
        danger: '#F85149',
        ink: '#E6EDF3',
        muted: '#8B949E',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
