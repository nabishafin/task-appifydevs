import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const headingId = `${id ?? title.toLowerCase().replace(/\W+/g, "-")}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-3 space-y-2">
      <div className="px-1">
        <h3 id={headingId} className="text-[11px] font-medium tracking-wide text-subtle-foreground uppercase">
          {title}
        </h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card">{children}</div>
    </section>
  );
}

interface SettingRowProps {
  label: string;
  description?: string;
  /** id of the control so the label is announced with it. */
  htmlFor?: string;
  children: React.ReactNode;
  stacked?: boolean;
}

export function SettingRow({ label, description, htmlFor, children, stacked = false }: SettingRowProps) {
  const LabelTag = htmlFor ? "label" : "p";
  return (
    <div className={cn("flex gap-3 px-3 py-2.5", stacked ? "flex-col" : "items-center justify-between")}>
      <div className="min-w-0 space-y-0.5">
        <LabelTag htmlFor={htmlFor} className="block text-[13px] font-medium text-foreground">
          {label}
        </LabelTag>
        {description && <p className="text-xs leading-snug text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("shrink-0", stacked && "w-full")}>{children}</div>
    </div>
  );
}
