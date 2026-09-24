import { ArrowUp, ChevronDown, Globe, Paperclip } from "lucide-react";
import { ModelIcon } from "@/components/shared/model-icon";
import { cn } from "@/lib/utils";
import type { ProviderId } from "@/types/models";

/*
 * Building blocks for static product mocks. They render plain elements (no
 * buttons or inputs) because every mock is decorative and hidden from
 * assistive technology by its container.
 */

interface ModelPillProps {
  providerId: ProviderId;
  name: string;
  className?: string;
}

export function MockModelPill({ providerId, name, className }: ModelPillProps) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground",
        className,
      )}
    >
      <ModelIcon providerId={providerId} size="xs" />
      <span className="truncate">{name}</span>
      <ChevronDown className="size-3 shrink-0 text-subtle-foreground" />
    </span>
  );
}

export function MockUserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-lg rounded-br-md bg-user-message px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground">
        {children}
      </p>
    </div>
  );
}

interface AssistantMessageProps {
  providerId: ProviderId;
  modelName: string;
  children: React.ReactNode;
  meta?: string;
}

export function MockAssistantMessage({ providerId, modelName, children, meta }: AssistantMessageProps) {
  return (
    <div className="flex gap-3">
      <ModelIcon providerId={providerId} size="md" className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="flex items-center gap-2 text-xs">
          <span className="font-medium text-foreground">{modelName}</span>
          {meta && <span className="text-subtle-foreground">{meta}</span>}
        </p>
        <div className="space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

interface ComposerProps {
  providerId: ProviderId;
  modelName: string;
  placeholder?: string;
  className?: string;
}

export function MockComposer({
  providerId,
  modelName,
  placeholder = "Ask anything, or type / for prompts",
  className,
}: ComposerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-2.5 shadow-sm", className)}>
      <p className="px-1 pb-3 text-[13px] text-subtle-foreground">{placeholder}</p>
      <div className="flex items-center gap-1.5">
        <MockModelPill providerId={providerId} name={modelName} className="min-w-0" />
        <span className="hidden size-7 items-center justify-center rounded-md text-subtle-foreground sm:inline-flex">
          <Paperclip className="size-3.5" />
        </span>
        <span className="hidden size-7 items-center justify-center rounded-md text-subtle-foreground sm:inline-flex">
          <Globe className="size-3.5" />
        </span>
        <span className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ArrowUp className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

/** A grey bar standing in for a line of secondary text. */
export function MockLine({ className }: { className?: string }) {
  return <span className={cn("block h-2 rounded-full bg-muted", className)} />;
}
