import type { Metadata } from "next";
import { PromptLibrary } from "@/features/prompts/components/prompt-library";

export const metadata: Metadata = { title: "Prompt Library" };

export default function PromptsPage() {
  return (
    <div className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <PromptLibrary />
    </div>
  );
}
