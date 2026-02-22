/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Industrial color palette - bold and professional
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          900: '#001F4D',
        },
        accent: {
          500: '#FF6B35',  // Vibrant orange
          600: '#E55A2B',
        },
        surface: {
          50: '#FAFBFC',
          100: '#F4F5F7',
          200: '#EBECF0',
          800: '#1A1A2E',
          900: '#0F0F1A',
        },
      },
      fontFamily: {
        // Editorial/Industrial typography
        display: ['"Space Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
