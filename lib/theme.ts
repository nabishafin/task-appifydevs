import { STORAGE_KEYS } from "@/constants/storage";
import type { ThemePreference } from "@/types/settings";

export const DEFAULT_THEME: ThemePreference = "dark";

/**
 * Runs in <head> before first paint so the saved theme is applied without a
 * flash. Keep it dependency-free: it is inlined as a string.
 */
export const themeInitScript = `(function(){try{var p=localStorage.getItem("${STORAGE_KEYS.theme}")||"${DEFAULT_THEME}";var d=p==="dark"||(p==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var c=document.documentElement.classList;c.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}})()`;

export function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(preference: ThemePreference) {
  const resolved = resolveTheme(preference);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}
