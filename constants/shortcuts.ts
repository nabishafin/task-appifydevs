import type { KeyboardShortcut } from "@/types/shortcuts";

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { id: "command", label: "Open command palette", keys: ["mod", "K"], scope: "global" },
  { id: "shortcuts", label: "Show keyboard shortcuts", keys: ["mod", "/"], scope: "global" },
  { id: "new-chat", label: "Start a new chat", keys: ["mod", "Shift", "O"], scope: "global" },
  { id: "sidebar", label: "Toggle sidebar", keys: ["mod", "B"], scope: "global" },
  { id: "model", label: "Switch model", keys: ["mod", "M"], scope: "chat" },
  { id: "send", label: "Send message", keys: ["Enter"], scope: "chat" },
  { id: "newline", label: "Insert a new line", keys: ["Shift", "Enter"], scope: "chat" },
  { id: "focus", label: "Focus the composer", keys: ["/"], scope: "chat" },
  { id: "escape", label: "Close dialogs and menus", keys: ["Esc"], scope: "navigation" },
];

export const SHORTCUT_SCOPE_LABELS: Record<KeyboardShortcut["scope"], string> = {
  global: "General",
  chat: "Chat",
  navigation: "Navigation",
};
