import type { Config } from "tailwindcss";

// Design tokens per files/06-frontend-plan.md §1
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        primary: "var(--primary)",
        "primary-strong": "var(--primary-strong)",
        accent: "var(--accent)",
        text: "var(--text)",
        success: "var(--success)",
        warn: "var(--warn)",
        error: "var(--error)",
      },
      fontFamily: {
        ui: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--shadow-color) / 0.04), 0 2px 8px rgb(var(--shadow-color) / 0.06)",
        card: "0 1px 2px rgb(var(--shadow-color) / 0.05), 0 4px 16px rgb(var(--shadow-color) / 0.08)",
        lift: "0 8px 24px rgb(var(--shadow-color) / 0.14)",
        glow: "0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
