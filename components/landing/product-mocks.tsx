import { BookMarked, Globe, PanelRight, Search, Sparkles, X } from "lucide-react";
import { LogoMark } from "@/components/shared/logo";
import { DEMO_PAGE, QUICK_ACTIONS } from "@/data/extension";
import { PROMPT_CATEGORIES, PROMPT_TEMPLATES } from "@/data/prompts";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MockAssistantMessage, MockComposer, MockLine, MockUserMessage } from "./mock-primitives";

/*
 * Static screens for the product preview tabs. Containers mark them
 * aria-hidden; the tab panel copy describes what each screen shows.
 */

const MOCK_HEIGHT = "h-[440px] sm:h-[480px]";

const COMPARE_ANSWERS = [
  {
    providerId: "openai",
    modelName: "GPT-5",
    meta: "· 3.4s",
    intro: "Go with the annual plan if the team is above 8 seats.",
    points: [
      "Break-even is month 9 at the current seat count",
      "Annual locks in the price before the Q1 increase",
      "Keep 2 seats on monthly for contractors",
    ],
  },
  {
    providerId: "anthropic",
    modelName: "Claude Sonnet 4.5",
    meta: "· 2.8s",
    intro: "Annual is cheaper, but only if headcount stays stable.",
    points: [
      "Saves $1,440 a year at 10 seats",
      "Risky if hiring slows: unused seats are not refunded",
      "Ask sales for a mid-term seat adjustment clause",
    ],
  },
] as const;

export function CompareMock() {
  return (
    <div aria-hidden="true" className={cn("flex flex-col bg-background select-none", MOCK_HEIGHT)}>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
        <p className="truncate text-sm font-medium text-foreground">Compare · Annual vs monthly billing</p>
        <span className="ml-auto rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
          2 models
        </span>
      </div>
      <div className="px-4 pt-4 sm:px-6">
        <MockUserMessage>Should our 10-person team switch to annual billing? Give me a recommendation.</MockUserMessage>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-4 sm:grid-cols-2 sm:px-6">
        {COMPARE_ANSWERS.map((answer, index) => (
          <div
            key={answer.modelName}
            className={cn(
              "flex-col rounded-xl border border-border bg-card p-4",
              index === 0 ? "flex" : "hidden sm:flex",
            )}
          >
            <MockAssistantMessage providerId={answer.providerId} modelName={answer.modelName} meta={answer.meta}>
              <p className="text-foreground">{answer.intro}</p>
              <ul className="list-disc space-y-1 pl-4 marker:text-subtle-foreground">
                {answer.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </MockAssistantMessage>
            <div className="mt-auto flex items-center gap-2 pt-4 text-[11px] text-subtle-foreground">
              <span className="inline-flex h-6 items-center rounded-md border border-border px-2">
                Continue with this
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const LIBRARY_TEMPLATES = PROMPT_TEMPLATES.slice(0, 6);
const CATEGORY_LABELS = new Map(PROMPT_CATEGORIES.map((category) => [category.id, category.label]));

export function PromptLibraryMock() {
  return (
    <div
      aria-hidden="true"
      className={cn("grid bg-background select-none md:grid-cols-[200px_minmax(0,1fr)]", MOCK_HEIGHT)}
    >
      <div className="hidden flex-col gap-0.5 border-r border-border bg-sidebar p-3 md:flex">
        <p className="flex items-center gap-2 px-2 pb-2 text-xs font-medium text-foreground">
          <BookMarked className="size-3.5 text-primary-text" />
          Prompt library
        </p>
        {[{ id: "all", label: "All templates" }, ...PROMPT_CATEGORIES].map((category, index) => (
          <span
            key={category.id}
            className={cn(
              "flex h-8 items-center rounded-md px-2 text-xs",
              index === 0 ? "bg-sidebar-accent font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {category.label}
          </span>
        ))}
      </div>
      <div className="flex min-w-0 flex-col overflow-hidden p-4 sm:p-5">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs text-subtle-foreground">
          <Search className="size-3.5" />
          Search {PROMPT_TEMPLATES.length} templates
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {LIBRARY_TEMPLATES.map((template) => (
            <li key={template.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3.5">
              <p className="flex items-center justify-between gap-2 text-[11px] text-subtle-foreground">
                <span className="rounded-md bg-muted px-1.5 py-px text-muted-foreground">
                  {CATEGORY_LABELS.get(template.category)}
                </span>
                {formatCompactNumber(template.uses)} uses
              </p>
              <p className="text-sm font-medium text-foreground">{template.title}</p>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{template.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const SIDEBAR_ACTIONS = QUICK_ACTIONS.slice(0, 4);

export function ExtensionSidebarMock() {
  return (
    <div
      aria-hidden="true"
      className={cn("grid bg-background select-none md:grid-cols-[minmax(0,1fr)_320px]", MOCK_HEIGHT)}
    >
      <div className="hidden overflow-hidden px-8 py-7 md:block lg:px-12">
        <p className="flex items-center gap-1.5 text-[11px] text-subtle-foreground">
          <Globe className="size-3" />
          {DEMO_PAGE.domain} · {DEMO_PAGE.readTime}
        </p>
        <p className="mt-3 max-w-lg text-xl font-semibold tracking-tight text-foreground">{DEMO_PAGE.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">By {DEMO_PAGE.author}</p>
        <div className="mt-5 max-w-lg space-y-3 text-[13px] leading-relaxed text-muted-foreground">
          <p>{DEMO_PAGE.paragraphs[0]}</p>
          <p>
            <mark className="rounded-sm bg-primary/15 px-0.5 text-foreground">{DEMO_PAGE.selection}</mark>
          </p>
          <div className="space-y-2 pt-1">
            <MockLine className="w-full" />
            <MockLine className="w-11/12" />
            <MockLine className="w-4/5" />
          </div>
        </div>
      </div>

      <div className="flex min-w-0 flex-col border-border bg-card md:border-l">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
          <LogoMark className="size-6" />
          <span className="text-sm font-medium text-foreground">EchoGPT</span>
          <PanelRight className="ml-auto size-4 text-subtle-foreground" />
          <X className="size-4 text-subtle-foreground" />
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-3">
          <div className="grid grid-cols-2 gap-1.5">
            {SIDEBAR_ACTIONS.map(({ id, label, icon: Icon }, index) => (
              <span
                key={id}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-lg border px-2 text-[11px] font-medium",
                  index === 1
                    ? "border-primary/40 bg-primary/8 text-foreground"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0 text-primary-text" />
                <span className="truncate">{label}</span>
              </span>
            ))}
          </div>
          <MockAssistantMessage providerId="google" modelName="Gemini 2.5 Flash">
            <p className="flex items-center gap-1.5 text-[11px] text-subtle-foreground">
              <Sparkles className="size-3 text-primary-text" />
              Explaining your selection
            </p>
            <p className="text-foreground">
              Each time you jump between apps, it takes around 23 minutes to fully refocus.
            </p>
            <p>With over a thousand switches a day, most lost time comes from the gaps between tools.</p>
          </MockAssistantMessage>
          <MockComposer
            providerId="google"
            modelName="Gemini 2.5 Flash"
            placeholder="Ask about this page"
            className="mt-auto"
          />
        </div>
      </div>
    </div>
  );
}
