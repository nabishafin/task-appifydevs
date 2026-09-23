"use client";

import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useChatStore } from "@/store/chat-store";
import { usePreferencesStore } from "@/store/preferences-store";
import type { PrivacyPreferences } from "@/types/settings";
import { SettingRow, SettingsCard, SettingsSection } from "./settings-section";

const PRIVACY_OPTIONS: Array<{ key: keyof PrivacyPreferences; label: string; description: string }> = [
  {
    key: "saveHistory",
    label: "Save conversation history",
    description: "Keep chats so you can search and revisit them.",
  },
  {
    key: "improveModels",
    label: "Help improve models",
    description: "Share anonymized conversations with providers. Off by default.",
  },
  {
    key: "shareAnalytics",
    label: "Usage analytics",
    description: "Anonymous product analytics, never message content.",
  },
];

function downloadJson(filename: string, data: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

export function PrivacySettings() {
  const privacy = usePreferencesStore((state) => state.privacy);
  const setPrivacy = usePreferencesStore((state) => state.setPrivacy);
  const conversations = useChatStore((state) => state.conversations);
  const clearHistory = useChatStore((state) => state.clearHistory);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <SettingsSection id="privacy" title="Privacy" description="You own your data. Control what is stored and shared.">
      <SettingsCard>
        {PRIVACY_OPTIONS.map((option) => (
          <SettingRow
            key={option.key}
            label={option.label}
            description={option.description}
            htmlFor={`privacy-${option.key}`}
          >
            <Switch
              id={`privacy-${option.key}`}
              checked={privacy[option.key]}
              onCheckedChange={(value) => {
                setPrivacy(option.key, value);
                // Re-persist the chat store so saved history is dropped (or restored) right away.
                if (option.key === "saveHistory") useChatStore.setState({});
                toast.success(`${option.label} ${value ? "on" : "off"}`);
              }}
            />
          </SettingRow>
        ))}
      </SettingsCard>

      <SettingsCard>
        <SettingRow label="Export your data" description="Download every conversation as a JSON file." stacked>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              downloadJson("echogpt-conversations.json", conversations);
              toast.success(`Exported ${conversations.length} conversations`);
            }}
          >
            <Download aria-hidden="true" />
            Export
          </Button>
        </SettingRow>
        <SettingRow
          label="Delete all conversations"
          description="Permanently remove your chat history from this browser."
          stacked
        >
          <Button
            variant="destructive-subtle"
            size="sm"
            disabled={conversations.length === 0}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 aria-hidden="true" />
            Delete all
          </Button>
        </SettingRow>
      </SettingsCard>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete all conversations?"
        description={`This permanently deletes ${conversations.length} conversations. Export them first if you want a copy.`}
        confirmLabel="Delete everything"
        onConfirm={() => {
          clearHistory();
          toast.success("All conversations deleted");
        }}
      />
    </SettingsSection>
  );
}
