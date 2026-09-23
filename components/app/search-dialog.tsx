"use client";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ModelIcon } from "@/components/shared/model-icon";
import { EmptyState } from "@/components/shared/states";
import { Command, CommandDialog, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { getModel } from "@/data/models";
import { searchConversations } from "@/features/history/lib/search-conversations";
import { formatListDate } from "@/lib/format";
import { useChatStore } from "@/store/chat-store";
import { useOverlay } from "@/store/ui-store";

export function SearchDialog() {
  const router = useRouter();
  const { open, onOpenChange } = useOverlay("search");
  const conversations = useChatStore((state) => state.conversations);
  const openConversation = useChatStore((state) => state.openConversation);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchConversations(conversations, { query }).slice(0, 12), [conversations, query]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
      title="Search conversations"
      description="Search titles and messages across every model"
      className="sm:max-w-xl"
    >
      {/* Filtering is done by searchConversations so message bodies are searchable too. */}
      <Command shouldFilter={false}>
        <CommandInput placeholder="Search conversations…" value={query} onValueChange={setQuery} />
        <CommandList className="max-h-[min(26rem,60vh)]">
          {results.length === 0 ? (
            <EmptyState
              size="sm"
              icon={SearchX}
              title="No matching conversations"
              description="Try a different keyword or model name."
            />
          ) : (
            <CommandGroup heading={query ? `${results.length} results` : "Recent"}>
              {results.map(({ conversation, snippet }) => {
                const model = getModel(conversation.modelId);
                return (
                  <CommandItem
                    key={conversation.id}
                    value={conversation.id}
                    onSelect={() => {
                      openConversation(conversation.id);
                      onOpenChange(false);
                      router.push("/app");
                    }}
                    className="items-start gap-3 py-2"
                  >
                    <ModelIcon providerId={model.providerId} size="sm" className="mt-0.5" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">{conversation.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{snippet}</span>
                    </span>
                    <span className="shrink-0 text-xs text-subtle-foreground">
                      {formatListDate(conversation.updatedAt)}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
