import { ShortcutKeys } from "@/components/shared/shortcut-keys";
import { KEYBOARD_SHORTCUTS, SHORTCUT_SCOPE_LABELS } from "@/constants/shortcuts";
import type { ShortcutScope } from "@/types/shortcuts";

const SCOPES: ShortcutScope[] = ["global", "chat", "navigation"];

/** Grouped list of keyboard shortcuts, shared by the dialog and the settings page. */
export function ShortcutList() {
  return (
    <div className="space-y-5">
      {SCOPES.map((scope) => (
        <section key={scope} aria-labelledby={`shortcuts-${scope}`}>
          <h3
            id={`shortcuts-${scope}`}
            className="mb-2 text-xs font-medium tracking-wide text-subtle-foreground uppercase"
          >
            {SHORTCUT_SCOPE_LABELS[scope]}
          </h3>
          <dl className="divide-y divide-border rounded-xl border border-border">
            {KEYBOARD_SHORTCUTS.filter((shortcut) => shortcut.scope === scope).map((shortcut) => (
              <div key={shortcut.id} className="flex items-center justify-between gap-4 px-3.5 py-2.5 text-sm">
                <dt className="text-foreground">{shortcut.label}</dt>
                <dd>
                  <ShortcutKeys keys={shortcut.keys} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
