"use client";

import { Columns2, Cpu, Gauge, Layers, MessageSquare } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { ModelIcon } from "@/components/shared/model-icon";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CAPABILITY_LABELS, getModel, getProvider } from "@/data/models";
import { useStoreHydrated } from "@/hooks/use-store-hydrated";
import { formatContextWindow } from "@/lib/format";
import { selectActiveConversation, useChatStore } from "@/store/chat-store";
import { useUIStore } from "@/store/ui-store";

const SPEED_LABELS = { fast: "Fast", balanced: "Balanced", thorough: "Thorough" } as const;

function DetailRow({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" aria-hidden="true" />
        {label}
      </dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

/** Right-hand details panel for the chat view (xl screens and up). */
export function UtilityPanel() {
  const open = useUIStore((state) => state.utilityPanelOpen);
  const hydrated = useStoreHydrated(useUIStore);
  const selectedModelId = useChatStore((state) => state.selectedModelId);
  const conversation = useChatStore(selectActiveConversation);
  const model = getModel(selectedModelId);
  const provider = getProvider(model.providerId);
  const messageCount = conversation?.messages.length ?? 0;

  return (
    <AnimatePresence initial={false}>
      {hydrated && open && (
        <m.aside
          aria-label="Conversation details"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 300, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="hidden shrink-0 overflow-hidden border-l border-border bg-background-subtle xl:block"
        >
          <div className="h-full w-[300px] thin-scrollbar space-y-6 overflow-y-auto p-5">
            <section aria-labelledby="panel-model">
              <h2 id="panel-model" className="mb-3 text-xs font-medium tracking-wide text-subtle-foreground uppercase">
                Active model
              </h2>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <ModelIcon providerId={model.providerId} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{provider.name}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto text-primary-text">
                    {model.tier === "pro" ? "Pro" : "Free"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{model.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Capabilities">
                  {model.capabilities.map((capability) => (
                    <li key={capability} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {CAPABILITY_LABELS[capability]}
                    </li>
                  ))}
                </ul>
                <dl className="mt-3 divide-y divide-border border-t border-border">
                  <DetailRow
                    icon={Layers}
                    label="Context window"
                    value={`${formatContextWindow(model.contextWindow)} tokens`}
                  />
                  <DetailRow icon={Gauge} label="Speed" value={SPEED_LABELS[model.speed]} />
                  <DetailRow icon={MessageSquare} label="Messages here" value={String(messageCount)} />
                </dl>
              </div>
            </section>

            <section aria-labelledby="panel-actions" className="space-y-2">
              <h2
                id="panel-actions"
                className="mb-3 text-xs font-medium tracking-wide text-subtle-foreground uppercase"
              >
                Quick actions
              </h2>
              <Button asChild variant="outline" className="w-full justify-start bg-card">
                <Link href="/app/compare">
                  <Columns2 aria-hidden="true" />
                  Compare with another model
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-card">
                <Link href="/app/models">
                  <Cpu aria-hidden="true" />
                  Browse all models
                </Link>
              </Button>
            </section>

            <section aria-labelledby="panel-tips">
              <h2 id="panel-tips" className="mb-3 text-xs font-medium tracking-wide text-subtle-foreground uppercase">
                Shortcuts
              </h2>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="flex items-center justify-between gap-2">
                  Switch model <ShortcutKeys keys={["mod", "M"]} />
                </li>
                <li className="flex items-center justify-between gap-2">
                  Command palette <ShortcutKeys keys={["mod", "K"]} />
                </li>
                <li className="flex items-center justify-between gap-2">
                  Focus composer <ShortcutKeys keys={["/"]} />
                </li>
              </ul>
            </section>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
