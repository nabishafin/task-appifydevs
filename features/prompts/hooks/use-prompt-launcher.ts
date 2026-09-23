"use client";

import { useState } from "react";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { useUIStore } from "@/store/ui-store";
import type { PromptTemplate } from "@/types/prompts";
import { extractVariables } from "../lib/prompt-utils";

/**
 * "Use prompt" flow: templates with {{variables}} open the fill-in dialog,
 * plain prompts go straight into a new chat's composer.
 */
export function usePromptLauncher() {
  const [pendingPrompt, setPendingPrompt] = useState<PromptTemplate | null>(null);
  const setComposerDraft = useUIStore((state) => state.setComposerDraft);
  const startNewChat = useStartNewChat();

  function openInChat(text: string) {
    setPendingPrompt(null);
    setComposerDraft(text);
    startNewChat();
  }

  function launch(prompt: PromptTemplate) {
    if (extractVariables(prompt.prompt).length > 0) setPendingPrompt(prompt);
    else openInChat(prompt.prompt);
  }

  return {
    launch,
    dialogProps: {
      prompt: pendingPrompt,
      onOpenChange: (open: boolean) => !open && setPendingPrompt(null),
      onConfirm: openInChat,
    },
  };
}
