"use client";

import { History, type LucideIcon, MessageSquare, Settings, Sparkles } from "lucide-react";
import { m } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ExtensionView } from "@/types/extension";

export const EXTENSION_TABS: Array<{ value: ExtensionView; label: string; icon: LucideIcon }> = [
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "history", label: "History", icon: History },
  { value: "prompts", label: "Prompts", icon: Sparkles },
  { value: "settings", label: "Settings", icon: Settings },
];

export function tabId(idPrefix: string, view: ExtensionView) {
  return `${idPrefix}-tab-${view}`;
}

export function panelId(idPrefix: string, view: ExtensionView) {
  return `${idPrefix}-panel-${view}`;
}

interface ExtensionNavigationProps {
  value: ExtensionView;
  onValueChange: (view: ExtensionView) => void;
  idPrefix: string;
}

/** Bottom tab bar. Arrow keys, Home and End move between tabs (roving tabindex). */
export function ExtensionNavigation({ value, onValueChange, idPrefix }: ExtensionNavigationProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = EXTENSION_TABS.findIndex((tab) => tab.value === value);
    const last = EXTENSION_TABS.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % EXTENSION_TABS.length
        : event.key === "ArrowLeft"
          ? (index - 1 + EXTENSION_TABS.length) % EXTENSION_TABS.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    const view = EXTENSION_TABS[next].value;
    onValueChange(view);
    listRef.current?.querySelector<HTMLButtonElement>(`#${tabId(idPrefix, view)}`)?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Extension sections"
      onKeyDown={handleKeyDown}
      className="grid h-14 shrink-0 grid-cols-4 border-t border-border bg-background-subtle px-1.5"
    >
      {EXTENSION_TABS.map(({ value: tab, label, icon: Icon }) => {
        const selected = tab === value;
        return (
          <button
            key={tab}
            id={tabId(idPrefix, tab)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId(idPrefix, tab)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(tab)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 rounded-lg text-[11px] font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:ring-inset",
              selected ? "text-primary-text" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <m.span
                layoutId={`${idPrefix}-nav-indicator`}
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
              />
            )}
            <Icon className={cn("size-[18px]", selected && "stroke-[2.25]")} aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
