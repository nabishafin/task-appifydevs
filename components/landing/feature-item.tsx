import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeatureItem as FeatureItemData } from "@/types/marketing";

interface FeatureSpotlightProps {
  feature: FeatureItemData;
  illustration: React.ReactNode;
  /** Put the illustration on the left on large screens, alternating the rhythm. */
  reversed?: boolean;
}

/** Large two-column row: copy on one side, a small product fragment on the other. */
export function FeatureSpotlight({ feature, illustration, reversed = false }: FeatureSpotlightProps) {
  const Icon = feature.icon;

  return (
    <article className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={cn("max-w-md", reversed && "lg:order-2 lg:justify-self-end")}>
        <Icon className="size-5 text-primary-text" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{feature.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{feature.description}</p>
        <ul className="mt-5 space-y-2">
          {feature.points.map((point) => (
            <li key={point} className="flex items-center gap-2 text-sm text-foreground/90">
              <Check className="size-4 text-primary-text" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn("min-w-0", reversed && "lg:order-1")}>{illustration}</div>
    </article>
  );
}

/** Compact, boxless feature entry separated only by a hairline. */
export function FeatureListItem({ feature }: { feature: FeatureItemData }) {
  const Icon = feature.icon;

  return (
    <article className="border-t border-border pt-6">
      <Icon className="size-5 text-primary-text" aria-hidden="true" />
      <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
    </article>
  );
}
