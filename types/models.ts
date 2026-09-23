export type ProviderId = "openai" | "anthropic" | "google" | "mistral" | "deepseek" | "meta";

export interface AIProvider {
  id: ProviderId;
  name: string;
  /** Small identity color, only used inside provider marks and indicators. */
  accent: string;
  monogram: string;
}

export type ModelCapability =
  "reasoning" | "coding" | "vision" | "long-context" | "fast" | "web-search" | "multilingual" | "creative";

export type ModelTier = "free" | "pro";

export type ModelSpeed = "fast" | "balanced" | "thorough";

export interface AIModel {
  id: string;
  name: string;
  providerId: ProviderId;
  description: string;
  capabilities: ModelCapability[];
  /** Context window in tokens. */
  contextWindow: number;
  tier: ModelTier;
  speed: ModelSpeed;
  isNew?: boolean;
}
