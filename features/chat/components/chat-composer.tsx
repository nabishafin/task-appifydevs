"use client";

import { ArrowUp, FileText, Globe, Mic, Paperclip, Square, Wand2, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useId, useRef } from "react";
import { toast } from "sonner";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { formatBytes } from "@/lib/format";
import { cn, createId } from "@/lib/utils";
import type { Attachment } from "@/types/chat";

const MAX_ATTACHMENTS = 4;

function toAttachment(file: File): Attachment {
  const kind = file.type.startsWith("image/")
    ? "image"
    : /\.(ts|tsx|js|jsx|py|sql|json|css|html|md)$/i.test(file.name)
      ? "code"
      : "document";
  return { id: createId("a"), name: file.name, size: file.size, kind };
}

interface ChatComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string, attachments: Attachment[]) => void;
  attachments: Attachment[];
  onAttachmentsChange: (attachments: Attachment[]) => void;
  isGenerating?: boolean;
  onStop?: () => void;
  /** Model selector rendered in the toolbar. */
  modelSlot?: React.ReactNode;
  /** Extra toolbar actions, e.g. a prompt library trigger. */
  toolsSlot?: React.ReactNode;
  sendOnEnter?: boolean;
  placeholder?: string;
  variant?: "default" | "compact";
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  webSearch?: boolean;
  onWebSearchChange?: (enabled: boolean) => void;
  className?: string;
}

export function ChatComposer({
  value,
  onValueChange,
  onSubmit,
  attachments,
  onAttachmentsChange,
  isGenerating = false,
  onStop,
  modelSlot,
  toolsSlot,
  sendOnEnter = true,
  placeholder = "Ask anything…",
  variant = "default",
  textareaRef,
  webSearch = false,
  onWebSearchChange,
  className,
}: ChatComposerProps) {
  const compact = variant === "compact";
  const inputId = useId();
  const hintId = useId();
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = textareaRef ?? internalRef;
  useAutoResizeTextarea(inputRef, value, compact ? 140 : 240);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend = value.trim().length > 0 && !isGenerating;

  function submit() {
    if (!canSend) return;
    onSubmit(value, attachments);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    const modPressed = event.metaKey || event.ctrlKey;
    if ((sendOnEnter && !event.shiftKey) || (!sendOnEnter && modPressed)) {
      event.preventDefault();
      submit();
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = MAX_ATTACHMENTS - attachments.length;
    if (room <= 0) {
      toast.error(`You can attach up to ${MAX_ATTACHMENTS} files per message.`);
      return;
    }
    onAttachmentsChange([...attachments, ...Array.from(files).slice(0, room).map(toAttachment)]);
  }

  function improvePrompt() {
    const text = value.trim();
    if (!text) {
      toast.info("Write a prompt first, then EchoGPT can improve it.");
      return;
    }
    onValueChange(
      `${text}\n\nPlease structure the answer with a short summary first, then clear sections. Ask me a clarifying question if anything is ambiguous.`,
    );
    toast.success("Prompt improved", { description: "Added structure and a clarification request." });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        "group/composer rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] focus-within:border-border-strong focus-within:shadow-md",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        {attachments.length > 0 && (
          <m.ul
            aria-label="Attachments"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex flex-wrap gap-2 overflow-hidden px-3 pt-3"
          >
            {attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex max-w-56 items-center gap-2 rounded-lg border border-border bg-background-subtle py-1.5 pr-1 pl-2 text-xs"
              >
                <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate font-medium">{attachment.name}</span>
                <span className="shrink-0 text-subtle-foreground">{formatBytes(attachment.size)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${attachment.name}`}
                  onClick={() => onAttachmentsChange(attachments.filter((item) => item.id !== attachment.id))}
                >
                  <X aria-hidden="true" />
                </Button>
              </li>
            ))}
          </m.ul>
        )}
      </AnimatePresence>

      <label htmlFor={inputId} className="sr-only">
        Message
      </label>
      <textarea
        id={inputId}
        ref={inputRef}
        value={value}
        rows={1}
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-describedby={hintId}
        className={cn(
          "block w-full resize-none bg-transparent text-foreground outline-none placeholder:text-subtle-foreground focus-visible:outline-none",
          compact ? "min-h-10 px-3 pt-3 text-sm" : "min-h-14 px-4 pt-4 text-[0.9375rem] leading-6",
        )}
      />

      <div className={cn("flex items-center gap-1", compact ? "px-2 pt-1 pb-2" : "px-2.5 pt-2 pb-2.5")}>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <TooltipIconButton label="Attach files" onClick={() => fileInputRef.current?.click()}>
          <Paperclip aria-hidden="true" />
        </TooltipIconButton>
        {!compact && (
          <>
            <TooltipIconButton
              label={webSearch ? "Web search on" : "Web search off"}
              aria-pressed={webSearch}
              onClick={() => onWebSearchChange?.(!webSearch)}
              className={cn(webSearch && "bg-primary/10 text-primary-text hover:bg-primary/15 hover:text-primary-text")}
            >
              <Globe aria-hidden="true" />
            </TooltipIconButton>
            <TooltipIconButton label="Improve prompt" onClick={improvePrompt}>
              <Wand2 aria-hidden="true" />
            </TooltipIconButton>
          </>
        )}
        {toolsSlot}
        {modelSlot && <div className="ml-1 min-w-0">{modelSlot}</div>}

        <div className="ml-auto flex items-center gap-1.5">
          {!compact && (
            <p id={hintId} className="mr-1 hidden items-center gap-1.5 text-xs text-subtle-foreground lg:flex">
              {sendOnEnter ? (
                <>
                  <ShortcutKeys keys={["Enter"]} /> to send
                  <span aria-hidden="true">·</span>
                  <ShortcutKeys keys={["Shift", "Enter"]} /> new line
                </>
              ) : (
                <>
                  <ShortcutKeys keys={["mod", "Enter"]} /> to send
                </>
              )}
            </p>
          )}
          {compact && (
            <span id={hintId} className="sr-only">
              {sendOnEnter ? "Press Enter to send, Shift+Enter for a new line." : "Press Ctrl+Enter to send."}
            </span>
          )}
          <TooltipIconButton
            label="Voice input (coming soon)"
            onClick={() =>
              toast.info("Voice input is coming soon", { description: "This is a placeholder in the demo." })
            }
          >
            <Mic aria-hidden="true" />
          </TooltipIconButton>
          {isGenerating ? (
            <TooltipIconButton label="Stop generating" variant="secondary" onClick={onStop} className="rounded-full">
              <Square className="size-3.5 fill-current" aria-hidden="true" />
            </TooltipIconButton>
          ) : (
            <TooltipIconButton
              label="Send message"
              type="submit"
              variant="default"
              disabled={!canSend}
              className="rounded-full disabled:bg-muted disabled:text-subtle-foreground disabled:opacity-100 disabled:shadow-none"
            >
              <ArrowUp aria-hidden="true" />
            </TooltipIconButton>
          )}
        </div>
      </div>
    </form>
  );
}
