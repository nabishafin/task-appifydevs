import { Check, CornerDownLeft, Search, Star } from "lucide-react";
import { ModelIcon } from "@/components/shared/model-icon";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { KEYBOARD_SHORTCUTS } from "@/constants/shortcuts";
import { QUICK_ACTIONS } from "@/data/extension";
import { MODELS, getProvider } from "@/data/models";
import { cn } from "@/lib/utils";

/*
 * Tiny, decorative UI fragments shown inside the larger feature cards.
 * Each root is aria-hidden because the card text already describes the feature.
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

export function PromptVariablesIllustration() {
  return (
    <p
      aria-hidden="true"
      className="rounded-lg border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-muted-foreground"
    >
      Rewrite this for <span className="rounded bg-primary/12 px-1 text-primary-text">{"{{audience}}"}</span> in a{" "}
      <span className="rounded bg-primary/12 px-1 text-primary-text">{"{{tone}}"}</span> tone. Keep every fact.
    </p>
  );
}

const HISTORY_ROWS = [
  { title: "Debounced search hook in React", providerId: "anthropic", tag: "Code", favorite: true },
  { title: "RAG vs fine-tuning for support docs", providerId: "google", tag: "Research", favorite: true },
  { title: "Q4 OKRs for the growth team", providerId: "openai", tag: "Work", favorite: false },
] as const;

export function HistorySearchIllustration() {
  return (
    <div aria-hidden="true" className="rounded-xl border border-border bg-background p-1.5">
      <div className="flex h-8 items-center gap-2 rounded-lg border border-border px-2.5 text-[11px] text-muted-foreground">
        <Search className="size-3" />
        <span className="text-foreground">hook</span>
        <span className="ml-auto text-subtle-foreground">3 results</span>
      </div>
      <ul className="mt-1.5 space-y-0.5">
        {HISTORY_ROWS.map((row) => (
          <li key={row.title} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px]">
            <ModelIcon providerId={row.providerId} size="xs" />
            <span className="min-w-0 flex-1 truncate text-foreground">{row.title}</span>
            {row.favorite && <Star className="size-3 fill-warning text-warning" />}
            <span className="rounded-full border border-border px-1.5 text-[10px] text-muted-foreground">
              {row.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SAVED_PROMPTS = [
  { title: "Review my code", category: "Coding", surfaces: ["App", "Extension"] },
  { title: "Meeting notes to actions", category: "Business", surfaces: ["App", "Extension"] },
  { title: "Reply to this thread", category: "Productivity", surfaces: ["Extension"] },
] as const;

export function SavedPromptsIllustration() {
  return (
    <ul aria-hidden="true" className="grid gap-2 sm:grid-cols-3">
      {SAVED_PROMPTS.map((prompt) => (
        <li key={prompt.title} className="rounded-lg border border-border bg-background p-2.5">
          <p className="text-[10px] font-medium tracking-wide text-primary-text uppercase">{prompt.category}</p>
          <p className="mt-1 truncate text-[11px] font-medium text-foreground">{prompt.title}</p>
          <p className="mt-2 flex flex-wrap gap-1">
            {prompt.surfaces.map((surface) => (
              <span key={surface} className="rounded bg-muted px-1.5 py-px text-[10px] text-muted-foreground">
                {surface}
              </span>
            ))}
          </p>
        </li>
      ))}
    </ul>
  );
}

const PALETTE_SHORTCUT_IDS = ["new-chat", "model", "sidebar", "shortcuts"];
const PALETTE_ITEMS = KEYBOARD_SHORTCUTS.filter((shortcut) => PALETTE_SHORTCUT_IDS.includes(shortcut.id));

export function CommandPaletteIllustration() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="flex h-10 items-center gap-2 border-b border-border px-3 text-xs text-subtle-foreground">
        <Search className="size-3.5" />
        Search or run a command
        <ShortcutKeys keys={["mod", "K"]} className="ml-auto" />
      </div>
      <ul className="p-1.5">
        {PALETTE_ITEMS.map((shortcut, index) => (
          <li
            key={shortcut.id}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-muted-foreground",
              index === 0 && "bg-muted text-foreground",
            )}
          >
            <span className="min-w-0 flex-1 truncate">{shortcut.label}</span>
            {index === 0 && <CornerDownLeft className="size-3 text-subtle-foreground" />}
            <ShortcutKeys keys={shortcut.keys} />
          </li>
        ))}
      </ul>
    </div>
  );
}
