import type { Metadata } from "next";
import { SmoothScrollPanel } from "@/components/shared/smooth-scroll-panel";
import { PromptLibrary } from "@/features/prompts/components/prompt-library";

export const metadata: Metadata = { title: "Prompt Library" };

export default function PromptsPage() {
  return (
    <SmoothScrollPanel className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <PromptLibrary />
    </SmoothScrollPanel>
  );
}
