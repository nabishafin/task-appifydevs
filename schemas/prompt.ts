import * as z from "zod";
import { PROMPT_CATEGORIES } from "@/data/prompts";

const categoryIds = PROMPT_CATEGORIES.map((category) => category.id) as [
  (typeof PROMPT_CATEGORIES)[number]["id"],
  ...(typeof PROMPT_CATEGORIES)[number]["id"][],
];

export const PROMPT_LIMITS = { title: 60, description: 140, prompt: 2000 } as const;

export const promptTemplateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Give your prompt a title of at least 3 characters.")
    .max(PROMPT_LIMITS.title, `Keep the title under ${PROMPT_LIMITS.title} characters.`),
  description: z
    .string()
    .trim()
    .min(10, "Describe what the prompt does in at least 10 characters.")
    .max(PROMPT_LIMITS.description, `Keep the description under ${PROMPT_LIMITS.description} characters.`),
  category: z.enum(categoryIds, "Choose a category."),
  prompt: z
    .string()
    .trim()
    .min(20, "The prompt should be at least 20 characters so it is useful.")
    .max(PROMPT_LIMITS.prompt, `Prompts can be up to ${PROMPT_LIMITS.prompt} characters.`),
});

export type PromptTemplateInput = z.infer<typeof promptTemplateSchema>;
