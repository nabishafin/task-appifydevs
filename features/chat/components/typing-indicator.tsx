import { ModelIcon } from "@/components/shared/model-icon";
import { getModel } from "@/data/models";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  modelId: string;
  className?: string;
  compact?: boolean;
}

export function TypingIndicator({ modelId, className, compact = false }: TypingIndicatorProps) {
  const model = getModel(modelId);

  return (
    <div role="status" aria-live="polite" className={cn("flex items-center gap-3", className)}>
      <ModelIcon providerId={model.providerId} size={compact ? "sm" : "md"} />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="flex gap-1" aria-hidden="true">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1.5 animate-pulse-dot rounded-full bg-primary"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
        <span>{model.name} is thinking…</span>
      </div>
    </div>
  );
}
