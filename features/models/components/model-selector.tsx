"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ModelIcon } from "@/components/shared/model-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CAPABILITY_LABELS, getModel, getProvider, MODELS } from "@/data/models";
import { cn } from "@/lib/utils";
import type { AIModel, ProviderId } from "@/types/models";

interface ModelSelectorProps {
  value: string;
  onValueChange: (modelId: string) => void;
  /** "compact" is sized for the extension popup. */
  variant?: "default" | "compact";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}

function groupByProvider(models: AIModel[]) {
  const groups = new Map<ProviderId, AIModel[]>();
  for (const model of models) {
    groups.set(model.providerId, [...(groups.get(model.providerId) ?? []), model]);
  }
  return Array.from(groups, ([providerId, items]) => ({ provider: getProvider(providerId), items }));
}

export function ModelSelector({
  value,
  onValueChange,
  variant = "default",
  open: openProp,
  onOpenChange,
  align = "start",
  side = "top",
  className,
}: ModelSelectorProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = openProp ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const selected = getModel(value);
  const groups = useMemo(() => groupByProvider(MODELS), []);
  const compact = variant === "compact";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Model: ${selected.name}. Change model`}
          className={cn(
            "gap-1.5 border border-border bg-background-subtle px-2 text-foreground hover:border-border-strong hover:bg-muted",
            compact && "h-7 px-1.5 text-xs",
            className,
          )}
        >
          <ModelIcon providerId={selected.providerId} size={compact ? "xs" : "sm"} />
          <span className="max-w-20 truncate sm:max-w-32">{selected.name}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={8}
        className={cn("p-0", compact ? "w-[min(18rem,calc(100vw-2rem))]" : "w-[min(24rem,calc(100vw-2rem))]")}
      >
        <Command
          // cmdk filters on `value`; include provider and tags so "google" or "coding" match.
          filter={(itemValue, search) => (itemValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
        >
          <CommandInput placeholder="Search models, providers or skills…" aria-label="Search models" />
          <CommandList className={compact ? "max-h-64" : "max-h-96"}>
            <CommandEmpty>No models match your search.</CommandEmpty>
            {groups.map(({ provider, items }) => (
              <CommandGroup key={provider.id} heading={provider.name}>
                {items.map((model) => {
                  const isSelected = model.id === value;
                  return (
                    <CommandItem
                      key={model.id}
                      value={`${model.name} ${provider.name} ${model.capabilities.join(" ")}`}
                      onSelect={() => {
                        onValueChange(model.id);
                        setOpen(false);
                      }}
                      data-checked={isSelected}
                      className="items-start gap-3 py-2 *:last:mt-1 data-[checked=true]:*:last:text-primary-text"
                    >
                      <ModelIcon providerId={model.providerId} size={compact ? "sm" : "md"} className="mt-0.5" />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-medium text-foreground">{model.name}</span>
                          {model.tier === "pro" && (
                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] text-primary-text">
                              Pro
                            </Badge>
                          )}
                          {model.isNew && !compact && (
                            <Sparkles className="size-3 text-highlight" aria-label="New model" />
                          )}
                        </div>
                        {!compact && <p className="line-clamp-1 text-xs text-muted-foreground">{model.description}</p>}
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.slice(0, compact ? 2 : 3).map((capability) => (
                            <span
                              key={capability}
                              className="rounded-md bg-muted px-1.5 py-px text-[10px] font-medium text-muted-foreground"
                            >
                              {CAPABILITY_LABELS[capability]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
