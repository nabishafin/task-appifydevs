import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { FEATURES } from "@/data/features";
import { FeatureListItem } from "./feature-item";
import { SectionHeading } from "./section-heading";
import { StickyFeatureCards } from "./sticky-feature-cards";

const otherFeatures = FEATURES.filter(
  (feature) => !["multi-model", "model-switching", "browser-sidebar"].includes(feature.id),
);

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-6 sm:py-10 lg:py-14">
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything you do with AI, in one place"
          description="EchoGPT replaces a row of AI tabs with one focused workspace: pick the right model, keep your context and turn good prompts into repeatable workflows."
        />

        {/* Sticky Card Stacking: Cards stack on top of each other as the user scrolls */}
        <StickyFeatureCards />

        <Stagger as="ul" className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {otherFeatures.map((feature) => (
            <StaggerItem as="li" key={feature.id}>
              <FeatureListItem feature={feature} />
            </StaggerItem>
          ))}
        </Stagger>
      </ResponsiveContainer>
    </section>
  );
}
