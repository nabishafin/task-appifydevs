import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { FEATURES } from "@/data/features";
import {
  CompareIllustration,
  MixedThreadIllustration,
  ModelSwitcherIllustration,
  QuickActionsIllustration,
} from "./feature-illustrations";
import { FeatureListItem, FeatureSpotlight } from "./feature-item";
import { SectionHeading } from "./section-heading";

/** The three capabilities that get a full row with a product fragment; the rest are listed below. */
const SPOTLIGHT: Record<string, React.ReactNode> = {
  "multi-model": (
    <div className="grid gap-3 sm:grid-cols-2">
      <ModelSwitcherIllustration />
      <MixedThreadIllustration className="hidden sm:flex" />
    </div>
  ),
  "model-switching": <CompareIllustration />,
  "browser-sidebar": <QuickActionsIllustration />,
};

const spotlightFeatures = FEATURES.filter((feature) => feature.id in SPOTLIGHT);
const otherFeatures = FEATURES.filter((feature) => !(feature.id in SPOTLIGHT));

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="py-20 sm:py-28">
      <ResponsiveContainer size="xl">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything you do with AI, in one place"
          description="EchoGPT replaces a row of AI tabs with one focused workspace: pick the right model, keep your context and turn good prompts into repeatable workflows."
        />

        <div className="mt-16 divide-y divide-border">
          {spotlightFeatures.map((feature, index) => (
            <Reveal key={feature.id}>
              <FeatureSpotlight feature={feature} illustration={SPOTLIGHT[feature.id]} reversed={index % 2 === 1} />
            </Reveal>
          ))}
        </div>

        <Stagger as="ul" className="mt-16 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
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
