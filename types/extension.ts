import type { LucideIcon } from "lucide-react";
import type { ResponseStyle } from "./settings";

export type ExtensionView = "chat" | "history" | "prompts" | "settings";

export type QuickActionId =
  "summarize-page" | "explain-selection" | "rewrite-text" | "translate" | "generate-reply" | "ask-page";

export interface QuickAction {
  id: QuickActionId;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Prompt sent to the model when the action runs. */
  prompt: string;
  requiresSelection: boolean;
}

export type ExtensionLayout = "popup" | "sidebar";

export interface ExtensionSettings {
  defaultModelId: string;
  responseStyle: ResponseStyle;
  sendOnEnter: boolean;
  autoReadPage: boolean;
  saveHistory: boolean;
  excludeIncognito: boolean;
  translateTo: string;
  customInstructions: string;
}
