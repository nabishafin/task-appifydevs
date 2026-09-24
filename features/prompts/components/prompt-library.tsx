"use client";

import { Plus, SearchX, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { FilterChips } from "@/components/shared/filter-chips";
import { EmptyState } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/data/prompts";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { usePromptStore } from "@/store/prompt-store";
import type { PromptCategory } from "@/types/prompts";
import { usePromptLauncher } from "../hooks/use-prompt-launcher";
import { filterPrompts } from "../lib/prompt-utils";
import { NewPromptDialog } from "./new-prompt-dialog";
import { PromptCard } from "./prompt-card";
import { UsePromptDialog } from "./use-prompt-dialog";

type LibraryFilter = PromptCategory | "all" | "favorites";

export function PromptLibrary() {
  const hydrated = useStoreHydrated(usePromptStore);
  const favoriteIds = usePromptStore((state) => state.favoritePromptIds);
  const customPrompts = usePromptStore((state) => state.customPrompts);
  const toggleFavoritePrompt = usePromptStore((state) => state.toggleFavoritePrompt);
  const { launch, dialogProps } = usePromptLauncher();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const [creating, setCreating] = useState(false);

  // Custom prompts only exist after the persisted store loads.
  const library = useMemo(
    () => [...(hydrated ? customPrompts : []), ...PROMPT_TEMPLATES.filter((prompt) => prompt.surfaces.includes("app"))],
    [hydrated, customPrompts],
  );
  const visible = useMemo(
    () => filterPrompts(library, { query, category: filter, favoriteIds }),
    [library, query, filter, favoriteIds],
  );

  const filterOptions = [
    { value: "all" as const, label: "All", count: library.length },
    {
      value: "favorites" as const,
      label: "Favorites",
      count: library.filter((prompt) => favoriteIds.includes(prompt.id)).length,
    },
    ...PROMPT_CATEGORIES.map((category) => ({
      value: category.id,
      label: category.label,
      count: library.filter((prompt) => prompt.category === category.id).length,
    })),
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Reusable prompts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Proven templates for writing, code, research and more.</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search prompts"
            aria-label="Search prompts"
            className="min-w-0 flex-1 sm:w-64"
          />
          <Button onClick={() => setCreating(true)}>
            <Plus aria-hidden="true" />
            New prompt
          </Button>
        </div>
      </div>

      <FilterChips label="Filter prompts" value={filter} onValueChange={setFilter} options={filterOptions} />

      {visible.length === 0 ? (
        <EmptyState
          icon={filter === "favorites" ? Star : SearchX}
          title={filter === "favorites" ? "No favorite prompts yet" : "No prompts match"}
          description={
            filter === "favorites"
              ? "Star a prompt to keep it one click away."
              : "Try a different search, or create your own prompt."
          }
          action={
            filter !== "favorites" && (
              <Button variant="outline" onClick={() => setCreating(true)}>
                <Plus aria-hidden="true" />
                Create a prompt
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isFavorite={favoriteIds.includes(prompt.id)}
              onToggleFavorite={toggleFavoritePrompt}
              onUse={launch}
            />
          ))}
        </div>
      )}

      <NewPromptDialog open={creating} onOpenChange={setCreating} />
      <UsePromptDialog {...dialogProps} />
    </div>
  );
}
