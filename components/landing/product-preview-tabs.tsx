"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ProductPreviewTab {
  value: string;
  label: string;
  /** Pre-rendered icon element; components cannot cross the server/client boundary. */
  icon: React.ReactNode;
  panel: React.ReactNode;
}

interface ProductPreviewTabsProps {
  tabs: ProductPreviewTab[];
}

/**
 * Thin client wrapper around Radix Tabs. Panels are rendered on the server and
 * force-mounted so every screen is in the initial HTML; inactive ones are hidden.
 */
export function ProductPreviewTabs({ tabs }: ProductPreviewTabsProps) {
  return (
    <Tabs defaultValue={tabs[0]?.value} className="mt-12 gap-8">
      <TabsList aria-label="Product screens" className="mx-auto h-10! max-w-full overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="px-3">
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          forceMount
          className="animate-in duration-300 fade-in data-[state=inactive]:hidden"
        >
          {tab.panel}
        </TabsContent>
      ))}
    </Tabs>
  );
}
