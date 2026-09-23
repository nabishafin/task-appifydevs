"use client";

import { Search, SearchX } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_PAGE } from "@/data/extension";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/data/prompts";
import { PromptCard } from "@/features/prompts/components/prompt-card";
import { extractVariables, fillTemplate, filterPrompts } from "@/features/prompts/lib/prompt-utils";
import { cn } from "@/lib/utils";
import { useExtensionStore } from "@/store/extension-store";
import { usePromptStore } from "@/store/prompt-store";
import type { PromptCategory, PromptTemplate } from "@/types/prompts";

type PromptFilter = PromptCategory | "all" | "favorites";

const EXTENSION_CATEGORIES = PROMPT_CATEGORIES.filter((category) =>
  PROMPT_TEMPLATES.some((prompt) => prompt.category === category.id && prompt.surfaces.includes("extension")),
);

const FILTERS: Array<{ value: PromptFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "favorites", label: "Favorites" },
  ...EXTENSION_CATEGORIES.map((category) => ({ value: category.id, label: category.label })),
];

export function PromptsView() {
  const favoriteIds = usePromptStore((state) => state.favoritePromptIds);
  const customPrompts = usePromptStore((state) => state.customPrompts);
  const toggleFavorite = usePromptStore((state) => state.toggleFavoritePrompt);
  const settings = useExtensionStore((state) => state.settings);
  const setDraft = useExtensionStore((state) => state.setDraft);
  const setView = useExtensionStore((state) => state.setView);

  const [filter, setFilter] = useState<PromptFilter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const prompts = useMemo(
    () =>
      filterPrompts([...customPrompts, ...PROMPT_TEMPLATES], {
        query: deferredQuery,
        category: filter,
        surface: "extension",
        favoriteIds,
      }),
    [customPrompts, deferredQuery, filter, favoriteIds],
  );

  function applyPrompt(prompt: PromptTemplate) {
    const text = fillTemplate(prompt.prompt, {
      text: DEMO_PAGE.selection,
      thread: DEMO_PAGE.selection,
      topic: DEMO_PAGE.title,
      language: settings.translateTo,
    });
    const remaining = extractVariables(text);
    setDraft(text);
    setView("chat");
    toast.success(`“${prompt.title}” added to the composer`, {
      description: remaining.length
        ? `Fill in ${remaining.map((name) => `{{${name}}}`).join(", ")} before sending.`
        : "Your page selection was filled in. Edit it or press Enter to send.",
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 space-y-2 px-3 pt-3 pb-2">
        <label htmlFor="extension-prompt-search" className="sr-only">
          Search prompts
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="extension-prompt-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search browser prompts…"
            className="h-9 pl-8 text-[13px]"
            autoComplete="off"
          />
        </div>
        <div
          role="group"
          aria-label="Filter prompts"
          className="-mx-3 flex [scrollbar-width:none] gap-1.5 overflow-x-auto px-3"
        >
          {FILTERS.map((option) => {
            const selected = option.value === filter;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "h-8 shrink-0 rounded-full border px-3 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
                  selected
                    ? "border-primary/30 bg-primary/10 text-primary-text"
                    : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        {prompts.length === 0 ? (
          <EmptyState
            size="sm"
            icon={SearchX}
            title={filter === "favorites" && !deferredQuery ? "No favorites yet" : "No prompts found"}
            description={
              filter === "favorites" && !deferredQuery
                ? "Star a prompt to keep it one click away, here and in the web app."
                : "Try another search or category."
            }
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
              >
                Show all prompts
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                compact
                isFavorite={favoriteIds.includes(prompt.id)}
                onToggleFavorite={toggleFavorite}
                onUse={applyPrompt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
