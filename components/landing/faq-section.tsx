import { Mail } from "lucide-react";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { siteConfig } from "@/constants/site";
import { FAQ_ITEMS } from "@/data/faq";
import { SectionHeading } from "./section-heading";

export function FAQSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="border-y border-border bg-background-subtle py-10 sm:py-14"
    >
      <ResponsiveContainer size="wide" className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div>
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title="Questions, answered"
            description="Everything you need to know about models, the extension, privacy and plans."
            align="left"
          />
          <p className="mt-8 text-sm text-muted-foreground">
            Still have a question? We usually reply within one business day.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary-text underline-offset-4 hover:underline"
          >
            <Mail className="size-4" aria-hidden="true" />
            {siteConfig.email}
          </a>
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
