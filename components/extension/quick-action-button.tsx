import { cn } from "@/lib/utils";
import type { QuickAction } from "@/types/extension";

interface QuickActionButtonProps {
  action: QuickAction;
  onRun: (action: QuickAction) => void;
  variant?: "card" | "chip";
  disabled?: boolean;
}

export function QuickActionButton({ action, onRun, variant = "card", disabled = false }: QuickActionButtonProps) {
  const Icon = action.icon;

  if (variant === "chip") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onRun(action)}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors outline-none hover:border-border-strong hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
        {action.label}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onRun(action)}
      className={cn(
        "group/action flex min-h-[4.25rem] flex-col items-start gap-1.5 rounded-lg border border-border bg-card p-2.5 text-left transition-[border-color,background-color,transform] outline-none",
        "hover:-translate-y-px hover:border-border-strong hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50",
      )}
    >
      <span className="flex w-full items-center gap-2">
        <span className="flex size-6 items-center justify-center rounded-md bg-background-subtle text-muted-foreground transition-colors group-hover/action:text-primary-text">
          <Icon className="size-3.5" aria-hidden="true" />
        </span>
        <span className="truncate text-[13px] font-medium text-foreground">{action.label}</span>
      </span>
      <span className="text-xs leading-snug text-muted-foreground">
        {action.description}
        {action.requiresSelection && <span className="sr-only"> (uses your selected text)</span>}
      </span>
    </button>
  );
}
