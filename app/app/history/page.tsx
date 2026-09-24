import type { Metadata } from "next";
import { SmoothScrollPanel } from "@/components/shared/smooth-scroll-panel";
import { HistoryView } from "@/features/history/components/history-view";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <SmoothScrollPanel className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <HistoryView />
    </SmoothScrollPanel>
  );
}
