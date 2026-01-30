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
        sans: ['"Nanum Myeongjo"', 'serif'],
        score: ['"Nanum Myeongjo"', 'serif'],
        english: ['"Nanum Myeongjo"', 'serif'],
        script: ['"Nanum Myeongjo"', 'serif'],
        heading: ['"Nanum Myeongjo"', 'serif'],
        body: ['"Nanum Myeongjo"', 'serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}

export default config 