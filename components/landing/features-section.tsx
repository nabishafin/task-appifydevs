import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/reveal";
import { FEATURES } from "@/data/features";
import { FeatureDrawer, type DrawerFeature } from "./feature-drawer";
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

// FeatureDrawer is a Client Component: icons must be rendered into JSX here (a Server
// Component), since a raw icon component reference can't cross the client boundary.
const drawerFeatures: DrawerFeature[] = spotlightFeatures.map((feature) => ({
  id: feature.id,
  title: feature.title,
  description: feature.description,
  points: feature.points,
  navIcon: <feature.icon className="size-4" aria-hidden="true" />,
  panelIcon: <feature.icon className="size-5 text-primary-text" aria-hidden="true" />,
}));

export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="border-t border-border py-10 sm:py-14">
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="features-title"
          eyebrow="Features"
          title="Everything you do with AI, in one place"
          description="EchoGPT replaces a row of AI tabs with one focused workspace: pick the right model, keep your context and turn good prompts into repeatable workflows."
        />

        {/* Below lg: every spotlight feature fully expanded, so nothing sits behind a tap. */}
        <div className="mt-8 divide-y divide-border lg:hidden">
          {spotlightFeatures.map((feature, index) => (
            <Reveal key={feature.id} className="py-8 first:pt-0 last:pb-0">
              <FeatureSpotlight feature={feature} illustration={SPOTLIGHT[feature.id]} reversed={index % 2 === 1} />
            </Reveal>
          ))}
        </div>

        {/* lg and up: a compact drawer — pick a feature on the left, its detail slides in on the right. */}
        <Reveal className="mt-8 hidden lg:block">
          <FeatureDrawer features={drawerFeatures} illustrations={SPOTLIGHT} />
        </Reveal>

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
