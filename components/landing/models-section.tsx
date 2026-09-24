import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { MODELS, PROVIDERS } from "@/data/models";
import { cn } from "@/lib/utils";
import { MODEL_ROW_GRID, ModelRow } from "./model-row";
import { SectionHeading } from "./section-heading";

const PROVIDER_COUNT = Object.keys(PROVIDERS).length;
const COLUMNS = ["Model", "Best for", "Strengths", "Context", "Plan"];

export function ModelsSection() {
  return (
    <section
      id="models"
      aria-labelledby="models-title"
      className="border-y border-border bg-background-subtle py-10 sm:py-14"
    >
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="models-title"
          eyebrow="AI models"
          title="The right model for every task"
          description={`${MODELS.length} models from ${PROVIDER_COUNT} providers, all behind one composer. Start free with the fast models and unlock the flagships with Pro.`}
        />

        <Reveal className="mt-8 overflow-hidden rounded-md border border-border bg-background">
          <div
            aria-hidden="true"
            className={cn(
              "hidden border-b border-border px-5 py-3 text-xs font-medium tracking-wide text-subtle-foreground uppercase",
              MODEL_ROW_GRID,
            )}
          >
            {COLUMNS.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>
          <ul className="divide-y divide-border">
            {MODELS.map((model) => (
              <li key={model.id} className="transition-colors hover:bg-background-subtle">
                <ModelRow model={model} />
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-8 flex justify-center">
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
