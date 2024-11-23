import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          bg: '#2B2640',          // Deep purple night
          'bg-alt': '#353148',    // Lighter purple
          primary: '#E6E6E6',     // Soft white
          secondary: '#9D98B5',   // Muted lavender
          accent: '#C4C1D7',      // Light lavender
          success: '#9BCEA0',     // Soft green
          error: '#CE9B9B',       // Soft red
          muted: '#6E6A87',       // Dark lavender
          highlight: '#F5F5F5'    // Bright white
        }
      }
    },
  },
  plugins: [],
}

export default config
