import type { Metadata } from "next";
import { Suspense } from "react";
import { SkeletonLoader } from "@/components/shared/states";
import { CompareView } from "@/features/compare/components/compare-view";

export const metadata: Metadata = { title: "Compare models" };

export default function ComparePage() {
  return (
    <div className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      {/* CompareView reads ?prompt= from the URL, which requires a Suspense boundary. */}
      <Suspense fallback={<SkeletonLoader variant="cards" count={2} className="mx-auto max-w-6xl p-8" />}>
        <CompareView />
      </Suspense>
    </div>
  );
}
