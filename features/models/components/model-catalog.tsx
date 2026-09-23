"use client";

import { Check, MessageSquarePlus, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterChips } from "@/components/shared/filter-chips";
import { ModelIcon } from "@/components/shared/model-icon";
import { EmptyState } from "@/components/shared/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CAPABILITY_LABELS, getProvider, MODELS } from "@/data/models";
import { formatContextWindow } from "@/lib/format";
import { cn, matchesQuery } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import type { AIModel, ModelCapability } from "@/types/models";

const CAPABILITY_FILTERS = ["all", ...(Object.keys(CAPABILITY_LABELS) as ModelCapability[])] as const;
type CapabilityFilter = (typeof CAPABILITY_FILTERS)[number];

function ModelCatalogCard({
  model,
  isDefault,
  onChat,
  onSetDefault,
}: {
  model: AIModel;
  isDefault: boolean;
  onChat: (model: AIModel) => void;
  onSetDefault: (model: AIModel) => void;
}) {
  const provider = getProvider(model.providerId);

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-[border-color,box-shadow] hover:border-border-strong hover:shadow-sm">
      <div className="flex items-start gap-3">
        <ModelIcon providerId={model.providerId} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-2 font-medium text-foreground">
            <span className="truncate">{model.name}</span>
            {model.isNew && (
              <Badge variant="secondary" className="text-highlight">
                New
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">{provider.name}</p>
        </div>
        <Badge variant="outline" className={cn(model.tier === "pro" && "text-primary-text")}>
          {model.tier === "pro" ? "Pro" : "Free"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{model.description}</p>
      <ul className="flex flex-wrap gap-1.5" aria-label="Capabilities">
        {model.capabilities.map((capability) => (
          <li key={capability} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {CAPABILITY_LABELS[capability]}
          </li>
        ))}
      </ul>
      <p className="text-xs text-subtle-foreground">{formatContextWindow(model.contextWindow)} token context window</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <Button size="sm" onClick={() => onChat(model)}>
          <MessageSquarePlus aria-hidden="true" />
          Chat with {model.name}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSetDefault(model)}
          disabled={isDefault}
          aria-pressed={isDefault}
        >
          {isDefault && <Check aria-hidden="true" />}
          {isDefault ? "Default model" : "Set as default"}
        </Button>
      </div>
    </article>
  );
}

export function ModelCatalog() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [capability, setCapability] = useState<CapabilityFilter>("all");
  const startNewChat = useChatStore((state) => state.startNewChat);
  const defaultModelId = usePreferencesStore((state) => state.defaultModelId);
  const setPreference = usePreferencesStore((state) => state.setPreference);

  const models = useMemo(
    () =>
      MODELS.filter(
        (model) =>
          (capability === "all" || model.capabilities.includes(capability)) &&
          matchesQuery(query, [model.name, getProvider(model.providerId).name, model.description]),
      ),
    [query, capability],
  );

  function chatWith(model: AIModel) {
    startNewChat(model.id);
    router.push("/app");
  }

  function setDefault(model: AIModel) {
    setPreference("defaultModelId", model.id);
    toast.success(`${model.name} is now your default model`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Every model, one workspace</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {MODELS.length} models from {new Set(MODELS.map((model) => model.providerId)).size} providers. Pick the
            right one for each task.
          </p>
        </div>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search models or providers"
          aria-label="Search models"
          className="sm:w-72"
        />
      </div>

      <FilterChips
        label="Filter by capability"
        value={capability}
        onValueChange={setCapability}
        options={CAPABILITY_FILTERS.map((value) => ({
          value,
          label: value === "all" ? "All" : CAPABILITY_LABELS[value],
        }))}
      />

      {models.length === 0 ? (
        <EmptyState icon={SearchX} title="No models match" description="Try another search or capability filter." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <ModelCatalogCard
              key={model.id}
              model={model}
              isDefault={model.id === defaultModelId}
              onChat={chatWith}
              onSetDefault={setDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}
