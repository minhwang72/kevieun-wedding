import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FDFBFF',
        primary: '#CAB8FF',
        highlight: '#8D79E6',
        sky: '#B3D4FF',
        pink: '#FFCCE0',
        text: '#5A4B41',
      },
      fontFamily: {
        sans: ['JoseonGulim', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'serif'],
        score: ['JoseonGulim', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'serif'],
        english: ['JoseonGulim', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        script: ['JoseonGulim', 'cursive'],
        heading: ['JoseonGulim', 'serif'],
        body: ['JoseonGulim', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config 