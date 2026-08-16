"use client";

import { useEffect, useState } from "react";
import { applyTheme, loadStoredTheme, resolveTheme, storeTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = loadStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function toggle() {
    const next: Theme = resolveTheme(theme) === "dark" ? "light" : "dark";
    setTheme(next);
    storeTheme(next);
    applyTheme(next);
  }

  const isDark = resolveTheme(theme) === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/20 bg-surface text-text/70 transition-colors duration-150 hover:border-accent/40 hover:text-text"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
