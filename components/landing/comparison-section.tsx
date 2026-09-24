import { Check, X } from "lucide-react";
import Image from "next/image";
import beforeAfter from "@/public/before-after.png";
import { LogoMark } from "@/components/shared/logo";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Reveal } from "@/components/shared/reveal";
import { WORKFLOW_COMPARISON } from "@/data/features";
import { SectionHeading } from "./section-heading";

interface CellProps {
  children: React.ReactNode;
  /** Adds a visually hidden prefix where no column header provides context. */
  labelled?: boolean;
}

function TraditionalCell({ children, labelled = false }: CellProps) {
  return (
    <span className="flex gap-2.5 text-muted-foreground">
      <X className="mt-0.5 size-4 shrink-0 text-subtle-foreground" aria-hidden="true" />
      <span>
        {labelled && <span className="sr-only">Without EchoGPT: </span>}
        {children}
      </span>
    </span>
  );
}

function EchoCell({ children, labelled = false }: CellProps) {
  return (
    <span className="flex gap-2.5 font-medium text-foreground">
      <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
      <span>
        {labelled && <span className="sr-only">With EchoGPT: </span>}
        {children}
      </span>
    </span>
  );
}

export function ComparisonSection() {
  return (
    <section aria-labelledby="comparison-title" className="py-10 sm:py-14">
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="comparison-title"
          eyebrow="Before and after"
          title="The same tasks, with far fewer steps"
          description="Everyday AI work compared: juggling separate tools versus doing it all in EchoGPT."
        />

        <Reveal className="mt-8">
          <figure className="w-full overflow-hidden rounded-2xl bg-card shadow-md">
            <Image
              src={beforeAfter}
              alt="Before: ChatGPT, Claude, Gemini, Perplexity and Notion AI open as separate windows. After: one EchoGPT workspace with every model in a single composer."
              sizes="(min-width: 1280px) 1216px, calc(100vw - 2rem)"
              placeholder="blur"
              className="h-auto w-full"
            />
          </figure>
        </Reveal>

        <Reveal className="mt-8">
          <div className="hidden overflow-hidden rounded-2xl bg-card shadow-md md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">How common AI tasks compare between separate AI tools and EchoGPT</caption>
              <thead>
                <tr className="bg-background-subtle/80">
                  <th scope="col" className="w-[22%] px-6 py-4 font-medium text-muted-foreground">
                    Task
                  </th>
                  <th scope="col" className="w-[39%] px-6 py-4 font-medium text-muted-foreground">
                    Separate AI tools
                  </th>
                  <th
                    scope="col"
                    className="w-[39%] bg-primary/10 px-6 py-4 font-medium text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <LogoMark className="h-5 w-auto" />
                      With EchoGPT
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {WORKFLOW_COMPARISON.map((row) => (
                  <tr key={row.task} className="transition-colors hover:bg-background-subtle/40">
                    <th scope="row" className="px-6 py-4 align-top font-medium text-foreground">
                      {row.task}
                    </th>
                    <td className="px-6 py-4 align-top">
                      <TraditionalCell>{row.traditional}</TraditionalCell>
                    </td>
                    <td className="bg-primary/5 px-6 py-4 align-top">
                      <EchoCell>{row.echo}</EchoCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-4 md:hidden">
            {WORKFLOW_COMPARISON.map((row) => (
              <li key={row.task} className="overflow-hidden rounded-xl bg-card p-5 shadow-xs">
                <h3 className="text-sm font-semibold text-foreground">{row.task}</h3>
                <div className="mt-3 space-y-3 text-sm">
                  <TraditionalCell labelled>{row.traditional}</TraditionalCell>
                  <EchoCell labelled>{row.echo}</EchoCell>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </ResponsiveContainer>
    </section>
  );
}
