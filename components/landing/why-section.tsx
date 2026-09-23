import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { BENEFITS } from "@/data/features";
import { SectionHeading } from "./section-heading";

export function WhySection() {
  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className="border-y border-border bg-background-subtle py-20 sm:py-28"
    >
      <ResponsiveContainer size="xl">
        <SectionHeading
          id="why-title"
          eyebrow="Why EchoGPT"
          title="Less juggling, more finished work"
          description="The value is not another chatbot. It is fewer tabs, fewer logins and a workflow that stays the same whichever model you choose."
        />
        <Stagger
          as="ul"
          className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map(({ title, description, icon: Icon, metric }) => (
            <StaggerItem as="li" key={title} className="flex flex-col bg-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background-subtle text-primary-text">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                {metric && (
                  <p className="text-right">
                    <span className="block text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                      {metric.value}
                    </span>
                    <span className="block text-xs text-subtle-foreground">{metric.label}</span>
                  </p>
                )}
              </div>
              <h3 className="mt-6 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </ResponsiveContainer>
    </section>
  );
}
