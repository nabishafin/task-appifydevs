import { Check } from "lucide-react";
import { ModelIcon } from "@/components/shared/model-icon";
import { QUICK_ACTIONS } from "@/data/extension";
import { MODELS, getProvider } from "@/data/models";
import { cn } from "@/lib/utils";

/*
 * Tiny, decorative UI fragments shown beside the spotlight features.
 * Each root is aria-hidden because the surrounding copy already describes the feature.
 */

const SWITCHER_MODELS = ["gpt-5", "claude-sonnet-4-5", "gemini-2-5-pro", "deepseek-r1"]
  .map((id) => MODELS.find((model) => model.id === id))
  .filter((model) => model !== undefined);

export function ModelSwitcherIllustration() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-border bg-background p-1.5 shadow-sm">
      <p className="px-2.5 pt-1.5 pb-2 text-[11px] font-medium text-subtle-foreground">Choose a model</p>
      <ul className="space-y-0.5">
        {SWITCHER_MODELS.map((model, index) => {
          const selected = index === 1;
          return (
            <li
              key={model.id}
              className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs", selected && "bg-muted")}
            >
              <ModelIcon providerId={model.providerId} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{model.name}</span>
                <span className="block truncate text-subtle-foreground">{getProvider(model.providerId).name}</span>
              </span>
              {model.tier === "pro" && (
                <span className="rounded-full border border-border px-1.5 text-[10px] text-muted-foreground">Pro</span>
              )}
              <Check className={cn("size-3.5 text-primary-text", !selected && "invisible")} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const THREAD = [
  { speaker: "You", text: "Review this migration plan for risks." },
  { speaker: "Claude Sonnet 4.5", providerId: "anthropic", text: "Three risks stand out: the lock on orders…" },
  { speaker: "You", text: "Now turn it into a status update." },
  { speaker: "GPT-5", providerId: "openai", text: "Migration update: on track for Friday…" },
] as const;

/** One conversation where consecutive replies come from different models. */
export function MixedThreadIllustration({ className }: { className?: string }) {
  return (
    <ol
      aria-hidden="true"
      className={cn("flex-col justify-center gap-2 rounded-xl border border-border bg-background p-3", className)}
    >
      {THREAD.map((turn, index) => (
        <li key={index} className="flex items-start gap-2 text-[11px] leading-relaxed">
          {"providerId" in turn ? (
            <ModelIcon providerId={turn.providerId} size="xs" className="mt-0.5" />
          ) : (
            <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[5px] bg-muted text-[8px] font-semibold text-foreground">
              Y
            </span>
          )}
          <span className="min-w-0">
            <span className="block font-medium text-foreground">{turn.speaker}</span>
            <span className="block truncate text-muted-foreground">{turn.text}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export function CompareIllustration() {
  const columns = [
    { providerId: "openai", name: "GPT-5", widths: ["w-full", "w-4/5", "w-11/12", "w-2/3"] },
    { providerId: "anthropic", name: "Claude Sonnet 4.5", widths: ["w-11/12", "w-full", "w-3/4", "w-5/6"] },
  ] as const;

  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-2">
      {columns.map((column) => (
        <div key={column.name} className="rounded-lg border border-border bg-background p-2.5">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
            <ModelIcon providerId={column.providerId} size="xs" />
            <span className="truncate">{column.name}</span>
          </p>
          <div className="mt-2.5 space-y-1.5">
            {column.widths.map((width, index) => (
              <span key={index} className={cn("block h-1.5 rounded-full bg-muted", width)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function QuickActionsIllustration() {
  return (
    <ul aria-hidden="true" className="flex flex-wrap gap-1.5">
      {QUICK_ACTIONS.map(({ id, label, icon: Icon }) => (
        <li
          key={id}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-background px-2.5 text-[11px] font-medium text-muted-foreground"
        >
          <Icon className="size-3 text-primary-text" />
          {label}
        </li>
      ))}
    </ul>
  );
}
