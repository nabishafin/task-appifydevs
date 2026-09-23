"use client";

import { Globe, TextSelect } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { QUICK_ACTIONS, DEMO_PAGE } from "@/data/extension";
import { ChatComposer } from "@/features/chat/components/chat-composer";
import { ChatMessage } from "@/features/chat/components/chat-message";
import { TypingIndicator } from "@/features/chat/components/typing-indicator";
import { selectActiveExtensionConversation, useExtensionStore } from "@/store/extension-store";
import type { Attachment, MessageFeedback } from "@/types/chat";
import type { QuickAction } from "@/types/extension";
import { QuickActionButton } from "../quick-action-button";

function PageContextChip({ enabled }: { enabled: boolean }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
      <Globe className="size-3.5 shrink-0" aria-hidden="true" />
      {enabled ? (
        <span className="truncate">
          Reading: <span className="font-medium text-foreground">{DEMO_PAGE.domain}</span>
        </span>
      ) : (
        <span>Page context off</span>
      )}
      {enabled && <span className="size-1.5 shrink-0 rounded-full bg-highlight" aria-hidden="true" />}
    </span>
  );
}

function EmptyChat({
  onRun,
  disabled,
  autoReadPage,
}: {
  onRun: (action: QuickAction) => void;
  disabled: boolean;
  autoReadPage: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 px-4 pt-5 pb-3">
      <div className="space-y-2">
        <PageContextChip enabled={autoReadPage} />
        <h2 className="text-lg font-semibold tracking-tight">How can I help with this page?</h2>
        <p className="text-[13px] text-muted-foreground">
          Pick a quick action or ask anything. EchoGPT uses the page and your selection as context.
        </p>
      </div>

      <figure className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
        <figcaption className="mb-1 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-primary-text uppercase">
          <TextSelect className="size-3.5" aria-hidden="true" />
          Selected text
        </figcaption>
        <blockquote className="line-clamp-3 text-[13px] leading-5 text-foreground">“{DEMO_PAGE.selection}”</blockquote>
      </figure>

      <div>
        <h3 className="mb-2 text-xs font-medium text-muted-foreground">Quick actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionButton key={action.id} action={action} onRun={onRun} disabled={disabled} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChatView() {
  const conversation = useExtensionStore(selectActiveExtensionConversation);
  const pendingId = useExtensionStore((state) => state.pendingConversationId);
  const modelId = useExtensionStore((state) => state.modelId);
  const draft = useExtensionStore((state) => state.draft);
  const setDraft = useExtensionStore((state) => state.setDraft);
  const settings = useExtensionStore((state) => state.settings);
  const sendMessage = useExtensionStore((state) => state.sendMessage);
  const runQuickAction = useExtensionStore((state) => state.runQuickAction);
  const stopGenerating = useExtensionStore((state) => state.stopGenerating);
  const regenerate = useExtensionStore((state) => state.regenerate);
  const setFeedback = useExtensionStore((state) => state.setFeedback);

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isGenerating = pendingId !== null;
  const isPendingHere = isGenerating && pendingId === conversation?.id;
  const messageCount = conversation?.messages.length ?? 0;

  useEffect(() => {
    const node = scrollRef.current;
    // The empty state should start at the top, with its greeting visible.
    if (!node) return;
    if (messageCount === 0) {
      node.scrollTop = 0;
      return;
    }
    node.scrollTo({ top: node.scrollHeight, behavior: messageCount > 2 ? "smooth" : "auto" });
  }, [messageCount, isPendingHere, conversation?.id]);

  // A prompt from the library lands here as a draft: focus it so the user can edit and send.
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !useExtensionStore.getState().draft) return;
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, []);

  const handleRegenerate = useCallback((messageId: string) => void regenerate(messageId), [regenerate]);
  const handleFeedback = useCallback(
    (messageId: string, feedback: MessageFeedback | undefined) => setFeedback(messageId, feedback),
    [setFeedback],
  );

  function handleSubmit(text: string, files: Attachment[]) {
    setAttachments([]);
    void sendMessage(text, files);
  }

  function handleQuickAction(action: QuickAction) {
    void runQuickAction(action);
  }

  return (
    <>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {conversation ? (
          <div className="space-y-5 px-4 py-4" aria-live="polite" aria-busy={isPendingHere}>
            <p className="truncate text-center text-xs text-subtle-foreground">{conversation.title}</p>
            {conversation.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                compact
                onRegenerate={handleRegenerate}
                onFeedback={handleFeedback}
              />
            ))}
            {isPendingHere && <TypingIndicator modelId={modelId} compact />}
          </div>
        ) : (
          <EmptyChat onRun={handleQuickAction} disabled={isGenerating} autoReadPage={settings.autoReadPage} />
        )}
      </div>

      <div className="shrink-0 space-y-2 border-t border-border bg-background px-3 pt-2 pb-3">
        {conversation && (
          <div
            role="group"
            aria-label="Quick actions"
            className="-mx-3 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-3 pb-0.5"
          >
            {QUICK_ACTIONS.map((action) => (
              <QuickActionButton
                key={action.id}
                action={action}
                onRun={handleQuickAction}
                variant="chip"
                disabled={isGenerating}
              />
            ))}
          </div>
        )}
        <ChatComposer
          variant="compact"
          value={draft}
          onValueChange={setDraft}
          onSubmit={handleSubmit}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          isGenerating={isGenerating}
          onStop={stopGenerating}
          sendOnEnter={settings.sendOnEnter}
          placeholder={settings.autoReadPage ? "Ask about this page…" : "Ask anything…"}
          textareaRef={textareaRef}
        />
      </div>
    </>
  );
}
