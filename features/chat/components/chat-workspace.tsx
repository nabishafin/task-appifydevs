"use client";

import { ArrowDown } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SkeletonLoader } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { getModel } from "@/data/models";
import { ModelSelector } from "@/features/models/components/model-selector";
import { PromptQuickInsert } from "@/features/prompts/components/prompt-quick-insert";
import { useHotkey } from "@/hooks/use-hotkey";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { selectActiveConversation, useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import { useOverlay, useUIStore } from "@/store/ui-store";
import type { Attachment, MessageFeedback } from "@/types/chat";
import { useStickToBottom } from "../hooks/use-stick-to-bottom";
import { ChatComposer } from "./chat-composer";
import { ChatMessage } from "./chat-message";
import { EmptyChatState } from "./empty-chat-state";
import { TypingIndicator } from "./typing-indicator";

export function ChatWorkspace() {
  const router = useRouter();
  const hydrated = useStoreHydrated(useChatStore);
  const conversation = useChatStore(selectActiveConversation);
  const selectedModelId = useChatStore((state) => state.selectedModelId);
  const pendingConversationId = useChatStore((state) => state.pendingConversationId);
  const selectModel = useChatStore((state) => state.selectModel);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const regenerate = useChatStore((state) => state.regenerate);
  const stopGenerating = useChatStore((state) => state.stopGenerating);
  const setFeedback = useChatStore((state) => state.setFeedback);
  const sendOnEnter = usePreferencesStore((state) => state.sendOnEnter);
  const responseStyle = usePreferencesStore((state) => state.responseStyle);
  const showSuggestions = usePreferencesStore((state) => state.showSuggestions);
  const setComposerDraft = useUIStore((state) => state.setComposerDraft);
  const modelMenu = useOverlay("model");

  // Text handed over from the prompt library or compare page arrives with the navigation.
  const [initialDraft] = useState(() => useUIStore.getState().composerDraft);
  const [draft, setDraft] = useState(initialDraft ?? "");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [webSearch, setWebSearch] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = useMemo(() => conversation?.messages ?? [], [conversation]);
  const isGenerating = conversation !== undefined && pendingConversationId === conversation.id;
  const hasMessages = messages.length > 0;
  const { containerRef, isAtBottom, scrollToBottom } = useStickToBottom<HTMLDivElement>(
    `${messages.length}-${isGenerating}`,
    `${hydrated}-${hasMessages}`,
    hasMessages,
  );

  useEffect(() => {
    if (initialDraft === null) return;
    setComposerDraft(null);
    textareaRef.current?.focus();
  }, [initialDraft, setComposerDraft]);

  // Jump to the latest message when switching conversations, or reset to top on empty state
  useEffect(() => {
    if (hasMessages) {
      scrollToBottom("auto");
    } else {
      containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [conversation?.id, hasMessages, scrollToBottom, containerRef]);

  useHotkey("/", () => textareaRef.current?.focus());
  useHotkey("m", () => modelMenu.onOpenChange(!modelMenu.open), { mod: true });

  const handleSubmit = useCallback(
    (text: string, files: Attachment[]) => {
      setDraft("");
      setAttachments([]);
      void sendMessage(text, { attachments: files.length ? files : undefined, style: responseStyle });
    },
    [sendMessage, responseStyle],
  );

  const handleRegenerate = useCallback(
    (messageId: string) => {
      if (conversation) void regenerate(conversation.id, messageId, responseStyle);
    },
    [conversation, regenerate, responseStyle],
  );

  const handleFeedback = useCallback(
    (messageId: string, feedback: MessageFeedback | undefined) => {
      if (conversation) setFeedback(conversation.id, messageId, feedback);
    },
    [conversation, setFeedback],
  );

  const handleCompare = useCallback(
    (messageId: string) => {
      const index = messages.findIndex((message) => message.id === messageId);
      const prompt = messages.slice(0, index).findLast((message) => message.role === "user");
      router.push(`/app/compare${prompt?.role === "user" ? `?prompt=${encodeURIComponent(prompt.content)}` : ""}`);
    },
    [messages, router],
  );

  function handleModelChange(modelId: string) {
    if (modelId === selectedModelId) return;
    selectModel(modelId);
    if (conversation)
      toast.success(`Next reply will use ${getModel(modelId).name}`, {
        description: "Earlier messages stay as context.",
      });
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={containerRef}
        data-lenis-prevent
        className="min-h-0 flex-1 thin-scrollbar overflow-y-auto overscroll-y-contain"
        aria-live="polite"
        aria-busy={isGenerating}
      >
        {!hydrated ? (
          <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
            <SkeletonLoader variant="message" count={2} />
          </div>
        ) : hasMessages ? (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-(--chat-gap) px-4 pt-6 pb-14 sm:px-6 sm:pt-8 sm:pb-10 lg:px-8">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
                onCompare={handleCompare}
              />
            ))}
            {isGenerating && <TypingIndicator modelId={selectedModelId} />}
          </div>
        ) : (
          <EmptyChatState
            selectedModelId={selectedModelId}
            onSelectModel={selectModel}
            showSuggestions={showSuggestions}
            onUseSuggestion={(prompt) => {
              setDraft(prompt);
              textareaRef.current?.focus();
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {hasMessages && !isAtBottom && (
          <m.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pointer-events-none absolute inset-x-0 bottom-44 z-20 flex justify-center sm:bottom-36"
          >
            <Button
              size="sm"
              variant="outline"
              className="pointer-events-auto rounded-md bg-card shadow-md"
              onClick={() => scrollToBottom()}
            >
              <ArrowDown aria-hidden="true" />
              Latest
            </Button>
          </m.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pt-2 pb-3 sm:px-6 sm:pb-5 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          <ChatComposer
            value={draft}
            onValueChange={setDraft}
            onSubmit={handleSubmit}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            isGenerating={isGenerating}
            onStop={stopGenerating}
            sendOnEnter={sendOnEnter}
            textareaRef={textareaRef}
            webSearch={webSearch}
            onWebSearchChange={(enabled) => {
              setWebSearch(enabled);
              toast(enabled ? "Web search enabled" : "Web search disabled", {
                description: "Search results are simulated in this demo.",
              });
            }}
            placeholder={`Message ${getModel(selectedModelId).name}…`}
            toolsSlot={
              <PromptQuickInsert
                onInsert={(prompt) => {
                  setDraft(prompt.prompt);
                  textareaRef.current?.focus();
                }}
              />
            }
            modelSlot={
              <ModelSelector
                value={selectedModelId}
                onValueChange={handleModelChange}
                open={modelMenu.open}
                onOpenChange={modelMenu.onOpenChange}
              />
            }
          />
          <p className="mt-2 text-center text-[11px] text-subtle-foreground">
            Responses are simulated for this demo. AI can make mistakes — check important information.
          </p>
        </div>
      </div>
    </div>
  );
}
