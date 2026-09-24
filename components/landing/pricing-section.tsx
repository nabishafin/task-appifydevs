import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { PricingPlans } from "./pricing-plans";
import { SectionHeading } from "./section-heading";

export function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="bg-background-subtle py-10 sm:py-14"
    >
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title="One subscription instead of four"
          description="Start free with the fast models. Upgrade when you want every model, side-by-side comparison and no daily limits."
        />
        <PricingPlans />
        <p className="mt-8 text-left text-xs text-subtle-foreground">
          Prices in USD, per seat. Taxes may apply. Concept pricing for this redesign.
        </p>
      </ResponsiveContainer>
    </section>
  );
}
