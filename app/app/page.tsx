import type { Metadata } from "next";
import { UtilityPanel } from "@/components/app/utility-panel";
import { ChatWorkspace } from "@/features/chat/components/chat-workspace";

export const metadata: Metadata = {
  title: "Chat",
};

export default function ChatPage() {
  return (
    <div className="flex min-h-0 flex-1">
      <ChatWorkspace />
      <UtilityPanel />
    </div>
  );
}
