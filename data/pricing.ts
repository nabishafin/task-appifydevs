import type { PricingTier } from "@/types/marketing";

/** Edit plans here. Prices are per seat, in USD. */
export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Everything you need to explore multiple models.",
    price: null,
    priceNote: "Free forever",
    cta: { label: "Start for free", href: "/app" },
    features: [
      "Fast models: GPT-5 mini, Claude Haiku, Gemini Flash and more",
      "50 messages per day",
      "Chrome extension with quick actions",
      "Prompt library",
      "30-day conversation history",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Every model and every workflow, without daily limits.",
    price: { monthly: 12, yearly: 9 },
    priceNote: "per month",
    cta: { label: "Upgrade to Pro", href: "/app?upgrade=pro" },
    features: [
      "Everything in Free",
      "Every model, including GPT-5, Claude Sonnet and Gemini Pro",
      "Side-by-side model comparison",
      "Unlimited history and favorites",
      "File attachments up to 50 MB",
      "Priority response speed",
    ],
    highlighted: true,
    badge: "Most popular",
  },
  {
    id: "team",
    name: "Team",
    description: "Shared prompts and admin controls for growing teams.",
    price: { monthly: 20, yearly: 16 },
    priceNote: "per seat / month",
    cta: { label: "Start a team trial", href: "/app?upgrade=team" },
    features: [
      "Everything in Pro",
      "Shared prompt library and folders",
      "Admin model and retention controls",
      "Centralized billing",
      "SSO and priority support",
    ],
  },
];
