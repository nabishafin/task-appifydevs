import { Mail } from "lucide-react";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FAQ_ITEMS } from "@/data/faq";
import { SectionHeading } from "./section-heading";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-y border-border bg-background-subtle py-20 sm:py-28"
    >
      <ResponsiveContainer size="lg" className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you need to know about models, the extension, privacy and plans."
            align="left"
          />
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-medium text-foreground">Still have a question?</p>
            <p className="mt-1 text-sm text-muted-foreground">We usually reply within one business day.</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <a href="mailto:hello@echogpt.live">
                <Mail data-icon="inline-start" aria-hidden="true" />
                hello@echogpt.live
              </a>
            </Button>
          </div>
        </div>

        <Accordion type="single" collapsible defaultValue={FAQ_ITEMS[0]?.id} className="self-start">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border-border">
              <AccordionTrigger className="gap-4 py-5 text-base hover:no-underline">{item.question}</AccordionTrigger>
              <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ResponsiveContainer>
    </section>
  );
}
