import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Stagger, StaggerItem } from "@/components/shared/reveal";
import { TESTIMONIALS } from "@/data/testimonials";
import type { Testimonial } from "@/types/marketing";
import { SectionHeading } from "./section-heading";

function Quote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl bg-card/60 p-6 shadow-xs transition-all duration-200 hover:bg-card hover:shadow-md">
      <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-foreground">
        <p>“{testimonial.quote}”</p>
      </blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="block font-medium text-foreground">{testimonial.name}</span>
        <span className="block text-muted-foreground">
          {testimonial.role}, {testimonial.company}
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="py-10 sm:py-14">
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title="Loved by people who live in their browser"
          description="Designers, engineers, researchers and founders use EchoGPT to spend less time switching and more time shipping."
        />
        <Stagger as="ul" className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <StaggerItem as="li" key={testimonial.id}>
              <Quote testimonial={testimonial} />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-12 text-left text-xs text-subtle-foreground">
          Illustrative testimonials for this redesign concept.
        </p>
      </ResponsiveContainer>
    </section>
  );
}
