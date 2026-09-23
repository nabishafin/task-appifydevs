import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeatureItem } from "@/types/marketing";

interface FeatureCardProps {
  feature: FeatureItem;
  /** Optional decorative UI fragment rendered above the copy. */
  illustration?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ feature, illustration, className }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <article
      className={cn(
        "group flex h-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md",
        className,
      )}
    >
      {illustration && <div className="min-w-0">{illustration}</div>}
      <div className="mt-auto">
        <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background-subtle text-primary-text">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check className="size-3.5 text-primary-text" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
