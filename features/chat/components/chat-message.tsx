"use client";

import { FileText, MoreHorizontal, RefreshCw, Share2, ThumbsDown, ThumbsUp, Columns2 } from "lucide-react";
import { m } from "motion/react";
import { memo } from "react";
import { toast } from "sonner";
import { CopyButton } from "@/components/shared/copy-button";
import { ModelIcon } from "@/components/shared/model-icon";
import { ErrorState } from "@/components/shared/states";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { getModel } from "@/data/models";
import { formatBytes } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AssistantMessage, ChatMessage as ChatMessageType, MessageFeedback, UserMessage } from "@/types/chat";
import { blocksToPlainText } from "../lib/parse-inline";
import { MessageContent } from "./message-content";

const messageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
};

function UserBubble({ message, compact }: { message: UserMessage; compact: boolean }) {
  return (
    <m.article {...messageMotion} aria-label="You said" className="flex justify-end">
      <div className={cn("max-w-[85%] space-y-2", compact ? "max-w-[90%]" : "sm:max-w-[75%]")}>
        {message.attachments && message.attachments.length > 0 && (
          <ul className="flex flex-wrap justify-end gap-1.5" aria-label="Attached files">
            {message.attachments.map((attachment) => (
              <li
                key={attachment.id}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
              >
                <FileText className="size-3.5" aria-hidden="true" />
                <span className="max-w-40 truncate text-foreground">{attachment.name}</span>
                <span>{formatBytes(attachment.size)}</span>
              </li>
            ))}
          </ul>
        )}
        <div
          className={cn(
            "rounded-lg rounded-br-md border border-primary/10 bg-user-message whitespace-pre-wrap text-foreground",
            compact ? "px-3 py-2 text-sm" : "px-4 py-2.5 text-(length:--chat-font-size) leading-7",
          )}
        >
          {message.content}
        </div>
      </div>
    </m.article>
  );
}

/** Callbacks receive the message id so parents can pass stable references and keep memoization. */
interface MessageCallbacks {
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, feedback: MessageFeedback | undefined) => void;
  onCompare?: (messageId: string) => void;
}

interface AssistantActionsProps extends MessageCallbacks {
  message: AssistantMessage;
}

function AssistantActions({ message, onRegenerate, onFeedback, onCompare }: AssistantActionsProps) {
  function toggleFeedback(value: MessageFeedback) {
    const next = message.feedback === value ? undefined : value;
    onFeedback?.(message.id, next);
    if (next) toast.success(next === "up" ? "Thanks for the feedback!" : "Thanks — we'll use this to improve answers.");
  }

  return (
    <div className="-ml-1.5 flex items-center gap-0.5 text-muted-foreground">
      <CopyButton value={blocksToPlainText(message.blocks)} label="Copy response" />
      {onRegenerate && (
        <TooltipIconButton label="Regenerate" onClick={() => onRegenerate(message.id)}>
          <RefreshCw aria-hidden="true" />
        </TooltipIconButton>
      )}
      {onFeedback && (
        <>
          <TooltipIconButton
            label="Good response"
            aria-pressed={message.feedback === "up"}
            onClick={() => toggleFeedback("up")}
            className={cn(message.feedback === "up" && "text-primary-text")}
          >
            <ThumbsUp className={cn(message.feedback === "up" && "fill-current")} aria-hidden="true" />
          </TooltipIconButton>
          <TooltipIconButton
            label="Bad response"
            aria-pressed={message.feedback === "down"}
            onClick={() => toggleFeedback("down")}
            className={cn(message.feedback === "down" && "text-primary-text")}
          >
            <ThumbsDown className={cn(message.feedback === "down" && "fill-current")} aria-hidden="true" />
          </TooltipIconButton>
        </>
      )}
      <DropdownMenu>
        <TooltipIconButton label="More actions" asMenuTrigger>
          <MoreHorizontal aria-hidden="true" />
        </TooltipIconButton>
        <DropdownMenuContent align="start" className="w-52">
          {onCompare && (
            <DropdownMenuItem onSelect={() => onCompare(message.id)}>
              <Columns2 aria-hidden="true" />
              Compare with another model
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() => {
              void navigator.clipboard?.writeText(`${window.location.origin}/app?shared=${message.id}`);
              toast.success("Share link copied", { description: "Shared links are simulated in this demo." });
            }}
          >
            <Share2 aria-hidden="true" />
            Copy share link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface AssistantBubbleProps extends AssistantActionsProps {
  compact: boolean;
  showActions: boolean;
}

function AssistantBubble({ message, compact, showActions, ...actions }: AssistantBubbleProps) {
  const model = getModel(message.modelId);

  return (
    <m.article {...messageMotion} aria-label={`${model.name} replied`} className="group/message flex gap-3">
      <ModelIcon providerId={model.providerId} size={compact ? "sm" : "md"} className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{model.name}</p>
        {message.status === "error" ? (
          <ErrorState
            title="Response failed"
            description={message.errorMessage ?? "The model did not respond."}
            onRetry={actions.onRegenerate && (() => actions.onRegenerate?.(message.id))}
          />
        ) : (
          <>
            <MessageContent blocks={message.blocks} className={cn(compact && "text-sm leading-6")} />
            {showActions && <AssistantActions message={message} {...actions} />}
          </>
        )}
      </div>
    </m.article>
  );
}

interface ChatMessageProps extends MessageCallbacks {
  message: ChatMessageType;
  compact?: boolean;
  showActions?: boolean;
}

export const ChatMessage = memo(function ChatMessage({
  message,
  compact = false,
  showActions = true,
  ...actions
}: ChatMessageProps) {
  if (message.role === "user") return <UserBubble message={message} compact={compact} />;
  return <AssistantBubble message={message} compact={compact} showActions={showActions} {...actions} />;
});
