"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";

/** Starts a fresh chat with the user's default model and opens the chat view. */
export function useStartNewChat() {
  const router = useRouter();
  const pathname = usePathname();
  const startNewChat = useChatStore((state) => state.startNewChat);

  return useCallback(
    (modelId?: string) => {
      startNewChat(modelId ?? usePreferencesStore.getState().defaultModelId);
      if (pathname !== "/app") router.push("/app");
    },
    [startNewChat, pathname, router],
  );
}
