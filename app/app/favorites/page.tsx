import type { Metadata } from "next";
import { SmoothScrollPanel } from "@/components/shared/smooth-scroll-panel";
import { FavoritesView } from "@/features/history/components/favorites-view";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <SmoothScrollPanel className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <FavoritesView />
    </SmoothScrollPanel>
  );
}
