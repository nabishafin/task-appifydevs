export type ShortcutScope = "global" | "chat" | "navigation";

export interface KeyboardShortcut {
  id: string;
  label: string;
  /** Keys in display order. "mod" renders as ⌘ on macOS and Ctrl elsewhere. */
  keys: string[];
  scope: ShortcutScope;
}
