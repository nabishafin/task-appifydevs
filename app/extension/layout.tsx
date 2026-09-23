import type { Metadata } from "next";
import { WorkspaceHydration } from "@/providers/workspace-hydration";

export const metadata: Metadata = {
  title: "Chrome Extension",
  description:
    "Try the redesigned EchoGPT Chrome extension: summarize pages, explain selections and chat with leading AI models from a compact popup or sidebar.",
  alternates: { canonical: "/extension" },
};

export default function ExtensionLayout({ children }: LayoutProps<"/extension">) {
  return (
    <>
      <WorkspaceHydration />
      {children}
    </>
  );
}
