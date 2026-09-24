import { getModel, getProvider } from "@/data/models";
import { sleep, truncate } from "@/lib/utils";
import type { MessageBlock } from "@/types/chat";
import type { ModelSpeed, ProviderId } from "@/types/models";
import type { ResponseStyle } from "@/types/settings";

/**
 * Local stand-in for a completion API. Replace `requestCompletion` with a real
 * fetch to a model gateway; callers only depend on the returned blocks.
 */

type Intent = "code" | "email" | "summary" | "compare" | "translate" | "plan" | "general";

const INTENT_PATTERNS: Array<[Intent, RegExp]> = [
  ["code", /\b(code|function|hook|bug|typescript|javascript|react|sql|regex|api|component|refactor|test)\b/i],
  ["email", /\b(email|reply|message|follow[- ]?up|announce|outreach)\b/i],
  ["translate", /\b(translate|translation|spanish|bengali|french|german)\b/i],
  ["compare", /\b(compare|versus|vs\.?|difference|trade-?offs?|pros and cons)\b/i],
  ["summary", /\b(summari[sz]e|summary|tl;?dr|key points|page|article)\b/i],
  ["plan", /\b(plan|schedule|week|roadmap|okrs?|priorit)/i],
];

export function detectIntent(prompt: string): Intent {
  return INTENT_PATTERNS.find(([, pattern]) => pattern.test(prompt))?.[0] ?? "general";
}

export function deriveConversationTitle(prompt: string): string {
  const firstLine = prompt
    .trim()
    .split("\n")[0]
    .replace(/[?.!]+$/, "");
  const title = firstLine.charAt(0).toUpperCase() + firstLine.slice(1);
  return truncate(title || "New conversation", 48);
}

function topicFrom(prompt: string): string {
  return truncate(
    prompt
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[?.!]+$/, ""),
    80,
  );
}

const RESPONSES: Record<Intent, (topic: string, modelName: string) => MessageBlock[]> = {
  code: () => [
    {
      type: "paragraph",
      text: "Here is a clean, typed starting point. It keeps side effects isolated, so it is easy to test and reuse.",
    },
    {
      type: "code",
      language: "ts",
      filename: "example.ts",
      code: `type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function safeFetch<T>(url: string, signal?: AbortSignal): Promise<Result<T>> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return { ok: false, error: \`HTTP \${response.status}\` };
    return { ok: true, data: (await response.json()) as T };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}`,
    },
    { type: "heading", text: "Notes" },
    {
      type: "list",
      items: [
        "The **discriminated union** return type forces callers to handle the error branch.",
        "Passing an `AbortSignal` lets components cancel requests on unmount.",
        "Keep parsing and validation (for example with Zod) next to the fetch so bad data never leaks into the UI.",
      ],
    },
  ],
  email: () => [
    { type: "heading", text: "Subject: Quick follow-up" },
    {
      type: "paragraph",
      text: `Hi Sam,\n\nI wanted to follow up on the proposal we shared last week. I know things get busy, so here is a short recap and one clear next step.`,
    },
    {
      type: "list",
      items: [
        "**What we discussed:** a two-phase rollout starting next month",
        "**What I need from you:** a yes or no on the pilot scope",
        "**Timing:** a 15-minute call this week works for me",
      ],
    },
    { type: "paragraph", text: "Would Thursday afternoon suit you?\n\nBest,\nAlex" },
  ],
  summary: () => [
    { type: "paragraph", text: "Here are the key points:" },
    {
      type: "list",
      items: [
        "**Focus is a scarce resource** — every context switch has a measurable recovery cost.",
        "**Fewer tools beat more features** when the tools overlap.",
        "**Defaults and templates** reduce decisions and keep teams consistent.",
        "**Deep work needs protection** through scheduled, notification-free blocks.",
        "**Measure outcomes, not activity** to see whether changes actually help.",
      ],
    },
    {
      type: "callout",
      tone: "info",
      text: "Want this as a one-paragraph summary or a slide outline instead?",
    },
  ],
  compare: () => [
    { type: "paragraph", text: "Here is a balanced comparison of the two options." },
    { type: "heading", text: "Option A is better when" },
    {
      type: "list",
      items: ["You need speed and low cost", "The task is well defined", "You can tolerate small inaccuracies"],
    },
    { type: "heading", text: "Option B is better when" },
    {
      type: "list",
      items: [
        "Accuracy matters more than latency",
        "The problem needs multi-step reasoning",
        "You want citations or detailed explanations",
      ],
    },
    {
      type: "callout",
      tone: "tip",
      text: "Use Compare mode to send this prompt to two models and judge the answers side by side.",
    },
  ],
  translate: () => [
    { type: "paragraph", text: "**Traducción (español):**" },
    {
      type: "paragraph",
      text: "“Cada cambio entre herramientas cuesta en promedio 23 minutos para recuperar la concentración.”",
    },
    {
      type: "paragraph",
      text: "I used a neutral, international Spanish register. Tell me if you prefer a regional variant.",
    },
  ],
  plan: () => [
    { type: "paragraph", text: "Here is a realistic plan you can adjust:" },
    {
      type: "list",
      ordered: true,
      items: [
        "**Monday:** define the outcome for each deadline and block two 90-minute focus sessions.",
        "**Tuesday–Wednesday:** tackle the hardest deliverable first while energy is highest.",
        "**Thursday:** reviews and feedback loops; keep meetings back to back to protect mornings.",
        "**Friday:** buffer time, wrap-ups and a 20-minute plan for next week.",
      ],
    },
    {
      type: "callout",
      tone: "warning",
      text: "Leave about 20% of each day unscheduled — plans that are 100% full rarely survive Tuesday.",
    },
  ],
  general: (topic, modelName) => [
    { type: "paragraph", text: `Good question. Here is how I would approach “${topic}”.` },
    { type: "heading", text: "Short answer" },
    {
      type: "paragraph",
      text: "Start with the goal you care about most, pick the simplest approach that reaches it, and iterate once you have real feedback.",
    },
    { type: "heading", text: "A practical approach" },
    {
      type: "list",
      ordered: true,
      items: [
        "Write down what success looks like in one sentence.",
        "List the constraints: time, budget and the people involved.",
        "Choose one small experiment you can run this week.",
        "Review the result and decide whether to scale, adjust or stop.",
      ],
    },
    {
      type: "paragraph",
      text: `This answer came from ${modelName}. Try switching models from the composer to get a different perspective.`,
    },
  ],
};

function applyStyle(blocks: MessageBlock[], style: ResponseStyle): MessageBlock[] {
  if (style === "concise") {
    return blocks.filter((block) => block.type !== "callout").slice(0, 3);
  }
  if (style === "detailed") {
    return [
      ...blocks,
      {
        type: "callout",
        tone: "info",
        text: "Detailed mode is on. I can go deeper on any step, add examples, or turn this into a checklist.",
      },
    ];
  }
  return blocks;
}

/** Opening lines per provider so side-by-side answers read like different models. */
const PROVIDER_VOICE: Record<ProviderId, { lead: string; reorderLists: boolean }> = {
  openai: { lead: "Short version first, then the detail.", reorderLists: false },
  anthropic: { lead: "Here is a careful breakdown, with the trade-offs made explicit.", reorderLists: true },
  google: { lead: "Let me look at this from a few angles before recommending anything.", reorderLists: true },
  mistral: { lead: "Direct answer, then the reasoning behind it.", reorderLists: false },
  deepseek: { lead: "Working through this step by step.", reorderLists: false },
  meta: { lead: "Here is a practical take you can act on today.", reorderLists: true },
};

function applyVoice(blocks: MessageBlock[], providerId: ProviderId): MessageBlock[] {
  const voice = PROVIDER_VOICE[providerId];
  const voiced = blocks.map((block): MessageBlock =>
    voice.reorderLists && block.type === "list" && !block.ordered
      ? { ...block, items: [...block.items].reverse() }
      : block,
  );
  return [{ type: "paragraph", text: voice.lead }, ...voiced];
}

export function buildMockResponse(prompt: string, modelId: string, style: ResponseStyle = "balanced"): MessageBlock[] {
  const model = getModel(modelId);
  const intent = detectIntent(prompt);
  const blocks = applyVoice(RESPONSES[intent](topicFrom(prompt), model.name), model.providerId);
  return applyStyle(blocks, style);
}

const LATENCY_MS: Record<ModelSpeed, number> = { fast: 700, balanced: 1200, thorough: 1800 };

export class MockCompletionError extends Error {}

export interface CompletionRequest {
  prompt: string;
  modelId: string;
  style?: ResponseStyle;
  signal?: AbortSignal;
}

export async function requestCompletion({ prompt, modelId, style, signal }: CompletionRequest) {
  const model = getModel(modelId);
  await sleep(LATENCY_MS[model.speed] + Math.random() * 400, signal);

  if (/\bsimulate (an )?error\b/i.test(prompt) || (typeof navigator !== "undefined" && !navigator.onLine)) {
    throw new MockCompletionError(`${getProvider(model.providerId).name} did not respond. Please try again.`);
  }

  return buildMockResponse(prompt, modelId, style);
}
