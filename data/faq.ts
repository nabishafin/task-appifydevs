import type { FAQItem } from "@/types/marketing";

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what-is",
    question: "What is EchoGPT?",
    answer:
      "EchoGPT is one workspace for the leading AI models. Instead of paying for and switching between several AI products, you chat with GPT, Claude, Gemini, Mistral, DeepSeek and Llama from a single web app and a Chrome sidebar.",
  },
  {
    id: "switch-models",
    question: "Can I switch models in the middle of a conversation?",
    answer:
      "Yes. Choose a different model from the composer and the next reply uses it, with the earlier messages kept as context. You can also send one prompt to two models and compare the answers side by side.",
  },
  {
    id: "extension",
    question: "What does the Chrome extension do?",
    answer:
      "It opens EchoGPT in a popup or sidebar on any page. Quick actions can summarize the page, explain or rewrite selected text, translate, and draft replies, all without copying text into another tab.",
  },
  {
    id: "data",
    question: "Is my data used to train models?",
    answer:
      "No. Conversations are not used for training by default. You can turn history off entirely or delete it at any time from Privacy settings.",
  },
  {
    id: "free-plan",
    question: "Is there a free plan?",
    answer:
      "Yes. The Free plan includes fast models, the Chrome extension, the prompt library and 50 messages a day. Upgrade to Pro when you need every model and unlimited usage.",
  },
  {
    id: "teams",
    question: "Does EchoGPT work for teams?",
    answer:
      "The Team plan adds a shared prompt library, admin controls for models and data retention, centralized billing and SSO.",
  },
];
