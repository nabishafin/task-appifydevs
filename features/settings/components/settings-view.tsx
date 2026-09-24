"use client";

import { Bell, Keyboard, Palette, Shield, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/shared/filter-chips";
import { cn } from "@/lib/utils";
import type { SettingsSectionId } from "@/types/settings";
import { AISettings } from "./ai-settings";
import { AppearanceSettings } from "./appearance-settings";
import { GeneralSettings } from "./general-settings";
import { NotificationSettings } from "./notification-settings";
import { PrivacySettings } from "./privacy-settings";
import { ShortcutSettings } from "./shortcut-settings";

const SECTIONS: Array<{ id: SettingsSectionId; label: string; icon: LucideIcon; component: React.ComponentType }> = [
  { id: "general", label: "General", icon: UserRound, component: GeneralSettings },
  { id: "appearance", label: "Appearance", icon: Palette, component: AppearanceSettings },
  { id: "ai", label: "AI preferences", icon: Sparkles, component: AISettings },
  { id: "notifications", label: "Notifications", icon: Bell, component: NotificationSettings },
  { id: "privacy", label: "Privacy", icon: Shield, component: PrivacySettings },
  { id: "shortcuts", label: "Keyboard shortcuts", icon: Keyboard, component: ShortcutSettings },
];

function isSectionId(value: string | null): value is SettingsSectionId {
  return SECTIONS.some((section) => section.id === value);
}

export function SettingsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requested = searchParams.get("section");
  const activeId: SettingsSectionId = isSectionId(requested) ? requested : "general";
  const active = SECTIONS.find((section) => section.id === activeId) ?? SECTIONS[0];
  const ActiveSection = active.component;

  // The section lives in the URL so footer links and refreshes land on the right panel.
  function select(id: SettingsSectionId) {
    router.replace(`${pathname}?section=${id}`, { scroll: false });
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 xl:px-10">
      <nav aria-label="Settings sections" className="lg:w-56 lg:shrink-0">
        <FilterChips
          label="Settings sections"
          value={activeId}
          onValueChange={select}
          options={SECTIONS.map((section) => ({ value: section.id, label: section.label }))}
          className="lg:hidden"
        />
        <ul className="hidden space-y-0.5 lg:block">
          {SECTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = id === activeId;
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => select(id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <m.span
                      layoutId="settings-nav-active"
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg border border-border bg-card shadow-xs"
                    />
                  )}
                  <Icon className={cn("relative size-4", isActive && "text-primary-text")} aria-hidden="true" />
                  <span className="relative">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={activeId}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-6"
          >
            <ActiveSection />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
