import { ExtensionDemo } from "@/components/extension/extension-demo";
import { ExtensionPageHeader } from "@/components/extension/extension-page-header";
import { WhatsNew } from "@/components/extension/whats-new";
import { ResponsiveContainer } from "@/components/shared/responsive-container";

export default function ExtensionPage() {
  return (
    <>
      <ExtensionPageHeader />
      <main id="main" className="flex-1 pb-16">
        <ResponsiveContainer size="xl" className="space-y-10 pt-8 sm:pt-12">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium text-primary-text">Chrome extension · Redesign concept</p>
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">EchoGPT for Chrome</h1>
            <p className="text-base text-pretty text-muted-foreground">
              Every leading AI model on any page you read. Summarize, explain, translate and reply without leaving the
              tab. Try the interactive demo below.
            </p>
          </div>
          <ExtensionDemo />
          <WhatsNew />
        </ResponsiveContainer>
      </main>
    </>
  );
}
