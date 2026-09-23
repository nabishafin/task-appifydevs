import { PROMPT_CATEGORIES } from "@/data/prompts";
import { matchesQuery } from "@/lib/utils";
import type { PromptCategory, PromptSurface, PromptTemplate } from "@/types/prompts";

const VARIABLE_PATTERN = /\{\{\s*(\w+)\s*\}\}/g;

/** Unique variable names in a template, in order of appearance. */
export function extractVariables(template: string): string[] {
  return Array.from(new Set(Array.from(template.matchAll(VARIABLE_PATTERN), (match) => match[1])));
}

/** Replaces known variables; unknown ones stay as {{name}} so the user can fill them in. */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(VARIABLE_PATTERN, (placeholder, name: string) => values[name]?.trim() || placeholder);
}

export function getCategoryLabel(category: PromptCategory): string {
  return PROMPT_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

interface PromptFilter {
  query?: string;
  category?: PromptCategory | "all" | "favorites";
  surface?: PromptSurface;
  favoriteIds?: string[];
}

export function filterPrompts(
  prompts: PromptTemplate[],
  { query = "", category = "all", surface, favoriteIds = [] }: PromptFilter,
) {
  return prompts.filter((prompt) => {
    if (surface && !prompt.surfaces.includes(surface)) return false;
    if (category === "favorites" && !favoriteIds.includes(prompt.id)) return false;
    if (category !== "all" && category !== "favorites" && prompt.category !== category) return false;
    return matchesQuery(query, [prompt.title, prompt.description, prompt.prompt, getCategoryLabel(prompt.category)]);
  });
}
