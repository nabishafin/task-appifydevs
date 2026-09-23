"use client";

import { MoreHorizontal, Pencil, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ModelIcon } from "@/components/shared/model-icon";
import { TooltipIconButton } from "@/components/shared/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getModel } from "@/data/models";
import { formatListDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import type { Conversation } from "@/types/chat";

function getSnippet(conversation: Conversation): string {
  const last = conversation.messages.at(-1);
  if (!last) return "No messages yet";
  if (last.role === "user") return last.content;
  const firstText = last.blocks.find((block) => block.type === "paragraph" || block.type === "heading");
  return firstText && "text" in firstText ? firstText.text.replace(/\*\*|`/g, "") : "Code snippet";
}

function RenameDialog({
  conversation,
  open,
  onOpenChange,
}: {
  conversation: Conversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const renameConversation = useChatStore((state) => state.renameConversation);
  const [title, setTitle] = useState(conversation.title);
  const trimmed = title.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!trimmed) return;
            renameConversation(conversation.id, trimmed);
            onOpenChange(false);
            toast.success("Conversation renamed");
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename conversation</DialogTitle>
            <DialogDescription>Give it a name you will recognize later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor={`rename-${conversation.id}`}>Title</Label>
            <Input
              id={`rename-${conversation.id}`}
              value={title}
              maxLength={80}
              autoFocus
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={!trimmed}
            />
            {!trimmed && <p className="text-sm text-destructive">Title cannot be empty.</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!trimmed}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  active?: boolean;
  variant?: "sidebar" | "row";
  onNavigate?: () => void;
}

export const ConversationItem = memo(function ConversationItem({
  conversation,
  active = false,
  variant = "sidebar",
  onNavigate,
}: ConversationItemProps) {
  const openConversation = useChatStore((state) => state.openConversation);
  const toggleFavorite = useChatStore((state) => state.toggleFavorite);
  const deleteConversation = useChatStore((state) => state.deleteConversation);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const model = getModel(conversation.modelId);
  const isRow = variant === "row";

  return (
    <div
      className={cn(
        "group/conversation relative flex items-center rounded-lg transition-colors",
        isRow ? "border border-border bg-card hover:border-border-strong" : "hover:bg-sidebar-accent",
        active && !isRow && "bg-sidebar-accent",
      )}
    >
      <Link
        href="/app"
        onClick={() => {
          openConversation(conversation.id);
          onNavigate?.();
        }}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
          isRow ? "gap-3 p-3.5 pr-12" : "py-1.5 pr-9 pl-2",
        )}
      >
        {isRow && <ModelIcon providerId={model.providerId} size="md" />}
        <span className="min-w-0 flex-1">
          <span className={cn("flex items-center gap-1.5", isRow ? "text-sm font-medium" : "text-[0.8125rem]")}>
            <span className={cn("truncate", active ? "text-foreground" : "text-foreground/85")}>
              {conversation.title}
            </span>
            {conversation.isFavorite && (
              <Star className="size-3 shrink-0 fill-warning text-warning" aria-label="Favorite" />
            )}
          </span>
          {isRow && (
            <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="shrink-0">{model.name}</span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{getSnippet(conversation)}</span>
            </span>
          )}
        </span>
        {isRow && (
          <time
            dateTime={conversation.updatedAt}
            suppressHydrationWarning
            className="hidden shrink-0 text-xs text-subtle-foreground sm:block"
          >
            {formatListDate(conversation.updatedAt)}
          </time>
        )}
      </Link>

      <DropdownMenu>
        <TooltipIconButton
          label="Conversation options"
          asMenuTrigger
          size="icon-xs"
          className={cn(
            "absolute right-1.5 opacity-0 group-focus-within/conversation:opacity-100 group-hover/conversation:opacity-100 data-[state=open]:opacity-100 max-md:opacity-100",
            isRow && "right-3 size-8 opacity-100",
          )}
        >
          <MoreHorizontal aria-hidden="true" />
        </TooltipIconButton>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={() => toggleFavorite(conversation.id)}>
            <Star aria-hidden="true" />
            {conversation.isFavorite ? "Remove favorite" : "Add to favorites"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setRenameOpen(true)}>
            <Pencil aria-hidden="true" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 aria-hidden="true" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {renameOpen && <RenameDialog conversation={conversation} open={renameOpen} onOpenChange={setRenameOpen} />}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this conversation?"
        description={`“${conversation.title}” and all of its messages will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={() => {
          deleteConversation(conversation.id);
          toast.success("Conversation deleted");
        }}
      />
    </div>
  );
});
