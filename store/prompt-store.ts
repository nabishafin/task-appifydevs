import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants/storage";
import { createId } from "@/lib/utils";
import type { PromptTemplate } from "@/types/prompts";

export type NewPromptInput = Pick<PromptTemplate, "title" | "description" | "category" | "prompt">;

interface PromptState {
  favoritePromptIds: string[];
  customPrompts: PromptTemplate[];
  toggleFavoritePrompt: (id: string) => void;
  addCustomPrompt: (input: NewPromptInput) => PromptTemplate;
  deleteCustomPrompt: (id: string) => void;
}

export const usePromptStore = create<PromptState>()(
  persist(
    (set) => ({
      favoritePromptIds: ["code-review", "summarize-article"],
      customPrompts: [],
      toggleFavoritePrompt: (id) =>
        set((state) => ({
          favoritePromptIds: state.favoritePromptIds.includes(id)
            ? state.favoritePromptIds.filter((favoriteId) => favoriteId !== id)
            : [...state.favoritePromptIds, id],
        })),
      addCustomPrompt: (input) => {
        const prompt: PromptTemplate = { ...input, id: createId("p"), surfaces: ["app", "extension"], uses: 0 };
        set((state) => ({ customPrompts: [prompt, ...state.customPrompts] }));
        return prompt;
      },
      deleteCustomPrompt: (id) =>
        set((state) => ({
          customPrompts: state.customPrompts.filter((prompt) => prompt.id !== id),
          favoritePromptIds: state.favoritePromptIds.filter((favoriteId) => favoriteId !== id),
        })),
    }),
    {
      name: STORAGE_KEYS.prompts,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
