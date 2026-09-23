import { ShortcutList } from "@/components/app/shortcut-list";
import { SettingsSection } from "./settings-section";

export function ShortcutSettings() {
  return (
    <SettingsSection
      id="shortcuts"
      title="Keyboard shortcuts"
      description="Move faster without the mouse. ⌘ on macOS, Ctrl on Windows and Linux."
    >
      <ShortcutList />
    </SettingsSection>
  );
}
