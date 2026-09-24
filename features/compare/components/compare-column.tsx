"use client";

import { MessageSquarePlus, Sparkles, Timer, Trophy } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { CopyButton } from "@/components/shared/copy-button";
import { ErrorState, SkeletonLoader } from "@/components/shared/states";
import { Button } from "@/components/ui/button";
import { MessageContent } from "@/features/chat/components/message-content";
import { TypingIndicator } from "@/features/chat/components/typing-indicator";
import { blocksToPlainText } from "@/features/chat/lib/parse-inline";
import { ModelSelector } from "@/features/models/components/model-selector";
import { cn } from "@/lib/utils";
import type { CompareResult } from "../hooks/use-compare-run";

interface CompareColumnProps {
  label: string;
  modelId: string;
  onModelChange: (modelId: string) => void;
  result: CompareResult;
  isPreferred: boolean;
  onPrefer: () => void;
  onRetry: () => void;
  onContinue: () => void;
}

export function CompareColumn({
  label,
  modelId,
  onModelChange,
  result,
  isPreferred,
  onPrefer,
  onRetry,
  onContinue,
}: CompareColumnProps) {
  return (
    <section
      aria-label={label}
      aria-busy={result.status === "loading"}
      className={cn(
        "flex min-h-80 min-w-0 flex-col rounded-lg border bg-card transition-[border-color,box-shadow]",
        isPreferred ? "border-primary/60 shadow-sm ring-3 ring-primary/10" : "border-border",
      )}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <ModelSelector value={modelId} onValueChange={onModelChange} side="bottom" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {result.status === "success" && (
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" aria-hidden="true" />
              {(result.durationMs / 1000).toFixed(1)}s
            </span>
          )}
          {isPreferred && (
            <span className="flex items-center gap-1 font-medium text-primary-text">
              <Trophy className="size-3.5" aria-hidden="true" />
              Preferred
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 p-4 sm:p-5" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={result.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {result.status === "idle" && (
              <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Sparkles className="size-5 text-subtle-foreground" aria-hidden="true" />
                The answer from this model will appear here.
              </div>
            )}
            {result.status === "loading" && (
              <div className="space-y-4">
                <TypingIndicator modelId={result.modelId} />
                <SkeletonLoader variant="message" count={1} />
              </div>
            )}
            {result.status === "error" && <ErrorState description={result.message} onRetry={onRetry} />}
            {result.status === "success" && <MessageContent blocks={result.blocks} />}
          </m.div>
        </AnimatePresence>
      </div>

      {result.status === "success" && (
        <footer className="flex flex-wrap items-center gap-1 border-t border-border px-3 py-2">
          <CopyButton value={blocksToPlainText(result.blocks)} label="Copy answer" />
          <Button size="sm" variant={isPreferred ? "secondary" : "ghost"} aria-pressed={isPreferred} onClick={onPrefer}>
            <Trophy aria-hidden="true" />
            {isPreferred ? "Preferred" : "Prefer this"}
          </Button>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={onContinue}>
            <MessageSquarePlus aria-hidden="true" />
            Continue in chat
          </Button>
        </footer>
      )}
    </section>
  );
}
