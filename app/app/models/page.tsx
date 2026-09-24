import type { Metadata } from "next";
import { SmoothScrollPanel } from "@/components/shared/smooth-scroll-panel";
import { ModelCatalog } from "@/features/models/components/model-catalog";

export const metadata: Metadata = { title: "AI Models" };

export default function ModelsPage() {
  return (
    <SmoothScrollPanel className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <ModelCatalog />
    </SmoothScrollPanel>
  );
}
