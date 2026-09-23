"use client";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PromptTemplate } from "@/types/prompts";
import { extractVariables, fillTemplate } from "../lib/prompt-utils";

const LONG_VARIABLES = new Set(["text", "code", "notes", "thread", "sourceA", "sourceB", "tasks"]);

function toLabel(variable: string): string {
  const spaced = variable.replace(/([a-z])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

interface UsePromptDialogProps {
  prompt: PromptTemplate | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (text: string) => void;
}

/** Fills a template's {{variables}} with a live preview before sending it to the chat. */
export function UsePromptDialog({ prompt, onOpenChange, onConfirm }: UsePromptDialogProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const variables = useMemo(() => (prompt ? extractVariables(prompt.prompt) : []), [prompt]);
  const preview = prompt ? fillTemplate(prompt.prompt, values) : "";

  return (
    <Dialog
      open={prompt !== null}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) setValues({});
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <form
          className="grid gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm(preview);
            setValues({});
          }}
        >
          <DialogHeader>
            <DialogTitle>{prompt?.title}</DialogTitle>
            <DialogDescription>
              Fill in the details. Anything left blank stays as a placeholder you can edit.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            {variables.map((variable, index) => {
              const id = `variable-${variable}`;
              const common = {
                id,
                value: values[variable] ?? "",
                autoFocus: index === 0,
                placeholder: `Enter ${toLabel(variable).toLowerCase()}`,
                onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setValues((current) => ({ ...current, [variable]: event.target.value })),
              };
              return (
                <Field key={variable}>
                  <FieldLabel htmlFor={id}>{toLabel(variable)}</FieldLabel>
                  {LONG_VARIABLES.has(variable) ? <Textarea rows={3} {...common} /> : <Input {...common} />}
                </Field>
              );
            })}
          </FieldGroup>

          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-subtle-foreground uppercase">Preview</p>
            <p className="max-h-40 thin-scrollbar overflow-y-auto rounded-lg border border-border bg-background-subtle p-3 font-mono text-xs leading-5 whitespace-pre-wrap text-muted-foreground">
              {preview}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Open in chat
              <ArrowRight aria-hidden="true" />
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
