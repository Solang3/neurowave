import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg: '#080c10',
        surface: '#0e1419',
        surface2: '#141c24',
        accent: '#a8f0c8',
        delta: '#c4a8f0',
        theta: '#a8f0c8',
        alpha: '#7eb8f7',
        beta: '#f0e8a8',
        gamma: '#f0a8a8',
      },
    },
  },
  plugins: [],
}

export default config
