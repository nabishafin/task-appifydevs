"use client";

import { ArrowUpRight, BookOpen, BriefcaseBusiness, Code2, ListChecks } from "lucide-react";
import { m } from "motion/react";
import { ModelIcon } from "@/components/shared/model-icon";
import { SUGGESTED_PROMPTS } from "@/data/conversations";
import { getModel, getProvider, MODELS } from "@/data/models";
import { cn } from "@/lib/utils";

const SUGGESTION_ICONS = {
  coding: Code2,
  business: BriefcaseBusiness,
  research: BookOpen,
  productivity: ListChecks,
} as const;

const FEATURED_MODEL_IDS = ["gpt-5", "claude-sonnet-4-5", "gemini-2-5-pro", "deepseek-v3"];

interface EmptyChatStateProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  onUseSuggestion: (prompt: string) => void;
  showSuggestions: boolean;
}

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };

export function EmptyChatState({
  selectedModelId,
  onSelectModel,
  onUseSuggestion,
  showSuggestions,
}: EmptyChatStateProps) {
  const selected = getModel(selectedModelId);
  const featured = FEATURED_MODEL_IDS.map((id) => MODELS.find((model) => model.id === id)).filter(
    (model) => model !== undefined,
  );

  return (
    <m.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-[8vh] pb-8 text-center"
    >
      <m.div variants={item} className="mb-4">
        <ModelIcon providerId={selected.providerId} size="lg" />
      </m.div>
      <m.h2 variants={item} className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        What can I help you with?
      </m.h2>
      <m.p variants={item} className="mt-2 text-sm text-muted-foreground">
        You are chatting with <span className="font-medium text-foreground">{selected.name}</span>. Switch models any
        time — your context comes with you.
      </m.p>

      <m.div
        variants={item}
        role="group"
        aria-label="Quick model choice"
        className="mt-6 flex flex-wrap justify-center gap-2"
      >
        {featured.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <button
              key={model.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectModel(model.id)}
              className={cn(
                "flex h-9 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
                isSelected
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              <ModelIcon providerId={model.providerId} size="xs" />
              {model.name}
              <span className="sr-only">by {getProvider(model.providerId).name}</span>
            </button>
          );
        })}
      </m.div>

      {showSuggestions && (
        <m.ul
          variants={container}
          aria-label="Suggested prompts"
          className="mt-10 grid w-full gap-2.5 text-left sm:grid-cols-2"
        >
          {SUGGESTED_PROMPTS.map((suggestion) => {
            const Icon = SUGGESTION_ICONS[suggestion.category];
            return (
              <m.li key={suggestion.id} variants={item}>
                <button
                  type="button"
                  onClick={() => onUseSuggestion(suggestion.prompt)}
                  className="group/suggestion flex h-full w-full items-start gap-3 rounded-lg border border-border bg-card p-3.5 text-left transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover/suggestion:text-primary-text">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{suggestion.title}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                      {suggestion.prompt}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-subtle-foreground opacity-0 transition-opacity group-hover/suggestion:opacity-100"
                    aria-hidden="true"
                  />
                </button>
              </m.li>
            );
          })}
        </m.ul>
      )}
    </m.div>
  );
}
