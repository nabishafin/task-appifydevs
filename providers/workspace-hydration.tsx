"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { usePromptStore } from "@/store/prompt-store";
import { useUIStore } from "@/store/ui-store";

/**
 * Persisted stores skip hydration during SSR so server and client markup match.
 * Mounted only by the /app and /extension layouts, keeping the landing page light.
 */
export function WorkspaceHydration() {
  useEffect(() => {
    void usePreferencesStore.persist.rehydrate();
    void useUIStore.persist.rehydrate();
    void useChatStore.persist.rehydrate();
    void usePromptStore.persist.rehydrate();
  }, []);

  return null;
}
