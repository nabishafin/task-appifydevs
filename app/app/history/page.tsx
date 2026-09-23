import type { Metadata } from "next";
import { HistoryView } from "@/features/history/components/history-view";

export const metadata: Metadata = { title: "History" };

export default function HistoryPage() {
  return (
    <div className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <HistoryView />
    </div>
  );
}
