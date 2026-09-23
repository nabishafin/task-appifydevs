import type { Conversation } from "@/types/chat";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

/**
 * Seed conversations shown on first visit. Once the user interacts, the chat
 * store persists its own copy to localStorage.
 */
export function createSeedConversations(): Conversation[] {
  return [
    {
      id: "c-debounce-hook",
      title: "Debounced search hook in React",
      modelId: "claude-sonnet-4-5",
      tag: "code",
      isFavorite: true,
      createdAt: ago(2 * HOUR),
      updatedAt: ago(2 * HOUR),
      messages: [
        {
          id: "m-1",
          role: "user",
          content:
            "Write a small React hook that debounces a search input and cancels stale requests. TypeScript please.",
          createdAt: ago(2 * HOUR),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "claude-sonnet-4-5",
          status: "complete",
          createdAt: ago(2 * HOUR - 20_000),
          blocks: [
            {
              type: "paragraph",
              text: "Here is a compact hook that waits for the user to stop typing, then runs the search with an `AbortController` so older requests never overwrite newer results.",
            },
            {
              type: "code",
              language: "tsx",
              filename: "use-debounced-search.ts",
              code: `import { useEffect, useState } from "react";

export function useDebouncedSearch<T>(
  query: string,
  search: (q: string, signal: AbortSignal) => Promise<T>,
  delay = 300,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        setData(await search(query, controller.signal));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, search, delay]);

  return { data, isLoading };
}`,
            },
            { type: "heading", text: "Why it works" },
            {
              type: "list",
              items: [
                "**Cleanup cancels both** the pending timer and the in-flight request whenever `query` changes.",
                "The `aborted` check stops a cancelled request from flipping the loading state.",
                "Pass a stable `search` function (wrap it in `useCallback`) so the effect does not re-run every render.",
              ],
            },
            {
              type: "callout",
              tone: "tip",
              text: "If you already use TanStack Query, set `queryKey: ['search', debouncedQuery]` instead and let the library handle cancellation.",
            },
          ],
        },
      ],
    },
    {
      id: "c-launch-email",
      title: "Product launch announcement email",
      modelId: "gpt-5",
      tag: "work",
      isFavorite: false,
      createdAt: ago(5 * HOUR),
      updatedAt: ago(5 * HOUR),
      messages: [
        {
          id: "m-1",
          role: "user",
          content:
            "Draft a short launch email for our new team workspace feature. Audience is existing customers. Friendly but not salesy.",
          createdAt: ago(5 * HOUR),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "gpt-5",
          status: "complete",
          createdAt: ago(5 * HOUR - 15_000),
          blocks: [
            { type: "heading", text: "Subject: Your team now has a shared home in EchoGPT" },
            {
              type: "paragraph",
              text: "Hi there,\n\nStarting today, you can invite teammates into a shared workspace. Prompts, saved conversations and model preferences now live in one place, so nobody has to rebuild the same prompt twice.",
            },
            {
              type: "list",
              items: [
                "**Shared prompt library** with folders and version history",
                "**Team favorites** so the best answers are easy to find",
                "**Admin controls** for default models and data retention",
              ],
            },
            {
              type: "paragraph",
              text: "Open EchoGPT and choose **Invite team** in the sidebar to get started. We would love to hear what you build.\n\n— The EchoGPT team",
            },
          ],
        },
      ],
    },
    {
      id: "c-rag-research",
      title: "RAG vs fine-tuning for support docs",
      modelId: "gemini-2-5-pro",
      tag: "research",
      isFavorite: true,
      createdAt: ago(1 * DAY + 3 * HOUR),
      updatedAt: ago(1 * DAY + 3 * HOUR),
      messages: [
        {
          id: "m-1",
          role: "user",
          content:
            "We have 4,000 help-center articles. Should we fine-tune a model or use retrieval? Give me the trade-offs.",
          createdAt: ago(1 * DAY + 3 * HOUR),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "gemini-2-5-pro",
          status: "complete",
          createdAt: ago(1 * DAY + 3 * HOUR - 30_000),
          blocks: [
            {
              type: "paragraph",
              text: "For a help center that changes weekly, **retrieval-augmented generation (RAG) is almost always the better first step.** Fine-tuning teaches style and format; retrieval supplies fresh facts.",
            },
            { type: "heading", text: "Choose RAG when" },
            {
              type: "list",
              items: [
                "Articles are updated often and answers must cite the latest version",
                "You need source links for trust and compliance",
                "You want to ship in days, not weeks",
              ],
            },
            { type: "heading", text: "Consider fine-tuning when" },
            {
              type: "list",
              items: [
                "Responses must follow a strict house style or output format",
                "Latency and token cost matter more than freshness",
                "You have thousands of high-quality question and answer pairs",
              ],
            },
            {
              type: "callout",
              tone: "info",
              text: "A common pattern is RAG for facts plus a light fine-tune (or a strong system prompt) for tone.",
            },
          ],
        },
      ],
    },
    {
      id: "c-q4-okrs",
      title: "Q4 OKRs for the growth team",
      modelId: "gpt-5",
      tag: "work",
      isFavorite: false,
      createdAt: ago(3 * DAY),
      updatedAt: ago(3 * DAY),
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Suggest three measurable OKRs for a 4-person growth team focused on activation.",
          createdAt: ago(3 * DAY),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "gpt-5",
          status: "complete",
          createdAt: ago(3 * DAY - 12_000),
          blocks: [
            {
              type: "list",
              ordered: true,
              items: [
                "**Raise week-one activation from 34% to 45%** by shipping guided onboarding and a sample workspace.",
                "**Cut time-to-first-answer below 60 seconds** for new signups through prompt suggestions on the empty state.",
                "**Grow extension installs from new users by 25%** with an in-app prompt after their third conversation.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "c-bengali-translate",
      title: "Translate onboarding copy to Bengali",
      modelId: "mistral-large",
      tag: "work",
      isFavorite: false,
      createdAt: ago(4 * DAY),
      updatedAt: ago(4 * DAY),
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Translate: “Welcome to EchoGPT. Pick a model and ask anything.”",
          createdAt: ago(4 * DAY),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "mistral-large",
          status: "complete",
          createdAt: ago(4 * DAY - 8_000),
          blocks: [
            { type: "paragraph", text: "**EchoGPT-এ স্বাগতম। একটি মডেল বেছে নিন এবং যেকোনো প্রশ্ন করুন।**" },
            {
              type: "paragraph",
              text: "I kept “EchoGPT” in Latin script since it is a brand name, and used the friendly, informal register common in app interfaces.",
            },
          ],
        },
      ],
    },
    {
      id: "c-sql-optimize",
      title: "Speed up a slow Postgres query",
      modelId: "deepseek-v3",
      tag: "code",
      isFavorite: false,
      createdAt: ago(8 * DAY),
      updatedAt: ago(8 * DAY),
      messages: [
        {
          id: "m-1",
          role: "user",
          content:
            "This query takes 4 seconds: SELECT * FROM orders WHERE customer_id = $1 ORDER BY created_at DESC LIMIT 20;",
          createdAt: ago(8 * DAY),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "deepseek-v3",
          status: "complete",
          createdAt: ago(8 * DAY - 9_000),
          blocks: [
            {
              type: "paragraph",
              text: "Postgres is probably scanning every order for the customer and sorting them. A composite index lets it read the newest 20 rows directly.",
            },
            {
              type: "code",
              language: "sql",
              code: "CREATE INDEX CONCURRENTLY idx_orders_customer_created\n  ON orders (customer_id, created_at DESC);",
            },
            {
              type: "paragraph",
              text: "Also select only the columns you need instead of `*` so the planner can use an index-only scan.",
            },
          ],
        },
      ],
    },
    {
      id: "c-story-ideas",
      title: "Short story premises about memory",
      modelId: "llama-4-maverick",
      tag: "personal",
      isFavorite: false,
      createdAt: ago(12 * DAY),
      updatedAt: ago(12 * DAY),
      messages: [
        {
          id: "m-1",
          role: "user",
          content: "Give me three short story premises about a town that forgets one thing every night.",
          createdAt: ago(12 * DAY),
        },
        {
          id: "m-2",
          role: "assistant",
          modelId: "llama-4-maverick",
          status: "complete",
          createdAt: ago(12 * DAY - 10_000),
          blocks: [
            {
              type: "list",
              ordered: true,
              items: [
                "A night-shift librarian keeps a secret ledger of what the town lost, until she finds her own name in it.",
                "The town forgets the word for “goodbye,” and nobody can leave.",
                "A child who remembers everything is hired to sell memories back to their owners.",
              ],
            },
          ],
        },
      ],
    },
  ];
}

export const SUGGESTED_PROMPTS = [
  {
    id: "s-compare",
    title: "Compare two approaches",
    prompt: "Compare server components and client components in Next.js. When should I use each?",
    category: "coding",
  },
  {
    id: "s-email",
    title: "Draft a follow-up email",
    prompt: "Draft a polite follow-up email to a client who has not replied to our proposal in a week.",
    category: "business",
  },
  {
    id: "s-summarize",
    title: "Summarize a long read",
    prompt: "Summarize the key ideas of 'Deep Work' by Cal Newport in five bullet points.",
    category: "research",
  },
  {
    id: "s-plan",
    title: "Plan a focused week",
    prompt: "Help me plan a focused work week around three deadlines and two recurring meetings.",
    category: "productivity",
  },
] as const;
