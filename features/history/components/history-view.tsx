"use client";

import { History, SearchX, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConversationItem } from "@/components/app/conversation-item";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FilterChips } from "@/components/shared/filter-chips";
import { EmptyState, SkeletonLoader } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MODELS } from "@/data/models";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { groupByDate } from "@/lib/format";
import { useChatStore } from "@/store/chat-store";
import type { ConversationTag } from "@/types/chat";
import { searchConversations } from "../lib/search-conversations";

const TAG_OPTIONS: ReadonlyArray<{ value: ConversationTag | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "work", label: "Work" },
  { value: "research", label: "Research" },
  { value: "code", label: "Code" },
  { value: "personal", label: "Personal" },
];

export function HistoryView() {
  const hydrated = useStoreHydrated(useChatStore);
  const conversations = useChatStore((state) => state.conversations);
  const clearHistory = useChatStore((state) => state.clearHistory);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [modelId, setModelId] = useState("all");
  const [tag, setTag] = useState<ConversationTag | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const groups = useMemo(() => {
    const results = searchConversations(conversations, { query: deferredQuery, modelId, tag, favoritesOnly });
    return groupByDate(
      results.map((result) => result.conversation),
      (conversation) => conversation.updatedAt,
    );
  }, [conversations, deferredQuery, modelId, tag, favoritesOnly]);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const hasFilters = query !== "" || modelId !== "all" || tag !== "all" || favoritesOnly;

  function resetFilters() {
    setQuery("");
    setModelId("all");
    setTag("all");
    setFavoritesOnly(false);
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Conversation history</h2>
          <p className="mt-1 text-sm text-muted-foreground">Search every chat across every model in one place.</p>
        </div>
        <Button
          variant="destructive-subtle"
          size="sm"
          className="self-start sm:self-auto"
          onClick={() => setConfirmClear(true)}
          disabled={!hydrated || conversations.length === 0}
        >
          <Trash2 aria-hidden="true" />
          Clear history
        </Button>
      </div>

      <div className="space-y-3 rounded-lg border border-border bg-background-subtle p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles and messages"
            aria-label="Search conversations"
            className="bg-card sm:flex-1"
          />
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger aria-label="Filter by model" className="w-full bg-card sm:w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All models</SelectItem>
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips label="Filter by tag" size="sm" value={tag} onValueChange={setTag} options={TAG_OPTIONS} />
          <div className="flex items-center gap-2">
            <Switch id="favorites-only" checked={favoritesOnly} onCheckedChange={setFavoritesOnly} />
            <Label htmlFor="favorites-only" className="text-sm font-normal text-muted-foreground">
              Favorites only
            </Label>
          </div>
        </div>
      </div>

      {!hydrated ? (
        <SkeletonLoader variant="list" count={6} />
      ) : total === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No conversations match"
            description="Try a different keyword, or clear the filters."
            action={
              <Button variant="outline" onClick={resetFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={History}
            title="No conversations yet"
            description="Start a chat and it will be saved here automatically."
            action={
              <Button asChild>
                <Link href="/app">Start a chat</Link>
              </Button>
            }
          />
        )
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {total} {total === 1 ? "conversation" : "conversations"}
          </p>
          {groups.map(({ group, items }) => (
            <section key={group} aria-labelledby={`history-${group}`}>
              <h3
                id={`history-${group}`}
                className="mb-2 text-xs font-medium tracking-wide text-subtle-foreground uppercase"
              >
                {group}
              </h3>
              <ul className="space-y-2">
                {items.map((conversation) => (
                  <li key={conversation.id}>
                    <ConversationItem conversation={conversation} variant="row" />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear all conversation history?"
        description="Every conversation will be permanently deleted from this browser. This cannot be undone."
        confirmLabel="Clear history"
        onConfirm={() => {
          clearHistory();
          toast.success("History cleared");
        }}
      />
    </div>
  );
}
