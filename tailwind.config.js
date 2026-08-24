/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        secondary: "#0F172A",
        card: "rgba(255, 255, 255, 0.06)",
        borderColor: "rgba(255, 255, 255, 0.08)", // Avoid styling conflict with native border color utilities
        text: "#FFFFFF",
        subtext: "#94A3B8",
        primaryAccent: "#3B82F6",
        glow: "#60A5FA",
        success: "#22C55E",
      },
      fontFamily: {
        heading: ["'Space Grotesk'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        code: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'premium-glow': '0 0 20px rgba(96, 165, 250, 0.15)',
        'premium-glow-lg': '0 0 35px rgba(96, 165, 250, 0.25)',
        'accent-glow': '0 0 20px rgba(59, 130, 246, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
