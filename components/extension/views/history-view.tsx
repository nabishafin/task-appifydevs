"use client";

import { MessageSquareDashed, SearchX, Search, Trash2 } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ModelIcon } from "@/components/shared/model-icon";
import { EmptyState, SkeletonLoader } from "@/components/shared/states";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getModel } from "@/data/models";
import { blocksToPlainText } from "@/features/chat/lib/parse-inline";
import { formatListDate, groupByDate } from "@/lib/format";
import { cn, matchesQuery } from "@/lib/utils";
import { useExtensionStore } from "@/store/extension-store";
import type { Conversation } from "@/types/chat";

function snippetOf(conversation: Conversation): string {
  const last = conversation.messages.at(-1);
  if (!last) return "No messages yet";
  const text = last.role === "user" ? last.content : blocksToPlainText(last.blocks) || last.errorMessage || "";
  return text.replace(/\s+/g, " ").trim();
}

interface HistoryItemProps {
  conversation: Conversation;
  active: boolean;
  onOpen: (id: string) => void;
  onDelete: (conversation: Conversation) => void;
}

function HistoryItem({ conversation, active, onOpen, onDelete }: HistoryItemProps) {
  const model = getModel(conversation.modelId);
  return (
    <m.li
      layout="position"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      className="group/item relative"
    >
      <button
        type="button"
        onClick={() => onOpen(conversation.id)}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-start gap-2.5 rounded-lg border p-2.5 pr-10 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
          active
            ? "border-primary/30 bg-primary/5"
            : "border-border bg-card hover:border-border-strong hover:bg-muted/50",
        )}
      >
        <ModelIcon providerId={model.providerId} size="sm" className="mt-0.5" />
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-[13px] font-medium text-foreground">{conversation.title}</span>
            <time dateTime={conversation.updatedAt} className="ml-auto shrink-0 text-[11px] text-subtle-foreground">
              {formatListDate(conversation.updatedAt)}
            </time>
          </span>
          <span className="line-clamp-1 block text-xs text-muted-foreground">{snippetOf(conversation)}</span>
          <span className="block text-[11px] text-subtle-foreground">{model.name}</span>
        </span>
      </button>
      <TooltipIconButton
        label={`Delete “${conversation.title}”`}
        size="icon-xs"
        side="left"
        onClick={() => onDelete(conversation)}
        className="absolute top-2 right-2 text-muted-foreground opacity-100 hover:text-destructive md:opacity-0 md:group-focus-within/item:opacity-100 md:group-hover/item:opacity-100"
      >
        <Trash2 aria-hidden="true" />
      </TooltipIconButton>
    </m.li>
  );
}

export function HistoryView() {
  const conversations = useExtensionStore((state) => state.conversations);
  const activeId = useExtensionStore((state) => state.activeConversationId);
  const openConversation = useExtensionStore((state) => state.openConversation);
  const deleteConversation = useExtensionStore((state) => state.deleteConversation);
  const startNewChat = useExtensionStore((state) => state.startNewChat);

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [pendingDelete, setPendingDelete] = useState<Conversation | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const groups = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const matches = sorted.filter((item) =>
      matchesQuery(deferredQuery, [item.title, snippetOf(item), getModel(item.modelId).name]),
    );
    return groupByDate(matches, (item) => item.updatedAt);
  }, [conversations, deferredQuery]);

  const resultCount = groups.reduce((total, group) => total + group.items.length, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-1 px-3 pt-3 pb-2">
        <label htmlFor="extension-history-search" className="sr-only">
          Search history
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="extension-history-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations…"
            className="h-9 pl-8 text-[13px]"
            autoComplete="off"
          />
        </div>
        <p className="sr-only" aria-live="polite">
          {loading ? "" : `${resultCount} conversation${resultCount === 1 ? "" : "s"}`}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        {loading ? (
          <SkeletonLoader variant="list" count={5} className="px-1" />
        ) : conversations.length === 0 ? (
          <EmptyState
            size="sm"
            icon={MessageSquareDashed}
            title="No conversations yet"
            description="Chats you start in the extension appear here."
            action={
              <Button size="sm" onClick={startNewChat}>
                Start a chat
              </Button>
            }
          />
        ) : resultCount === 0 ? (
          <EmptyState
            size="sm"
            icon={SearchX}
            title="No results"
            description={`Nothing matches “${deferredQuery.trim()}”. Try a different word.`}
            action={
              <Button size="sm" variant="outline" onClick={() => setQuery("")}>
                Clear search
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {groups.map(({ group, items }) => (
              <section key={group} aria-labelledby={`history-${group.replace(/\s+/g, "-")}`}>
                <h3
                  id={`history-${group.replace(/\s+/g, "-")}`}
                  className="mb-1.5 px-1 text-[11px] font-medium tracking-wide text-subtle-foreground uppercase"
                >
                  {group}
                </h3>
                <ul className="space-y-1.5">
                  <AnimatePresence initial={false}>
                    {items.map((conversation) => (
                      <HistoryItem
                        key={conversation.id}
                        conversation={conversation}
                        active={conversation.id === activeId}
                        onOpen={openConversation}
                        onDelete={setPendingDelete}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this conversation?"
        description={`“${pendingDelete?.title ?? ""}” will be removed from your extension history. This can’t be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (!pendingDelete) return;
          deleteConversation(pendingDelete.id);
          toast.success("Conversation deleted");
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
