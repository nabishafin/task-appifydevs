import type { AIModel, AIProvider, ModelCapability, ProviderId } from "@/types/models";

/**
 * Model names reflect the providers EchoGPT supports today. The catalog is
 * illustrative mock data: add, remove or reorder entries here and every
 * selector, card and filter updates automatically.
 */
export const PROVIDERS: Record<ProviderId, AIProvider> = {
  openai: { id: "openai", name: "OpenAI", accent: "#10a37f", monogram: "O" },
  anthropic: { id: "anthropic", name: "Anthropic", accent: "#d97757", monogram: "A" },
  google: { id: "google", name: "Google", accent: "#4285f4", monogram: "G" },
  mistral: { id: "mistral", name: "Mistral AI", accent: "#fa520f", monogram: "M" },
  deepseek: { id: "deepseek", name: "DeepSeek", accent: "#4d6bfe", monogram: "D" },
  meta: { id: "meta", name: "Meta", accent: "#0668e1", monogram: "L" },
};

export const MODELS: AIModel[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    providerId: "openai",
    description: "Flagship all-rounder for complex reasoning, writing and analysis.",
    capabilities: ["reasoning", "coding", "vision", "web-search"],
    contextWindow: 400_000,
    tier: "pro",
    speed: "balanced",
    isNew: true,
  },
  {
    id: "gpt-5-mini",
    name: "GPT-5 mini",
    providerId: "openai",
    description: "Quick, low-cost answers for everyday questions and drafts.",
    capabilities: ["fast", "coding", "vision"],
    contextWindow: 400_000,
    tier: "free",
    speed: "fast",
  },
  {
    id: "claude-sonnet-4-5",
    name: "Claude Sonnet 4.5",
    providerId: "anthropic",
    description: "Careful, well-structured writing and dependable coding help.",
    capabilities: ["coding", "reasoning", "long-context", "creative"],
    contextWindow: 200_000,
    tier: "pro",
    speed: "balanced",
    isNew: true,
  },
  {
    id: "claude-haiku-4-5",
    name: "Claude Haiku 4.5",
    providerId: "anthropic",
    description: "Fast and thoughtful for summaries, rewrites and quick replies.",
    capabilities: ["fast", "multilingual", "vision"],
    contextWindow: 200_000,
    tier: "free",
    speed: "fast",
  },
  {
    id: "gemini-2-5-pro",
    name: "Gemini 2.5 Pro",
    providerId: "google",
    description: "Very long context for research across large documents.",
    capabilities: ["long-context", "reasoning", "vision", "multilingual"],
    contextWindow: 1_000_000,
    tier: "pro",
    speed: "thorough",
  },
  {
    id: "gemini-2-5-flash",
    name: "Gemini 2.5 Flash",
    providerId: "google",
    description: "Low-latency multimodal model for high-volume tasks.",
    capabilities: ["fast", "vision", "long-context"],
    contextWindow: 1_000_000,
    tier: "free",
    speed: "fast",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    providerId: "mistral",
    description: "Strong multilingual reasoning with precise instruction following.",
    capabilities: ["multilingual", "reasoning", "coding"],
    contextWindow: 128_000,
    tier: "pro",
    speed: "balanced",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3.1",
    providerId: "deepseek",
    description: "Efficient open-weight model that excels at code and math.",
    capabilities: ["coding", "reasoning", "fast"],
    contextWindow: 128_000,
    tier: "free",
    speed: "fast",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    providerId: "deepseek",
    description: "Step-by-step reasoning for math, logic and planning problems.",
    capabilities: ["reasoning", "coding"],
    contextWindow: 128_000,
    tier: "pro",
    speed: "thorough",
  },
  {
    id: "llama-4-maverick",
    name: "Llama 4 Maverick",
    providerId: "meta",
    description: "Open model with solid general knowledge and creative range.",
    capabilities: ["creative", "multilingual", "vision"],
    contextWindow: 256_000,
    tier: "free",
    speed: "balanced",
  },
];

export const DEFAULT_MODEL_ID = "gpt-5";

export const CAPABILITY_LABELS: Record<ModelCapability, string> = {
  reasoning: "Reasoning",
  coding: "Coding",
  vision: "Vision",
  "long-context": "Long context",
  fast: "Fast",
  "web-search": "Web search",
  multilingual: "Multilingual",
  creative: "Creative",
};

const modelIndex = new Map(MODELS.map((model) => [model.id, model]));

export function getModel(id: string): AIModel {
  return modelIndex.get(id) ?? modelIndex.get(DEFAULT_MODEL_ID)!;
}

export function getProvider(id: ProviderId): AIProvider {
  return PROVIDERS[id];
}
