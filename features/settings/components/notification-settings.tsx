"use client";

import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { usePreferencesStore } from "@/store/preferences-store";
import type { NotificationPreferences } from "@/types/settings";
import { SettingRow, SettingsCard, SettingsSection } from "./settings-section";

const NOTIFICATION_OPTIONS: Array<{ key: keyof NotificationPreferences; label: string; description: string }> = [
  {
    key: "responseComplete",
    label: "Response finished",
    description: "Notify me when a long answer finishes while I'm in another tab.",
  },
  { key: "productUpdates", label: "Product updates", description: "New models and features, about once a month." },
  { key: "weeklyDigest", label: "Weekly digest", description: "A Monday summary of your saved prompts and favorites." },
];

export function NotificationSettings() {
  const notifications = usePreferencesStore((state) => state.notifications);
  const setNotification = usePreferencesStore((state) => state.setNotification);

  return (
    <SettingsSection id="notifications" title="Notifications" description="Choose what EchoGPT tells you about.">
      <SettingsCard>
        {NOTIFICATION_OPTIONS.map((option) => (
          <SettingRow
            key={option.key}
            label={option.label}
            description={option.description}
            htmlFor={`notify-${option.key}`}
          >
            <Switch
              id={`notify-${option.key}`}
              checked={notifications[option.key]}
              onCheckedChange={(value) => {
                // Optimistic: the switch updates immediately; the toast confirms the (mock) save.
                setNotification(option.key, value);
                toast.success(`${option.label} ${value ? "on" : "off"}`);
              }}
            />
          </SettingRow>
        ))}
      </SettingsCard>
    </SettingsSection>
  );
}
