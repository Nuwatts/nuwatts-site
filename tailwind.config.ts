import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#05070d',
        panel: 'rgba(255,255,255,0.05)',
      },
      boxShadow: {
        glow: '0 0 50px rgba(56, 189, 248, 0.15)',
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(circle at top, rgba(73,121,255,0.18), transparent 32%), radial-gradient(circle at 80% 20%, rgba(255,146,43,0.16), transparent 26%), linear-gradient(180deg, #05070d 0%, #070b14 50%, #04060c 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
