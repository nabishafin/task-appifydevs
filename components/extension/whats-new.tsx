import { Command, History, type LucideIcon, PanelBottom, Settings2, Zap } from "lucide-react";

const POINTS: Array<{ icon: LucideIcon; title: string; description: string }> = [
  {
    icon: PanelBottom,
    title: "Clear navigation",
    description:
      "Four tabs at thumb reach replace nested menus. Chat, history, prompts and settings are one click away.",
  },
  {
    icon: Command,
    title: "Compact model picker",
    description: "Switch between GPT-5, Claude, Gemini and more from the header, with instant confirmation.",
  },
  {
    icon: Zap,
    title: "Page-aware quick actions",
    description: "Summarize, explain, rewrite, translate or reply using the page and your selection as context.",
  },
  {
    icon: History,
    title: "Searchable history",
    description: "Conversations grouped by day with live search, so past answers are easy to find again.",
  },
  {
    icon: Settings2,
    title: "Focused settings",
    description: "Theme, default model, response length, shortcuts and privacy controls in one scrollable view.",
  },
];

export function WhatsNew() {
  return (
    <section aria-labelledby="whats-new-heading" className="space-y-4">
      <h2 id="whats-new-heading" className="text-lg font-semibold tracking-tight">
        What’s new in this redesign
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {POINTS.map(({ icon: Icon, title, description }) => (
          <li key={title} className="space-y-2 rounded-xl border border-border bg-card p-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-background-subtle text-primary-text">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-[13px] leading-5 text-muted-foreground">{description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
