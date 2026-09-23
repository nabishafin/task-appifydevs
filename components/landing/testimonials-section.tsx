import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { TESTIMONIALS } from "@/data/testimonials";
import type { Testimonial } from "@/types/marketing";
import { SectionHeading } from "./section-heading";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
      <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-foreground">
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background-subtle text-xs font-semibold text-muted-foreground"
        >
          {getInitials(testimonial.name)}
        </span>
        <span className="min-w-0 text-sm">
          <span className="block font-medium text-foreground">{testimonial.name}</span>
          <span className="block text-muted-foreground">
            {testimonial.role} · {testimonial.company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="py-20 sm:py-28">
      <ResponsiveContainer size="xl">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title="Loved by people who live in their browser"
          description="Designers, engineers, researchers and founders use EchoGPT to spend less time switching and more time shipping."
        />
        <Stagger as="ul" className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem as="li" key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-8 text-center text-xs text-subtle-foreground">
          Illustrative testimonials for this redesign concept.
        </p>
      </ResponsiveContainer>
    </section>
  );
}
