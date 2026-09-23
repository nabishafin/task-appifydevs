import { BookOpen, Columns2, Cpu, History, MessageSquare, Settings, Star, type LucideIcon } from "lucide-react";

export interface AppNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Match nested routes (e.g. /app/settings?section=…). */
  exact?: boolean;
}

export const APP_NAV: AppNavItem[] = [
  { label: "Chat", href: "/app", icon: MessageSquare, exact: true },
  { label: "AI Models", href: "/app/models", icon: Cpu },
  { label: "Prompt Library", href: "/app/prompts", icon: BookOpen },
  { label: "Compare", href: "/app/compare", icon: Columns2 },
  { label: "Favorites", href: "/app/favorites", icon: Star },
  { label: "History", href: "/app/history", icon: History },
];

export const SETTINGS_NAV_ITEM: AppNavItem = { label: "Settings", href: "/app/settings", icon: Settings };

export const APP_PAGE_TITLES: Record<string, string> = {
  "/app/models": "AI Models",
  "/app/prompts": "Prompt Library",
  "/app/compare": "Compare models",
  "/app/favorites": "Favorites",
  "/app/history": "History",
  "/app/settings": "Settings",
};

export function isNavItemActive(item: AppNavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
