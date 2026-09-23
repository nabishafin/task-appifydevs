import type { Metadata } from "next";
import { FavoritesView } from "@/features/history/components/favorites-view";

export const metadata: Metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      <FavoritesView />
    </div>
  );
}
