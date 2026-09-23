import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/shared/states";
import { SettingsView } from "@/features/settings/components/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="min-h-0 flex-1 thin-scrollbar overflow-y-auto">
      {/* SettingsView reads ?section= from the URL, which requires a Suspense boundary. */}
      <Suspense fallback={<LoadingState label="Loading settings" />}>
        <SettingsView />
      </Suspense>
    </div>
  );
}
