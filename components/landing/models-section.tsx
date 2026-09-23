import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { MODELS, PROVIDERS } from "@/data/models";
import { ModelCard } from "./model-card";
import { SectionHeading } from "./section-heading";

const PROVIDER_COUNT = Object.keys(PROVIDERS).length;

export function ModelsSection() {
  return (
    <section
      id="models"
      aria-labelledby="models-title"
      className="border-y border-border bg-background-subtle py-20 sm:py-28"
    >
      <ResponsiveContainer size="xl">
        <SectionHeading
          id="models-title"
          eyebrow="AI models"
          title="The right model for every task"
          description={`${MODELS.length} models from ${PROVIDER_COUNT} providers, all behind one composer. Start free with the fast models and unlock the flagships with Pro.`}
        />
        <Stagger as="ul" className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {MODELS.map((model) => (
            <StaggerItem as="li" key={model.id}>
              <ModelCard model={model} />
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href={siteConfig.links.app}>
              Try any model in the app
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
