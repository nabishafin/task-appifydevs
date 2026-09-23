import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { FEATURES } from "@/data/features";
import { FeatureCard } from "./feature-card";
import {
  CommandPaletteIllustration,
  CompareIllustration,
  HistorySearchIllustration,
  MixedThreadIllustration,
  ModelSwitcherIllustration,
  PromptVariablesIllustration,
  QuickActionsIllustration,
  SavedPromptsIllustration,
} from "./feature-illustrations";
import { SectionHeading } from "./section-heading";

/** Bento placement per feature id; ids without an entry fall back to a single cell. */
const LAYOUT: Record<string, { className: string; illustration?: React.ReactNode }> = {
  "multi-model": {
    className: "md:col-span-2 lg:col-span-4",
    illustration: (
      <div className="grid gap-3 sm:grid-cols-2">
        <ModelSwitcherIllustration />
        <MixedThreadIllustration className="hidden sm:flex" />
      </div>
    ),
  },
  "model-switching": { className: "lg:col-span-2", illustration: <CompareIllustration /> },
  "browser-sidebar": { className: "lg:col-span-2", illustration: <QuickActionsIllustration /> },
  "prompt-workflows": { className: "lg:col-span-2", illustration: <PromptVariablesIllustration /> },
  organization: { className: "lg:col-span-2", illustration: <HistorySearchIllustration /> },
  shortcuts: { className: "lg:col-span-3", illustration: <CommandPaletteIllustration /> },
  "reusable-prompts": { className: "lg:col-span-3", illustration: <SavedPromptsIllustration /> },
};

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
        <Stagger as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {FEATURES.map((feature) => {
            const layout = LAYOUT[feature.id];
            return (
              <StaggerItem as="li" key={feature.id} className={layout?.className ?? "lg:col-span-2"}>
                <FeatureCard feature={feature} illustration={layout?.illustration} />
              </StaggerItem>
            );
          })}
        </Stagger>
      </ResponsiveContainer>
    </section>
  );
}
