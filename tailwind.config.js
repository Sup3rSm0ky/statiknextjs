/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0f',
          elevated: '#13131a',
          card: '#1a1a23',
          soft: '#22222d',
        },
        ink: {
          DEFAULT: '#f5f5f7',
          soft: '#8a8a96',
          faint: '#4a4a55',
        },
        accent: {
          DEFAULT: '#c4ff3f',
          glow: 'rgba(196, 255, 63, 0.4)',
        },
        success: '#4ade80',
        danger: '#ff5577',
        warning: '#ffa94d',
      },
    },
  },
  plugins: [],
};
