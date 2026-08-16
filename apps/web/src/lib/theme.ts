export type Theme = "light" | "dark" | "bee" | "system";

const STORAGE_KEY = "bcf-theme";

export function resolveTheme(theme: Theme): "light" | "dark" | "bee" {
  if (theme !== "system") return theme;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}

export function loadStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (window.localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
}

export function storeTheme(theme: Theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
}
