import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ChatComposer } from "@/features/chat/components/chat-composer";
import type { Attachment } from "@/types/chat";

function Harness({ onSubmit, sendOnEnter = true }: { onSubmit: (value: string) => void; sendOnEnter?: boolean }) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  return (
    <TooltipProvider>
      <ChatComposer
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => {
          onSubmit(text);
          setValue("");
        }}
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        sendOnEnter={sendOnEnter}
      />
    </TooltipProvider>
  );
}

describe("ChatComposer", () => {
  it("disables sending until there is text", async () => {
    const user = userEvent.setup();
    render(<Harness onSubmit={vi.fn()} />);

    const send = screen.getByRole("button", { name: "Send message" });
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText("Message"), "   ");
    expect(send).toBeDisabled();

    await user.type(screen.getByLabelText("Message"), "Hello");
    expect(send).toBeEnabled();
  });

  it("sends on Enter and adds a new line on Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    const textarea = screen.getByLabelText("Message");

    await user.type(textarea, "First line{Shift>}{Enter}{/Shift}Second line");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(textarea).toHaveValue("First line\nSecond line");

    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("First line\nSecond line");
    expect(textarea).toHaveValue("");
  });

  it("requires Ctrl/⌘+Enter when send-on-Enter is turned off", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} sendOnEnter={false} />);

    await user.type(screen.getByLabelText("Message"), "Draft{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();

    await user.keyboard("{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledWith("Draft\n");
  });
});
