import { FileText, Languages, Lightbulb, MessageCircleReply, PenLine, ScanSearch } from "lucide-react";
import { DEFAULT_MODEL_ID } from "@/data/models";
import type { Conversation } from "@/types/chat";
import type { ExtensionSettings, QuickAction } from "@/types/extension";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "summarize-page",
    label: "Summarize page",
    description: "Key points of the current page",
    icon: FileText,
    prompt: "Summarize this page in five bullet points.",
    requiresSelection: false,
  },
  {
    id: "explain-selection",
    label: "Explain selection",
    description: "Plain-language explanation",
    icon: Lightbulb,
    prompt: "Explain the selected text in plain language.",
    requiresSelection: true,
  },
  {
    id: "rewrite-text",
    label: "Rewrite text",
    description: "Clearer and more concise",
    icon: PenLine,
    prompt: "Rewrite the selected text to be clearer and more concise.",
    requiresSelection: true,
  },
  {
    id: "translate",
    label: "Translate",
    description: "Into your preferred language",
    icon: Languages,
    prompt: "Translate the selected text into Spanish.",
    requiresSelection: true,
  },
  {
    id: "generate-reply",
    label: "Generate reply",
    description: "Draft a response to this thread",
    icon: MessageCircleReply,
    prompt: "Draft a friendly, concise reply to this thread.",
    requiresSelection: false,
  },
  {
    id: "ask-page",
    label: "Ask about page",
    description: "Question anything on this page",
    icon: ScanSearch,
    prompt: "What are the main arguments on this page, and are they well supported?",
    requiresSelection: false,
  },
];

/** The mock article the extension demo pretends to be reading. */
export const DEMO_PAGE = {
  url: "https://www.example-journal.com/remote-work-focus",
  domain: "example-journal.com",
  title: "The Hidden Cost of Context Switching in Remote Teams",
  author: "Elena Park",
  readTime: "7 min read",
  selection:
    "Every switch between tools costs an average of 23 minutes of regained focus, and knowledge workers switch apps more than 1,100 times a day.",
  paragraphs: [
    "Remote work promised deep focus. Instead, many teams traded office interruptions for a steady stream of notifications, tabs and tools. The average knowledge worker now uses more than a dozen apps to get through a single day.",
    "Every switch between tools costs an average of 23 minutes of regained focus, and knowledge workers switch apps more than 1,100 times a day. The problem is rarely any single tool, but the seams between them.",
    "Teams that consolidate their workflows — fewer tools, shared templates and clear defaults — report higher satisfaction and faster delivery. The goal is not fewer capabilities, but fewer places to look for them.",
  ],
} as const;

export const TRANSLATE_LANGUAGES = [
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Japanese",
  "Korean",
  "Chinese (Simplified)",
  "Bengali",
  "Hindi",
  "Arabic",
] as const;

export const CUSTOM_INSTRUCTIONS_MAX = 280;

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  defaultModelId: DEFAULT_MODEL_ID,
  responseStyle: "concise",
  sendOnEnter: true,
  autoReadPage: true,
  saveHistory: true,
  excludeIncognito: true,
  translateTo: "Spanish",
  customInstructions: "",
};

export interface ExtensionShortcut {
  id: string;
  label: string;
  mac: string[];
  other: string[];
}

export const EXTENSION_SHORTCUTS: ExtensionShortcut[] = [
  { id: "open", label: "Open or close EchoGPT", mac: ["mod", "Shift", "E"], other: ["Alt", "E"] },
  { id: "summarize", label: "Summarize this page", mac: ["mod", "Shift", "S"], other: ["Alt", "S"] },
  { id: "explain", label: "Explain selected text", mac: ["mod", "Shift", "X"], other: ["Alt", "X"] },
  { id: "new-chat", label: "Start a new chat", mac: ["mod", "Shift", "O"], other: ["Alt", "N"] },
  { id: "send", label: "Send message", mac: ["Enter"], other: ["Enter"] },
];

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString();
}

/** Browser-context conversations shown in the extension history on first visit. */
export function createExtensionSeedConversations(): Conversation[] {
  return [
    {
      id: "ext-context-switching",
      title: "Summary: Context switching article",
      modelId: "gpt-5",
      tag: "research",
      isFavorite: false,
      createdAt: ago(40 * MINUTE),
      updatedAt: ago(38 * MINUTE),
      messages: [
        {
          id: "ext-m-1",
          role: "user",
          content:
            "Summarize this page in five bullet points.\n\nPage: The Hidden Cost of Context Switching in Remote Teams",
          createdAt: ago(40 * MINUTE),
        },
        {
          id: "ext-m-2",
          role: "assistant",
          modelId: "gpt-5",
          status: "complete",
          createdAt: ago(38 * MINUTE),
          blocks: [
            { type: "paragraph", text: "Here are the key points from **The Hidden Cost of Context Switching**:" },
            {
              type: "list",
              items: [
                "Remote work traded office interruptions for a constant stream of notifications and tools.",
                "Each tool switch costs roughly 23 minutes of regained focus.",
                "Knowledge workers switch apps more than 1,100 times per day.",
                "The friction lives in the seams between tools, not in any single tool.",
                "Consolidated workflows with shared templates lead to faster delivery.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "ext-jordan-reply",
      title: "Reply to Jordan's email thread",
      modelId: "claude-sonnet-4-5",
      tag: "work",
      isFavorite: true,
      createdAt: ago(3 * HOUR),
      updatedAt: ago(3 * HOUR - 2 * MINUTE),
      messages: [
        {
          id: "ext-m-3",
          role: "user",
          content: "Draft a friendly, concise reply to this thread.\n\nPage: Re: Q4 launch timeline — Jordan Lee",
          createdAt: ago(3 * HOUR),
        },
        {
          id: "ext-m-4",
          role: "assistant",
          modelId: "claude-sonnet-4-5",
          status: "complete",
          createdAt: ago(3 * HOUR - 2 * MINUTE),
          blocks: [
            { type: "paragraph", text: "Hi Jordan," },
            {
              type: "paragraph",
              text: "Thanks for pulling the timeline together. Moving the beta to October 14 works for us, and design can deliver final assets by the 9th. Could we keep Thursday's review slot to confirm scope?",
            },
            { type: "paragraph", text: "Best, Sam" },
          ],
        },
      ],
    },
    {
      id: "ext-container-queries",
      title: "Explain CSS container queries",
      modelId: "gemini-2-5-pro",
      tag: "code",
      isFavorite: false,
      createdAt: ago(DAY + 2 * HOUR),
      updatedAt: ago(DAY + 2 * HOUR),
      messages: [
        {
          id: "ext-m-5",
          role: "user",
          content:
            "Explain the selected text in plain language.\n\n“Container queries let a component respond to the size of its parent rather than the viewport.”",
          createdAt: ago(DAY + 2 * HOUR),
        },
        {
          id: "ext-m-6",
          role: "assistant",
          modelId: "gemini-2-5-pro",
          status: "complete",
          createdAt: ago(DAY + 2 * HOUR - MINUTE),
          blocks: [
            {
              type: "paragraph",
              text: "Media queries ask **how big is the screen?** Container queries ask **how big is the box I live in?** That lets the same card look right in a sidebar or a wide grid.",
            },
            {
              type: "code",
              language: "css",
              code: ".card-wrapper { container-type: inline-size; }\n\n@container (min-width: 400px) {\n  .card { display: grid; grid-template-columns: 120px 1fr; }\n}",
            },
          ],
        },
      ],
    },
    {
      id: "ext-pricing-translate",
      title: "Translate pricing FAQ to Spanish",
      modelId: "gpt-5-mini",
      tag: "work",
      isFavorite: false,
      createdAt: ago(3 * DAY),
      updatedAt: ago(3 * DAY),
      messages: [
        {
          id: "ext-m-7",
          role: "user",
          content:
            "Translate the selected text into Spanish.\n\n“You can cancel or change your plan at any time. Refunds are prorated.”",
          createdAt: ago(3 * DAY),
        },
        {
          id: "ext-m-8",
          role: "assistant",
          modelId: "gpt-5-mini",
          status: "complete",
          createdAt: ago(3 * DAY - MINUTE),
          blocks: [
            {
              type: "paragraph",
              text: "“Puedes cancelar o cambiar tu plan en cualquier momento. Los reembolsos se calculan de forma proporcional.”",
            },
          ],
        },
      ],
    },
    {
      id: "ext-pr-review",
      title: "Review GitHub PR #482 changes",
      modelId: "claude-sonnet-4-5",
      tag: "code",
      isFavorite: false,
      createdAt: ago(9 * DAY),
      updatedAt: ago(9 * DAY),
      messages: [
        {
          id: "ext-m-9",
          role: "user",
          content:
            "What are the main risks in this pull request?\n\nPage: feat: optimistic updates for comments · Pull Request #482",
          createdAt: ago(9 * DAY),
        },
        {
          id: "ext-m-10",
          role: "assistant",
          modelId: "claude-sonnet-4-5",
          status: "complete",
          createdAt: ago(9 * DAY - MINUTE),
          blocks: [
            { type: "paragraph", text: "The change is solid overall. Three things worth a second look:" },
            {
              type: "list",
              ordered: true,
              items: [
                "The rollback path does not restore the comment count when the request fails.",
                "Temporary IDs can collide if two comments are posted within the same millisecond.",
                "There is no test covering a failed request after navigation.",
              ],
            },
          ],
        },
      ],
    },
  ];
}
