export type ThemePreference = "light" | "dark" | "system";

export type ResponseStyle = "concise" | "balanced" | "detailed";

export type FontScale = "sm" | "md" | "lg";

export type Density = "comfortable" | "compact";

export interface NotificationPreferences {
  productUpdates: boolean;
  weeklyDigest: boolean;
  responseComplete: boolean;
}

export interface PrivacyPreferences {
  saveHistory: boolean;
  improveModels: boolean;
  shareAnalytics: boolean;
}

export interface ProfilePreferences {
  displayName: string;
  email: string;
  language: string;
}

export interface Preferences {
  profile: ProfilePreferences;
  customInstructions: string;
  defaultModelId: string;
  sendOnEnter: boolean;
  responseStyle: ResponseStyle;
  showSuggestions: boolean;
  fontScale: FontScale;
  density: Density;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export type SettingsSectionId = "general" | "appearance" | "ai" | "notifications" | "privacy" | "shortcuts";
