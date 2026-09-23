import { ModelIcon } from "@/components/shared/model-icon";
import { CAPABILITY_LABELS, getProvider } from "@/data/models";
import { formatContextWindow } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AIModel } from "@/types/models";

interface ModelCardProps {
  model: AIModel;
  className?: string;
}

export function ModelCard({ model, className }: ModelCardProps) {
  const provider = getProvider(model.providerId);
  const isPro = model.tier === "pro";

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-border-strong",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <ModelIcon providerId={model.providerId} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-foreground">
            {model.name}
            {model.isNew && (
              <span className="rounded-full bg-primary/12 px-1.5 py-px text-[10px] font-semibold text-primary-text">
                New
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{provider.name}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{model.description}</p>

      <ul className="mt-4 mb-5 flex flex-wrap gap-1.5" aria-label={`${model.name} capabilities`}>
        {model.capabilities.map((capability) => (
          <li
            key={capability}
            className="rounded-md border border-border bg-background-subtle px-2 py-0.5 text-[11px] text-muted-foreground"
          >
            {CAPABILITY_LABELS[capability]}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-4 text-xs">
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">{formatContextWindow(model.contextWindow)}</span>{" "}
          context
        </p>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium",
            isPro ? "border-primary/30 text-primary-text" : "border-border text-muted-foreground",
          )}
        >
          {isPro ? "Pro" : "Free"}
          <span className="sr-only"> plan</span>
        </span>
      </div>
    </article>
  );
}
