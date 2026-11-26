import type { Config } from 'tailwindcss';

// Paul (UI/UX) + Michael (Frontend Lead): own the design tokens here.
// Do NOT use Pi's logo or Pi's brand colors (hackathon rule).
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#4f46e5', dark: '#3730a3', light: '#818cf8' }, // placeholder palette
      },
    },
  },
  plugins: [],
};
export default config;
