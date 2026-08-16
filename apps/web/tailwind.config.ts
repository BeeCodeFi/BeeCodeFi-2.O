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
        "surface-hover": "var(--surface-hover)",
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
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        xs:   ["0.75rem", { lineHeight: "1.125rem" }],
        sm:   ["0.875rem",{ lineHeight: "1.375rem" }],
        base: ["1rem",    { lineHeight: "1.625rem" }],
        lg:   ["1.125rem",{ lineHeight: "1.75rem"  }],
        xl:   ["1.25rem", { lineHeight: "1.875rem" }],
        "2xl":["1.5rem",  { lineHeight: "2rem"     }],
        "3xl":["1.875rem",{ lineHeight: "2.25rem"  }],
        "4xl":["2.25rem", { lineHeight: "2.625rem" }],
        "5xl":["3rem",    { lineHeight: "1.15"     }],
        "6xl":["3.75rem", { lineHeight: "1.1"      }],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--shadow-color) / 0.04), 0 2px 8px rgb(var(--shadow-color) / 0.06)",
        card: "0 1px 2px rgb(var(--shadow-color) / 0.05), 0 4px 16px rgb(var(--shadow-color) / 0.08)",
        lift: "0 8px 24px rgb(var(--shadow-color) / 0.14)",
        glow: "0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent)",
        "glow-lg": "0 0 32px color-mix(in srgb, var(--primary) 30%, transparent)",
        "inner-glow": "inset 0 0 20px color-mix(in srgb, var(--primary) 10%, transparent)",
      },
      borderRadius: {
        xl2: "1.25rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-16px)" },
          to:   { opacity: "1", transform: "translateY(0)"     },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.88)" },
          to:   { opacity: "1", transform: "scale(1)"    },
        },
        "bounce-in": {
          "0%":   { opacity: "0", transform: "scale(0.6)"  },
          "60%":  { opacity: "1", transform: "scale(1.08)" },
          "80%":  {               transform: "scale(0.96)" },
          "100%": {               transform: "scale(1)"    },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to:   { opacity: "1", transform: "translateX(0)"     },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to:   { opacity: "1", transform: "translateX(0)"    },
        },
        "card-rise": {
          from: { opacity: "0", transform: "translateY(24px) scale(0.97)" },
          to:   { opacity: "1", transform: "translateY(0) scale(1)"       },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)"  },
          "50%":      { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--primary) 0%, transparent)"  },
          "50%":      { boxShadow: "0 0 0 8px color-mix(in srgb, var(--primary) 20%, transparent)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%"   },
          "50%":      { backgroundPosition: "100% 50%" },
        },
        "ping-soft": {
          "0%":       { transform: "scale(1)",   opacity: "0.8" },
          "75%, 100%":{ transform: "scale(1.6)", opacity: "0"   },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition:  "400px 0" },
        },
      },
      animation: {
        "fade-in-up":    "fade-in-up 500ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in-down":  "fade-in-down 500ms cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":       "fade-in 400ms ease both",
        "scale-in":      "scale-in 400ms cubic-bezier(0.22,1,0.36,1) both",
        "bounce-in":     "bounce-in 600ms cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-left": "slide-in-left 500ms cubic-bezier(0.22,1,0.36,1) both",
        "slide-in-right":"slide-in-right 500ms cubic-bezier(0.22,1,0.36,1) both",
        "card-rise":     "card-rise 500ms cubic-bezier(0.22,1,0.36,1) both",
        float:           "float 3s ease-in-out infinite",
        "glow-pulse":    "glow-pulse 2.4s ease-in-out infinite",
        "gradient-shift":"gradient-shift 6s ease infinite",
        "ping-soft":     "ping-soft 2s ease-out infinite",
        shimmer:         "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
