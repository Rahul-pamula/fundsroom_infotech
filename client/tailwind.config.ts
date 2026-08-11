import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        slate: {
          850: '#172033',
          925: '#0b1220',
        },
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top left, rgba(37,99,235,0.28), transparent 35%), radial-gradient(circle at top right, rgba(14,165,233,0.18), transparent 28%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config;

