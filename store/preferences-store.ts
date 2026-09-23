import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { DEFAULT_MODEL_ID } from "@/data/models";
import { DEMO_USER } from "@/data/user";
import type { NotificationPreferences, Preferences, PrivacyPreferences } from "@/types/settings";

export const DEFAULT_PREFERENCES: Preferences = {
  profile: { displayName: DEMO_USER.name, email: DEMO_USER.email, language: "en" },
  customInstructions: "",
  defaultModelId: DEFAULT_MODEL_ID,
  sendOnEnter: true,
  responseStyle: "balanced",
  showSuggestions: true,
  fontScale: "md",
  density: "comfortable",
  notifications: {
    productUpdates: true,
    weeklyDigest: false,
    responseComplete: true,
  },
  privacy: {
    saveHistory: true,
    improveModels: false,
    shareAnalytics: true,
  },
};

interface PreferencesState extends Preferences {
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  setNotification: (key: keyof NotificationPreferences, value: boolean) => void;
  setPrivacy: (key: keyof PrivacyPreferences, value: boolean) => void;
  resetPreferences: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...DEFAULT_PREFERENCES,
      setPreference: (key, value) => set({ [key]: value } as Pick<Preferences, typeof key>),
      setNotification: (key, value) => set((state) => ({ notifications: { ...state.notifications, [key]: value } })),
      setPrivacy: (key, value) => set((state) => ({ privacy: { ...state.privacy, [key]: value } })),
      resetPreferences: () => set(DEFAULT_PREFERENCES),
    }),
    {
      name: STORAGE_KEYS.preferences,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated after mount (see StoreHydration) so SSR markup always matches.
      skipHydration: true,
    },
  ),
);
