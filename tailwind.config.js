/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        secondary: "#f8fafc",
        card: "#ffffff",
        borderColor: "#e2e8f0", // Avoid styling conflict with native border color utilities
        text: "#111827",
        subtext: "#475569",
        blue: {
          100: "#e8edf3",
          200: "#d5dee9",
          300: "#9aabc0",
          400: "#526985",
          500: "#243b5a",
          600: "#1e334f",
          700: "#172a43",
          800: "#111f33",
          900: "#0b1524",
          950: "#070d17",
        },
        primaryAccent: "#243b5a",
        glow: "#385577",
        success: "#22C55E",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        code: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'premium-glow': '0 8px 24px rgba(36, 59, 90, 0.08)',
        'premium-glow-lg': '0 14px 36px rgba(36, 59, 90, 0.12)',
        'accent-glow': '0 8px 24px rgba(36, 59, 90, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
