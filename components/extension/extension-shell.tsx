"use client";

import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useId, useState } from "react";
import { getModel } from "@/data/models";
import { cn } from "@/lib/utils";
import { useExtensionStore } from "@/store/extension-store";
import type { ExtensionView } from "@/types/extension";
import { ExtensionHeader } from "./extension-header";
import { ExtensionNavigation, panelId, tabId } from "./extension-navigation";
import { ChatView } from "./views/chat-view";
import { HistoryView } from "./views/history-view";
import { PromptsView } from "./views/prompts-view";
import { SettingsView } from "./views/settings-view";

const VIEWS: Record<ExtensionView, React.ComponentType> = {
  chat: ChatView,
  history: HistoryView,
  prompts: PromptsView,
  settings: SettingsView,
};

interface ExtensionShellProps {
  onClose: () => void;
  className?: string;
}

/** The extension UI itself. Sized by its container; every view scrolls internally. */
export function ExtensionShell({ onClose, className }: ExtensionShellProps) {
  const idPrefix = `ext${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const view = useExtensionStore((state) => state.view);
  const setView = useExtensionStore((state) => state.setView);
  const modelId = useExtensionStore((state) => state.modelId);
  const selectModel = useExtensionStore((state) => state.selectModel);
  const startNewChat = useExtensionStore((state) => state.startNewChat);
  const layout = useExtensionStore((state) => state.layout);
  const setLayout = useExtensionStore((state) => state.setLayout);
  const [notice, setNotice] = useState<{ key: number; name: string } | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2200);
    return () => clearTimeout(timer);
  }, [notice]);

  function handleModelChange(next: string) {
    if (next === modelId) return;
    selectModel(next);
    setNotice({ key: Date.now(), name: getModel(next).name });
  }

  function openShortcuts() {
    setView("settings");
    setTimeout(
      () => document.getElementById("extension-shortcuts")?.scrollIntoView({ block: "start", behavior: "smooth" }),
      320,
    );
  }

  const View = VIEWS[view];

  return (
    <section
      aria-label="EchoGPT extension"
      className={cn("flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground", className)}
    >
      <ExtensionHeader
        modelId={modelId}
        onModelChange={handleModelChange}
        onNewChat={startNewChat}
        layout={layout}
        onLayoutChange={setLayout}
        onOpenShortcuts={openShortcuts}
        onClose={onClose}
      />

      <div className="relative min-h-0 flex-1">
        <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-2 z-20 flex justify-center">
          <AnimatePresence>
            {notice && (
              <m.p
                key={notice.key}
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1 text-xs font-medium shadow-md"
              >
                <Check className="size-3.5 text-success" aria-hidden="true" />
                Switched to {notice.name}
              </m.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={view}
            id={panelId(idPrefix, view)}
            role="tabpanel"
            aria-labelledby={tabId(idPrefix, view)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col"
          >
            <View />
          </m.div>
        </AnimatePresence>
      </div>

      <ExtensionNavigation value={view} onValueChange={setView} idPrefix={idPrefix} />
    </section>
  );
}
