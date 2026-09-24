import { ModelIcon } from "@/components/shared/model-icon";
import { CAPABILITY_LABELS, getProvider } from "@/data/models";
import { formatContextWindow } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AIModel } from "@/types/models";

/** Shared column template so the header and every row line up. */
export const MODEL_ROW_GRID = "md:grid md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,1.4fr)_5rem_4rem] md:gap-6";

export function ModelRow({ model }: { model: AIModel }) {
  const provider = getProvider(model.providerId);
  const isPro = model.tier === "pro";

  return (
    <article className={cn("flex flex-col gap-3 px-4 py-4 sm:px-5 md:items-center", MODEL_ROW_GRID)}>
      <div className="flex min-w-0 items-center gap-3">
        <ModelIcon providerId={model.providerId} size="md" />
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="truncate">{model.name}</span>
            {model.isNew && <span className="text-[11px] font-medium text-highlight">New</span>}
          </h3>
          <p className="text-xs text-muted-foreground">{provider.name}</p>
        </div>
        <span
          className={cn("ml-auto text-xs font-medium md:hidden", isPro ? "text-primary-text" : "text-muted-foreground")}
        >
          {isPro ? "Pro" : "Free"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{model.description}</p>

      <p className="text-xs text-muted-foreground" aria-label={`${model.name} capabilities`}>
        {model.capabilities.map((capability) => CAPABILITY_LABELS[capability]).join(" · ")}
      </p>

      <p className="text-xs text-muted-foreground md:text-sm">
        <span className="font-medium text-foreground tabular-nums">{formatContextWindow(model.contextWindow)}</span>
        <span className="md:sr-only"> context</span>
      </p>

      <p className={cn("hidden text-sm font-medium md:block", isPro ? "text-primary-text" : "text-muted-foreground")}>
        {isPro ? "Pro" : "Free"}
        <span className="sr-only"> plan</span>
      </p>
    </article>
  );
}
