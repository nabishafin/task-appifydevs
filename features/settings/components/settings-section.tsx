import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ id, title, description, children, className }: SettingsSectionProps) {
  return (
    <section aria-labelledby={`${id}-title`} className={cn("space-y-4", className)}>
      <div>
        <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function SettingsCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("divide-y divide-border rounded-lg border border-border bg-card", className)}>{children}</div>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  /** id of the control, so the label is programmatically associated. */
  htmlFor?: string;
  children: React.ReactNode;
  stacked?: boolean;
}

/** A labelled row with its control on the right (or below on small screens when `stacked`). */
export function SettingRow({ label, description, htmlFor, children, stacked = false }: SettingRowProps) {
  const LabelTag = htmlFor ? "label" : "p";
  return (
    <div
      className={cn(
        "flex gap-4 px-4 py-4 sm:px-5",
        stacked ? "flex-col sm:flex-row sm:items-center sm:justify-between" : "items-center justify-between",
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <LabelTag {...(htmlFor ? { htmlFor } : {})} className="block text-sm font-medium text-foreground">
          {label}
        </LabelTag>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
