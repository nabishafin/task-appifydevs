"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ModelIcon } from "@/components/shared/model-icon";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { ThemeSegmentedControl } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EXTENSION_SHORTCUTS } from "@/data/extension";
import { MODELS } from "@/data/models";
import { useIsMac } from "@/hooks/use-is-mac";
import { useExtensionStore } from "@/store/extension-store";
import type { ExtensionSettings } from "@/types/extension";
import type { ResponseStyle } from "@/types/settings";
import { SettingRow, SettingsSection } from "../settings/setting-row";
import { TranslationForm } from "../settings/translation-form";

const RESPONSE_OPTIONS: Array<{ value: ResponseStyle; label: string }> = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

type BooleanSetting = {
  [K in keyof ExtensionSettings]: ExtensionSettings[K] extends boolean ? K : never;
}[keyof ExtensionSettings];

function SwitchRow({ setting, label, description }: { setting: BooleanSetting; label: string; description: string }) {
  const checked = useExtensionStore((state) => state.settings[setting]);
  const updateSettings = useExtensionStore((state) => state.updateSettings);
  const id = `extension-setting-${setting}`;
  return (
    <SettingRow label={label} description={description} htmlFor={id}>
      <Switch id={id} checked={checked} onCheckedChange={(value) => updateSettings({ [setting]: value })} />
    </SettingRow>
  );
}

export function SettingsView() {
  const settings = useExtensionStore((state) => state.settings);
  const updateSettings = useExtensionStore((state) => state.updateSettings);
  const clearHistory = useExtensionStore((state) => state.clearHistory);
  const historyCount = useExtensionStore((state) => state.conversations.length);
  const isMac = useIsMac();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-3 py-3">
      <SettingsSection title="Appearance">
        <SettingRow label="Theme" description="Matches the EchoGPT web app." stacked>
          <ThemeSegmentedControl id="extension-theme" size="sm" className="w-full [&>*]:flex-1" />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Model & responses">
        <SettingRow
          label="Default model"
          description="Used for every new chat."
          htmlFor="extension-default-model"
          stacked
        >
          <Select
            value={settings.defaultModelId}
            onValueChange={(defaultModelId) => {
              updateSettings({ defaultModelId });
              toast.success("Default model updated", { description: "New chats will start with this model." });
            }}
          >
            <SelectTrigger id="extension-default-model" className="h-9 w-full text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <ModelIcon providerId={model.providerId} size="xs" />
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Response length" description="How much detail answers include." stacked>
          <SegmentedControl
            id="extension-response-length"
            label="Response length"
            size="sm"
            value={settings.responseStyle}
            onValueChange={(responseStyle) => updateSettings({ responseStyle })}
            options={RESPONSE_OPTIONS}
            className="w-full [&>*]:flex-1"
          />
        </SettingRow>
        <SwitchRow
          setting="sendOnEnter"
          label="Send on Enter"
          description={isMac ? "Off: use ⌘ + Enter to send." : "Off: use Ctrl + Enter to send."}
        />
        <SwitchRow
          setting="autoReadPage"
          label="Auto-read page context"
          description="Include the current page with quick actions."
        />
      </SettingsSection>

      <SettingsSection title="Translation & instructions">
        <TranslationForm />
      </SettingsSection>

      <SettingsSection id="extension-shortcuts" title="Keyboard shortcuts">
        <ul>
          {EXTENSION_SHORTCUTS.map((shortcut) => (
            <li
              key={shortcut.id}
              className="flex items-center justify-between gap-3 border-b border-border px-3 py-2 last:border-b-0"
            >
              <span className="text-[13px]">{shortcut.label}</span>
              <ShortcutKeys keys={isMac ? shortcut.mac : shortcut.other} />
            </li>
          ))}
        </ul>
        <div className="px-3 py-2">
          <Button
            variant="link"
            size="sm"
            className="h-8 px-0"
            onClick={() =>
              toast.info("Opens chrome://extensions/shortcuts", {
                description: "Shortcut editing happens in Chrome. This is a demo.",
              })
            }
          >
            Customize in Chrome
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Privacy">
        <SwitchRow
          setting="saveHistory"
          label="Save conversation history"
          description="When off, chats are not stored on this device."
        />
        <SwitchRow
          setting="excludeIncognito"
          label="Disable in incognito"
          description="EchoGPT stays off in private windows."
        />
        <SettingRow
          label="Clear history"
          description={`${historyCount} saved conversation${historyCount === 1 ? "" : "s"}.`}
        >
          <Button
            variant="destructive-subtle"
            size="sm"
            disabled={historyCount === 0}
            onClick={() => setConfirmClear(true)}
          >
            <Trash2 aria-hidden="true" />
            Clear
          </Button>
        </SettingRow>
      </SettingsSection>

      <p className="px-1 pb-1 text-center text-[11px] text-subtle-foreground">
        EchoGPT for Chrome · v3.0 redesign preview
      </p>

      <ConfirmDialog
        open={confirmClear}
        onOpenChange={setConfirmClear}
        title="Clear all extension history?"
        description="This permanently removes every conversation saved by the extension on this device."
        confirmLabel="Clear history"
        onConfirm={() => {
          clearHistory();
          toast.success("History cleared");
        }}
      />
    </div>
  );
}
