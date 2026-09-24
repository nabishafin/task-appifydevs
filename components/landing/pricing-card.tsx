import { Check } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BillingCycle, PricingTier } from "@/types/marketing";

interface PricingCardProps {
  tier: PricingTier;
  billing: BillingCycle;
  className?: string;
}

/** Rendered inside the client pricing island, so motion is available here. */
export function PricingCard({ tier, billing, className }: PricingCardProps) {
  const price = tier.price ? tier.price[billing] : 0;
  const highlighted = Boolean(tier.highlighted);
  const titleId = `plan-${tier.id}`;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "relative flex h-full flex-col rounded-lg border bg-card p-6 sm:p-7",
        highlighted ? "border-primary/60 shadow-md ring-1 ring-primary/30" : "border-border",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={titleId} className="text-base font-semibold text-foreground">
          {tier.name}
        </h3>
        {tier.badge && (
          <span className="rounded-md bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
            {tier.badge}
          </span>
        )}
      </div>
      <p className="mt-2 min-h-10 text-sm text-muted-foreground">{tier.description}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="relative inline-flex overflow-hidden text-4xl font-semibold tracking-tight text-foreground tabular-nums">
          <span className="sr-only">{tier.price ? `$${price} ${tier.priceNote}` : tier.priceNote}</span>
          {/* initial=false keeps the server-rendered price visible; only later toggles animate. */}
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={price}
              aria-hidden="true"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              ${price}
            </m.span>
          </AnimatePresence>
        </span>
        <span aria-hidden="true" className="text-sm text-muted-foreground">
          {tier.price ? tier.priceNote : "forever"}
        </span>
      </div>
      <p className="mt-1 h-5 text-xs text-subtle-foreground">
        {tier.price
          ? billing === "yearly"
            ? `Billed $${tier.price.yearly * 12} per year`
            : "Billed monthly, cancel anytime"
          : "No credit card required"}
      </p>

      <Button asChild size="lg" variant={highlighted ? "default" : "outline"} className="mt-6 w-full">
        <Link href={tier.cta.href}>{tier.cta.label}</Link>
      </Button>

      <ul className="mt-7 space-y-3 border-t border-border pt-6">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2.5 text-sm text-muted-foreground">
            <Check
              className={cn("mt-0.5 size-4 shrink-0", highlighted ? "text-primary-text" : "text-foreground")}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
    </article>
  );
}
