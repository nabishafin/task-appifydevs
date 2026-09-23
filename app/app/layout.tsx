import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { WorkspaceHydration } from "@/providers/workspace-hydration";

export const metadata: Metadata = {
  title: {
    default: "Workspace",
    template: "%s · EchoGPT",
  },
  description: "Chat with every leading AI model, compare answers and reuse prompts.",
  // The workspace is personal; keep it out of search results.
  robots: { index: false, follow: false },
};

export default function WorkspaceLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <WorkspaceHydration />
      <AppShell>{children}</AppShell>
    </>
  );
}
