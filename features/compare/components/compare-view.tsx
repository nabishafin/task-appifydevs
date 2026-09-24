"use client";

import { ArrowLeftRight, Loader2, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getModel } from "@/data/models";
import { useStartNewChat } from "@/features/chat/hooks/use-start-new-chat";
import { usePreferencesStore } from "@/store/preferences-store";
import { useUIStore } from "@/store/ui-store";
import { useCompareRun } from "../hooks/use-compare-run";
import { CompareColumn } from "./compare-column";

const SAMPLE_PROMPT = "Explain the difference between a process and a thread, with a real-world analogy.";

export function CompareView() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState(() => searchParams.get("prompt") ?? "");
  const [modelIds, setModelIds] = useState<[string, string]>(["gpt-5", "claude-sonnet-4-5"]);
  const [preferred, setPreferred] = useState<number | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const responseStyle = usePreferencesStore((state) => state.responseStyle);
  const setComposerDraft = useUIStore((state) => state.setComposerDraft);
  const startNewChat = useStartNewChat();
  const { results, runAll, runSlot, isRunning } = useCompareRun(2);

  const canRun = prompt.trim().length > 0 && !isRunning && modelIds[0] !== modelIds[1];

  function run() {
    if (!canRun) return;
    setPreferred(null);
    setLastPrompt(prompt.trim());
    runAll(prompt.trim(), modelIds, responseStyle);
  }

  function setModel(index: 0 | 1, modelId: string) {
    setModelIds((current) => (index === 0 ? [modelId, current[1]] : [current[0], modelId]));
  }

  function prefer(index: number) {
    const next = preferred === index ? null : index;
    setPreferred(next);
    if (next !== null)
      toast.success(`You preferred ${getModel(modelIds[next]).name}`, {
        description: "Feedback helps tune your default model.",
      });
  }

  function continueInChat(index: number) {
    setComposerDraft(lastPrompt);
    startNewChat(modelIds[index]);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Compare models side by side</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send one prompt to two models and judge the answers together, not tab by tab.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          run();
        }}
        className="rounded-lg border border-border bg-card p-3 shadow-sm focus-within:border-border-strong"
      >
        <Label htmlFor="compare-prompt" className="sr-only">
          Prompt to compare
        </Label>
        <Textarea
          id="compare-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
              event.preventDefault();
              run();
            }
          }}
          rows={3}
          placeholder="Ask something both models should answer…"
          className="min-h-20 resize-none border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
        />
        <div className="flex flex-wrap items-center gap-2 px-1 pt-2">
          {!prompt && (
            <Button type="button" size="sm" variant="ghost" onClick={() => setPrompt(SAMPLE_PROMPT)}>
              Try a sample prompt
            </Button>
          )}
          {modelIds[0] === modelIds[1] && (
            <p role="alert" className="text-xs text-warning">
              Choose two different models to compare.
            </p>
          )}
          <TooltipIconButton
            label="Swap model order"
            className="ml-auto"
            onClick={() => setModelIds(([first, second]) => [second, first])}
          >
            <ArrowLeftRight aria-hidden="true" />
          </TooltipIconButton>
          <Button type="submit" disabled={!canRun}>
            {isRunning ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Send aria-hidden="true" />}
            {isRunning ? "Comparing…" : "Compare"}
          </Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <CompareColumn
          label="First model"
          modelId={modelIds[0]}
          onModelChange={(modelId) => setModel(0, modelId)}
          result={results[0]}
          isPreferred={preferred === 0}
          onPrefer={() => prefer(0)}
          onRetry={() => void runSlot(0, lastPrompt, modelIds[0], responseStyle)}
          onContinue={() => continueInChat(0)}
        />
        <CompareColumn
          label="Second model"
          modelId={modelIds[1]}
          onModelChange={(modelId) => setModel(1, modelId)}
          result={results[1]}
          isPreferred={preferred === 1}
          onPrefer={() => prefer(1)}
          onRetry={() => void runSlot(1, lastPrompt, modelIds[1], responseStyle)}
          onContinue={() => continueInChat(1)}
        />
      </div>
    </div>
  );
}
