import { ArrowRight, BookMarked, Check, GitCompareArrows, PanelRight } from "lucide-react";
import Link from "next/link";
import { BrowserFrame } from "@/components/shared/browser-frame";
import { ResponsiveContainer } from "@/components/shared/responsive-container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/constants/site";
import { DEMO_PAGE } from "@/data/extension";
import { CompareMock, ExtensionSidebarMock, PromptLibraryMock } from "./product-mocks";
import { type ProductPreviewTab, ProductPreviewTabs } from "./product-preview-tabs";
import { SectionHeading } from "./section-heading";

interface PreviewPanelProps {
  url: string;
  title: string;
  description: string;
  points: string[];
  children: React.ReactNode;
}

function PreviewPanel({ url, title, description, points, children }: PreviewPanelProps) {
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
      <BrowserFrame url={url} className="min-w-0">
        {children}
      </BrowserFrame>
      <div className="lg:pt-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <ul className="mt-5 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-2.5 text-sm text-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary-text" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const TABS: ProductPreviewTab[] = [
  {
    value: "compare",
    label: "Compare",
    icon: <GitCompareArrows className="max-sm:hidden" aria-hidden="true" />,
    panel: (
      <PreviewPanel
        url="echogpt.live/app/compare"
        title="Two answers, one prompt"
        description="Send a question to two models at once and read the answers side by side before you commit to one."
        points={["Pick any two models", "Continue the thread with the better answer", "Timing shown for every reply"]}
      >
        <CompareMock />
      </PreviewPanel>
    ),
  },
  {
    value: "prompts",
    label: "Prompt library",
    icon: <BookMarked className="max-sm:hidden" aria-hidden="true" />,
    panel: (
      <PreviewPanel
        url="echogpt.live/app/prompts"
        title="Prompts that already work"
        description="Browse ready-made templates by use case, fill in the variables and send, in the app or the sidebar."
        points={["Writing, coding, research and business", "Fill-in {{variables}}", "Save your own favorites"]}
      >
        <PromptLibraryMock />
      </PreviewPanel>
    ),
  },
  {
    value: "sidebar",
    label: "Chrome sidebar",
    icon: <PanelRight className="max-sm:hidden" aria-hidden="true" />,
    panel: (
      <PreviewPanel
        url={DEMO_PAGE.domain}
        title="AI next to what you are reading"
        description="Highlight a sentence and ask for an explanation, or summarize the whole page, without switching tabs."
        points={["Six page-aware quick actions", "Uses the same models and history", "Popup or docked sidebar"]}
      >
        <ExtensionSidebarMock />
      </PreviewPanel>
    ),
  },
];

export function ProductPreviewSection() {
  return (
    <section id="product" aria-labelledby="product-title" className="py-6 sm:py-10 lg:py-14">
      <ResponsiveContainer size="wide">
        <SectionHeading
          id="product-title"
          eyebrow="Product"
          title="A closer look at the workspace"
          description="The same calm interface across the web app and the Chrome extension, designed around how people actually use AI day to day."
        />
        <ProductPreviewTabs tabs={TABS} />
        <div className="mt-12 flex flex-col items-start gap-3 text-left">
          <Button asChild variant="outline" size="lg">
            <Link href={siteConfig.links.app}>
              Open the live demo
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          <Link
            href={siteConfig.links.extension}
            className="text-sm font-medium text-primary-text underline-offset-4 hover:underline"
          >
            Or try the Chrome extension demo
          </Link>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
