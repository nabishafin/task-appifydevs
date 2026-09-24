"use client";

import { SegmentedControl } from "@/components/shared/segmented-control";
import { ThemeSegmentedControl } from "@/components/shared/theme-toggle";
import { usePreferencesStore } from "@/store/preferences-store";
import type { Density, FontScale } from "@/types/settings";
import { SettingRow, SettingsCard, SettingsSection } from "./settings-section";

const FONT_OPTIONS: ReadonlyArray<{ value: FontScale; label: string }> = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Default" },
  { value: "lg", label: "Large" },
];

const DENSITY_OPTIONS: ReadonlyArray<{ value: Density; label: string }> = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

export function AppearanceSettings() {
  const fontScale = usePreferencesStore((state) => state.fontScale);
  const density = usePreferencesStore((state) => state.density);
  const setPreference = usePreferencesStore((state) => state.setPreference);

  return (
    <SettingsSection
      id="appearance"
      title="Appearance"
      description="Adjust how EchoGPT looks. Changes apply instantly."
    >
      <SettingsCard>
        <SettingRow label="Theme" description="Dark is the default. System follows your operating system." stacked>
          <ThemeSegmentedControl id="settings-theme" />
        </SettingRow>
        <SettingRow label="Message text size" description="Applies to conversations only." stacked>
          <SegmentedControl
            id="settings-font"
            label="Message text size"
            value={fontScale}
            onValueChange={(value) => setPreference("fontScale", value)}
            options={FONT_OPTIONS}
          />
        </SettingRow>
        <SettingRow label="Message spacing" description="Compact fits more of a conversation on screen." stacked>
          <SegmentedControl
            id="settings-density"
            label="Message spacing"
            value={density}
            onValueChange={(value) => setPreference("density", value)}
            options={DENSITY_OPTIONS}
          />
        </SettingRow>
      </SettingsCard>

      <div className="rounded-lg border border-dashed border-border p-4 sm:p-5" aria-label="Preview">
        <p className="mb-3 text-xs font-medium tracking-wide text-subtle-foreground uppercase">Preview</p>
        <div className="flex flex-col gap-(--chat-gap)">
          <p className="ml-auto max-w-sm rounded-lg rounded-br-md bg-user-message px-4 py-2 text-(length:--chat-font-size) text-foreground">
            Can you summarize this in three bullet points?
          </p>
          <p className="max-w-md text-(length:--chat-font-size) leading-7 text-foreground/90">
            Of course. Here are the three ideas that matter most, with the reasoning behind each one.
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
