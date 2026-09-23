import {
  Accessibility,
  ArrowLeftRight,
  BookMarked,
  Command,
  FolderKanban,
  Gauge,
  Layers,
  MessagesSquare,
  PanelRight,
  Shuffle,
  Timer,
  Workflow,
} from "lucide-react";
import type { BenefitItem, FeatureItem, WorkflowComparisonRow } from "@/types/marketing";

export const FEATURES: FeatureItem[] = [
  {
    id: "multi-model",
    title: "Multi-model chat",
    description: "Talk to GPT, Claude, Gemini, Mistral, DeepSeek and Llama from one chat window with a single account.",
    icon: MessagesSquare,
    points: ["10+ models in one place", "One subscription, one history"],
  },
  {
    id: "model-switching",
    title: "Switch models mid-thought",
    description:
      "Change the model for the next reply without losing context, or send the same prompt to two models side by side.",
    icon: ArrowLeftRight,
    points: ["Side-by-side compare", "Context carries over"],
  },
  {
    id: "browser-sidebar",
    title: "Sidebar in every tab",
    description:
      "The Chrome extension summarizes pages, explains selections and drafts replies without leaving what you are reading.",
    icon: PanelRight,
    points: ["Page-aware quick actions", "Works on any site"],
  },
  {
    id: "prompt-workflows",
    title: "Smart prompt workflows",
    description:
      "Start from proven templates with fill-in variables for writing, code review, research and business tasks.",
    icon: Workflow,
    points: ["Fill-in {{variables}}", "Grouped by use case"],
  },
  {
    id: "organization",
    title: "Organized conversations",
    description: "Search every chat, filter by model or tag, and pin the answers you come back to as favorites.",
    icon: FolderKanban,
    points: ["Instant search", "Favorites and tags"],
  },
  {
    id: "shortcuts",
    title: "Keyboard-first",
    description:
      "A command palette, shortcut hints and composer keys keep your hands on the keyboard from question to answer.",
    icon: Command,
    points: ["⌘K command palette", "Enter to send"],
  },
  {
    id: "reusable-prompts",
    title: "Reusable prompts",
    description:
      "Save the prompts that work, reuse them in the app or the extension, and stop rewriting the same instructions.",
    icon: BookMarked,
    points: ["Shared across surfaces", "One-click insert"],
  },
];

export const BENEFITS: BenefitItem[] = [
  {
    title: "Fast by default",
    description: "A lightweight interface that opens instantly and shows answers as they arrive.",
    icon: Gauge,
    metric: { value: "< 1s", label: "to first token on fast models" },
  },
  {
    title: "One workspace, not five tabs",
    description: "Stop juggling separate AI subscriptions, logins and histories.",
    icon: Layers,
    metric: { value: "1", label: "place for every model" },
  },
  {
    title: "Less context switching",
    description: "Bring AI to the page you are on with the sidebar instead of copying text between tabs.",
    icon: Shuffle,
    metric: { value: "6", label: "page-aware quick actions" },
  },
  {
    title: "Built for productivity",
    description: "Prompt templates, favorites and shortcuts turn one-off chats into repeatable workflows.",
    icon: Timer,
    metric: { value: "20", label: "ready-made prompt templates" },
  },
  {
    title: "Model flexibility",
    description: "Pick the best model for each task and change your mind at any point in the conversation.",
    icon: ArrowLeftRight,
    metric: { value: "6", label: "leading AI providers" },
  },
  {
    title: "Accessible to everyone",
    description: "Full keyboard support, readable contrast in both themes and respect for reduced motion.",
    icon: Accessibility,
    metric: { value: "AA", label: "contrast target in both themes" },
  },
];

export const WORKFLOW_COMPARISON: WorkflowComparisonRow[] = [
  {
    task: "Try a second model",
    traditional: "Open another site, sign in, paste the prompt again",
    echo: "Pick a model from the same composer",
  },
  {
    task: "Compare two answers",
    traditional: "Copy both answers into a doc and read back and forth",
    echo: "Send once, read side by side",
  },
  {
    task: "Ask about a web page",
    traditional: "Copy the text, switch tabs, paste, explain the context",
    echo: "Click “Summarize page” in the sidebar",
  },
  {
    task: "Reuse a great prompt",
    traditional: "Search old chats or a notes app for the wording",
    echo: "Insert it from the prompt library",
  },
  {
    task: "Find an old answer",
    traditional: "Remember which product you asked, then scroll",
    echo: "Search one history across every model",
  },
];

/** Placeholder trust figures for the redesign concept. */
export const TRUST_STATS = [
  { value: "250K+", label: "people using EchoGPT" },
  { value: "10+", label: "AI models" },
  { value: "4.8/5", label: "Chrome Web Store rating" },
  { value: "40+", label: "countries" },
];
