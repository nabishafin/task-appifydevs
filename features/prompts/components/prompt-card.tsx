"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { m } from "motion/react";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PromptTemplate } from "@/types/prompts";
import { getCategoryLabel } from "../lib/prompt-utils";

interface PromptCardProps {
  prompt: PromptTemplate;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onUse: (prompt: PromptTemplate) => void;
  compact?: boolean;
  className?: string;
}

export function PromptCard({
  prompt,
  isFavorite,
  onToggleFavorite,
  onUse,
  compact = false,
  className,
}: PromptCardProps) {
  return (
    <m.article
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group/prompt relative flex flex-col rounded-xl border border-border bg-card transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-sm",
        compact ? "gap-2 p-3" : "gap-3 p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-medium tracking-wide text-primary-text uppercase">
            {getCategoryLabel(prompt.category)}
          </p>
          <h3 className={cn("font-medium text-foreground", compact ? "text-sm" : "text-[0.95rem]")}>{prompt.title}</h3>
        </div>
        <TooltipIconButton
          label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          size="icon-xs"
          onClick={() => onToggleFavorite(prompt.id)}
          className={cn("-mt-0.5 -mr-1", isFavorite && "text-warning hover:text-warning")}
        >
          <Star className={cn(isFavorite && "fill-current")} aria-hidden="true" />
        </TooltipIconButton>
      </div>

      <p className={cn("text-muted-foreground", compact ? "line-clamp-2 text-xs" : "text-sm")}>{prompt.description}</p>

      {!compact && (
        <div className="rounded-lg border border-border bg-background-subtle px-3 py-2">
          <p className="line-clamp-2 font-mono text-xs leading-5 text-muted-foreground">{prompt.prompt}</p>
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="text-xs text-subtle-foreground">
          {prompt.uses > 0 ? `${formatCompactNumber(prompt.uses)} uses` : "Your prompt"}
        </span>
        <Button size={compact ? "xs" : "sm"} variant="secondary" onClick={() => onUse(prompt)}>
          Use prompt
          <ArrowUpRight aria-hidden="true" />
        </Button>
      </div>
    </m.article>
  );
}
