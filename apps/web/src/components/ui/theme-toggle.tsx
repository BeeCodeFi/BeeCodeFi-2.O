"use client";

import { useEffect, useState } from "react";
import { applyTheme, loadStoredTheme, storeTheme, type Theme } from "@/lib/theme";

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "bee", label: "Bee" },
];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = loadStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  function handleChange(next: Theme) {
    setTheme(next);
    storeTheme(next);
    applyTheme(next);
  }

  return (
    <div className="relative">
      <select
        aria-label="Theme"
        value={theme}
        onChange={(e) => handleChange(e.target.value as Theme)}
        className="appearance-none rounded-lg border border-accent/25 bg-surface px-3 py-1.5 pr-7 text-sm text-text transition-colors hover:border-accent/50 focus-visible:border-primary"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text/50"
      >
        <path
          fill="currentColor"
          d="M5.5 7.5 10 12l4.5-4.5-1-1L10 10l-3.5-3.5-1 1z"
        />
      </svg>
    </div>
  );
}
