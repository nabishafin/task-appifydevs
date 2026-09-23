import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants/storage";
import { applyTheme, DEFAULT_THEME } from "@/lib/theme";
import type { ThemePreference } from "@/types/settings";

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  /** Reads the value the inline head script already applied. */
  hydrate: () => void;
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

/*
 * The theme is stored as a plain string (not zustand's JSON envelope) because
 * the pre-paint script in <head> reads it directly.
 */
export const useThemeStore = create<ThemeState>((set) => ({
  theme: DEFAULT_THEME,
  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
    applyTheme(theme);
    set({ theme });
  },
  hydrate: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.theme);
      if (isThemePreference(stored)) set({ theme: stored });
    } catch {
      // Keep the default.
    }
  },
}));
