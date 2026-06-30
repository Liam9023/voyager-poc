import type { Config } from "tailwindcss";

// Voyager Design System — Coastal Retreat × Olive Oasis — Warm Balance
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#7F543D",
        "accent-light": "#F4EDE7",
        "accent-dark": "#50321E",
        secondary: "#74A8A4",
        "secondary-light": "#E8F2F2",
        "secondary-border": "#A8CCC8",
        hero: "#2C4858",
        "hero-alt": "#335765",
        bg: "#E9E4DC",
        surface: "#FDFAF6",
        "surface-alt": "#F4F0E8",
        border: "#D4CCBE",
        "border-strong": "#B8AE9E",
        text: "#1A1E22",
        "text-mid": "#504840",
        "text-light": "#948A80",
        tag: "#EDE8E0",
        green: "#74A8A4",
        "green-light": "#E8F2F2",
        "green-border": "#A8CCC8",
        amber: "#CB7A5C",
        "amber-light": "#FAF0EB",
        "amber-border": "#E8B89A",
        danger: "#C53030",
        "danger-light": "#FFF5F5",
        "danger-border": "#FEB2B2",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "24px",
        xl: "32px",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(26,30,34,0.08)",
        md: "0 4px 16px rgba(26,30,34,0.10)",
        lg: "0 8px 32px rgba(26,30,34,0.14)",
        hero: "0 4px 24px rgba(44,72,88,0.25)",
      },
      maxWidth: {
        app: "480px",
      },
    },
  },
  plugins: [],
};

export default config;
