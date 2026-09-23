"use client";

import { BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PROMPT_TEMPLATES } from "@/data/prompts";
import { usePromptStore } from "@/store/prompt-store";
import type { PromptTemplate } from "@/types/prompts";
import { getCategoryLabel } from "../lib/prompt-utils";

interface PromptQuickInsertProps {
  onInsert: (prompt: PromptTemplate) => void;
}

/** Composer tool: search the prompt library and insert a template without leaving the chat. */
export function PromptQuickInsert({ onInsert }: PromptQuickInsertProps) {
  const [open, setOpen] = useState(false);
  const favoriteIds = usePromptStore((state) => state.favoritePromptIds);
  const customPrompts = usePromptStore((state) => state.customPrompts);

  const all = [...customPrompts, ...PROMPT_TEMPLATES.filter((prompt) => prompt.surfaces.includes("app"))];
  const favorites = all.filter((prompt) => favoriteIds.includes(prompt.id));

  function select(prompt: PromptTemplate) {
    onInsert(prompt);
    setOpen(false);
  }

  const renderItem = (prompt: PromptTemplate, keyPrefix: string) => (
    <CommandItem
      key={`${keyPrefix}-${prompt.id}`}
      value={`${keyPrefix} ${prompt.title} ${prompt.category}`}
      onSelect={() => select(prompt)}
    >
      {keyPrefix === "favorite" ? (
        <Star className="text-warning" aria-hidden="true" />
      ) : (
        <BookOpen aria-hidden="true" />
      )}
      <span className="min-w-0 flex-1 truncate">{prompt.title}</span>
      <span className="text-xs text-muted-foreground">{getCategoryLabel(prompt.category)}</span>
    </CommandItem>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TooltipIconButton label="Insert a saved prompt" aria-expanded={open}>
          <BookOpen aria-hidden="true" />
        </TooltipIconButton>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" sideOffset={8} className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <Command>
          <CommandInput placeholder="Search prompts…" aria-label="Search prompts" />
          <CommandList className="max-h-72">
            <CommandEmpty>No prompts found.</CommandEmpty>
            {favorites.length > 0 && (
              <CommandGroup heading="Favorites">
                {favorites.map((prompt) => renderItem(prompt, "favorite"))}
              </CommandGroup>
            )}
            <CommandGroup heading="Library">{all.map((prompt) => renderItem(prompt, "library"))}</CommandGroup>
          </CommandList>
          <div className="border-t border-border p-1">
            <Link
              href="/app/prompts"
              className="flex h-8 items-center justify-center rounded-md text-xs font-medium text-primary-text hover:bg-muted"
            >
              Browse the full prompt library
            </Link>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
