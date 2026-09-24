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
      <ResponsiveContainer size="xl" className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
        <SectionHeading
          id="why-title"
          eyebrow="Why EchoGPT"
          title="Less juggling, more finished work"
          description="The value is not another chatbot. It is fewer tabs, fewer logins and a workflow that stays the same whichever model you choose."
          align="left"
          className="lg:sticky lg:top-28 lg:self-start"
        />
        <Stagger as="ul" className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {BENEFITS.map(({ title, description, metric }) => (
            <StaggerItem as="li" key={title} className="border-t border-border pt-6">
              {metric && (
                <p className="flex items-baseline gap-2">
                  <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                    {metric.value}
                  </span>
                  <span className="text-sm text-subtle-foreground">{metric.label}</span>
                </p>
              )}
              <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </ResponsiveContainer>
    </section>
  );
}
