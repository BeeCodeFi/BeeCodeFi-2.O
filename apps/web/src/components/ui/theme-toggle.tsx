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
    <select
      aria-label="Theme"
      value={theme}
      onChange={(e) => handleChange(e.target.value as Theme)}
      className="rounded-md border border-accent/30 bg-surface px-2 py-1 text-sm text-text"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
