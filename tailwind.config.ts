import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        ring: "hsl(var(--ring))",
        border: "hsl(var(--border))"
      },
      borderRadius: {
        xl: "1rem",
        lg: "0.75rem",
        md: "0.5rem"
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "70%": { transform: "scale(1.05)", opacity: "0.2" },
          "100%": { transform: "scale(0.95)", opacity: "0.8" }
        }
      },
      animation: {
        pulseRing: "pulseRing 2.4s ease-in-out infinite"
      },
      boxShadow: {
        premium: "0 18px 40px -22px rgba(8, 18, 38, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
