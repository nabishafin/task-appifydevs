import { Check, Copy, GitCompareArrows, PanelLeft, Plus, RotateCcw, Search, Star } from "lucide-react";
import { BrowserFrame } from "@/components/shared/browser-frame";
import { ModelIcon } from "@/components/shared/model-icon";
import { cn } from "@/lib/utils";
import type { ProviderId } from "@/types/models";
import { MockAssistantMessage, MockComposer, MockUserMessage } from "./mock-primitives";

interface MockConversation {
  title: string;
  providerId: ProviderId;
  active?: boolean;
}

const CONVERSATION_GROUPS: Array<{ label: string; items: MockConversation[] }> = [
  {
    label: "Today",
    items: [
      { title: "Chrome sidebar 2.0 launch email", providerId: "anthropic", active: true },
      { title: "Refactor auth middleware", providerId: "openai" },
      { title: "Summarize user interviews", providerId: "google" },
    ],
  },
  {
    label: "Previous 7 days",
    items: [
      { title: "Pricing page teardown", providerId: "openai" },
      { title: "SQL for weekly churn", providerId: "deepseek" },
      { title: "Lisbon offsite agenda", providerId: "mistral" },
      { title: "Onboarding copy in Spanish", providerId: "meta" },
    ],
  },
];

function MockSidebar() {
  return (
    <div className="hidden flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex items-center justify-between px-3 pt-3">
        <span className="inline-flex h-8 flex-1 items-center gap-2 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground">
          <Plus className="size-3.5" />
          New chat
        </span>
        <span className="ml-2 inline-flex size-8 items-center justify-center rounded-md text-subtle-foreground">
          <PanelLeft className="size-4" />
        </span>
      </div>
      <div className="mx-3 mt-3 flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-xs text-subtle-foreground">
        <Search className="size-3.5" />
        Search chats
        <span className="ml-auto rounded bg-muted px-1 text-[10px] font-medium text-muted-foreground">⌘K</span>
      </div>
      <div className="mt-4 flex-1 space-y-4 overflow-hidden px-2">
        {CONVERSATION_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-2 pb-1 text-[11px] font-medium text-subtle-foreground">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li
                  key={item.title}
                  className={cn(
                    "relative flex h-8 items-center gap-2 rounded-md px-2 text-xs",
                    item.active ? "bg-sidebar-accent font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />}
                  <ModelIcon providerId={item.providerId} size="xs" />
                  <span className="truncate">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-border p-3">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
          NR
        </span>
        <div className="min-w-0 text-xs">
          <p className="truncate font-medium text-foreground">Nadia Rahman</p>
          <p className="text-subtle-foreground">Pro plan</p>
        </div>
      </div>
    </div>
  );
}

function MockChat() {
  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex h-12 items-center gap-3 border-b border-border px-4">
        <p className="truncate text-sm font-medium text-foreground">Chrome sidebar 2.0 launch email</p>
        <span className="ml-auto hidden items-center gap-1 text-subtle-foreground sm:flex">
          <Star className="size-3.5" />
        </span>
        <span className="hidden h-7 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-muted-foreground sm:inline-flex">
          <GitCompareArrows className="size-3.5" />
          Compare
        </span>
      </div>

      <div className="flex-1 space-y-5 overflow-hidden px-4 py-5 sm:px-6">
        <MockUserMessage>
          Draft a launch email for Chrome sidebar 2.0. Under 150 words, friendly, and give me two subject lines.
        </MockUserMessage>

        <MockAssistantMessage providerId="anthropic" modelName="Claude Sonnet 4.5" meta="· 2.1s">
          <p className="text-foreground">Here are two subject lines and a draft you can send as-is.</p>
          <ol className="space-y-1.5">
            {["Your AI sidebar just got a lot smarter", "Ask any page anything, now in one click"].map(
              (subject, index) => (
                <li key={subject} className="flex gap-2">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-medium text-foreground">
                    {index + 1}
                  </span>
                  <span>{subject}</span>
                </li>
              ),
            )}
          </ol>
          <div className="rounded-lg border border-border bg-background-subtle p-3">
            <p className="text-xs font-medium text-foreground">Hi there,</p>
            <p className="mt-1.5">
              Sidebar 2.0 brings EchoGPT to every tab. Summarize long articles, rewrite a selection or draft a reply,
              then switch models without losing your place.
            </p>
            <ul className="mt-2 hidden space-y-1 sm:block">
              {["Six page-aware quick actions", "Pick GPT-5, Claude or Gemini per task"].map((point) => (
                <li key={point} className="flex items-center gap-2">
                  <Check className="size-3.5 shrink-0 text-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-subtle-foreground">
            {[
              { icon: Copy, label: "Copy" },
              { icon: RotateCcw, label: "Regenerate" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs">
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
            <span className="hidden h-7 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-muted-foreground sm:inline-flex">
              <ModelIcon providerId="openai" size="xs" />
              Ask GPT-5 instead
            </span>
          </div>
        </MockAssistantMessage>
      </div>

      <div className="px-4 pb-4 sm:px-6">
        <MockComposer providerId="anthropic" modelName="Claude Sonnet 4.5" />
      </div>
    </div>
  );
}

interface BrowserPreviewProps {
  className?: string;
}

/** Server-rendered screenshot of the redesigned web app, built from markup. */
export function BrowserPreview({ className }: BrowserPreviewProps) {
  return (
    <figure className={className}>
      <BrowserFrame url="echogpt.live/app" contentClassName="bg-background">
        <div
          aria-hidden="true"
          className="grid h-[480px] grid-cols-1 overflow-hidden select-none sm:h-[520px] md:grid-cols-[232px_minmax(0,1fr)] lg:h-[560px]"
        >
          <MockSidebar />
          <MockChat />
        </div>
      </BrowserFrame>
      <figcaption className="sr-only">
        The EchoGPT web app: a conversation list on the left and a chat where Claude Sonnet 4.5 drafts a launch email,
        with a composer to switch models.
      </figcaption>
    </figure>
  );
}
