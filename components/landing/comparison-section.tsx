import { Check, X } from "lucide-react";
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
    <section aria-labelledby="comparison-title" className="py-20 sm:py-28">
      <ResponsiveContainer size="lg">
        <SectionHeading
          id="comparison-title"
          eyebrow="Before and after"
          title="The same tasks, with far fewer steps"
          description="Everyday AI work compared: juggling separate tools versus doing it all in EchoGPT."
        />

        <Reveal className="mt-14">
          <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">How common AI tasks compare between separate AI tools and EchoGPT</caption>
              <thead>
                <tr className="border-b border-border bg-background-subtle">
                  <th scope="col" className="w-[22%] px-6 py-4 font-medium text-muted-foreground">
                    Task
                  </th>
                  <th scope="col" className="w-[39%] px-6 py-4 font-medium text-muted-foreground">
                    Separate AI tools
                  </th>
                  <th
                    scope="col"
                    className="w-[39%] border-l border-border bg-primary/5 px-6 py-4 font-medium text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <LogoMark className="size-5" />
                      With EchoGPT
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {WORKFLOW_COMPARISON.map((row) => (
                  <tr key={row.task} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-6 py-4 align-top font-medium text-foreground">
                      {row.task}
                    </th>
                    <td className="px-6 py-4 align-top">
                      <TraditionalCell>{row.traditional}</TraditionalCell>
                    </td>
                    <td className="border-l border-border bg-primary/5 px-6 py-4 align-top">
                      <EchoCell>{row.echo}</EchoCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="space-y-3 md:hidden">
            {WORKFLOW_COMPARISON.map((row) => (
              <li key={row.task} className="rounded-lg border border-border bg-card">
                <h3 className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">{row.task}</h3>
                <div className="space-y-3 p-4 text-sm">
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
