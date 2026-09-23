"use client";

import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useIsMac } from "@/hooks/use-is-mac";
import { cn } from "@/lib/utils";

const MAC_SYMBOLS: Record<string, string> = { mod: "⌘", Shift: "⇧", Alt: "⌥", Enter: "↵" };
const PC_LABELS: Record<string, string> = { mod: "Ctrl", Enter: "Enter" };

export function formatKey(key: string, isMac: boolean): string {
  return (isMac ? MAC_SYMBOLS[key] : PC_LABELS[key]) ?? key;
}

interface ShortcutKeysProps {
  keys: string[];
  className?: string;
}

/** Renders a shortcut with platform-aware modifier labels (⌘ on macOS, Ctrl elsewhere). */
export function ShortcutKeys({ keys, className }: ShortcutKeysProps) {
  const isMac = useIsMac();
  return (
    <KbdGroup className={cn(className)}>
      {keys.map((key) => (
        <Kbd key={key}>{formatKey(key, isMac)}</Kbd>
      ))}
    </KbdGroup>
  );
}
