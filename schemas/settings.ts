import * as z from "zod";

export const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা (Bengali)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
] as const;

const languageValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  (typeof LANGUAGE_OPTIONS)[number]["value"],
  ...(typeof LANGUAGE_OPTIONS)[number]["value"][],
];

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Your name needs at least 2 characters.")
    .max(40, "Keep your name under 40 characters."),
  email: z.email("Enter a valid email address, like name@company.com."),
  language: z.enum(languageValues, "Choose a language."),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export const CUSTOM_INSTRUCTIONS_LIMIT = 1500;

export const customInstructionsSchema = z.object({
  customInstructions: z
    .string()
    .trim()
    .max(CUSTOM_INSTRUCTIONS_LIMIT, `Instructions can be up to ${CUSTOM_INSTRUCTIONS_LIMIT} characters.`),
});

export type CustomInstructionsInput = z.infer<typeof customInstructionsSchema>;
