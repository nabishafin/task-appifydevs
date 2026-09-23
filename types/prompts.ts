export type PromptCategory = "writing" | "coding" | "research" | "business" | "productivity" | "creative";

export type PromptSurface = "app" | "extension";

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: PromptCategory;
  /** Template body. Variables are written as {{variable}}. */
  prompt: string;
  surfaces: PromptSurface[];
  uses: number;
}

export interface PromptCategoryMeta {
  id: PromptCategory;
  label: string;
  description: string;
}
