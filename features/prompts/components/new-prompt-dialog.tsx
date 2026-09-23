"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROMPT_CATEGORIES } from "@/data/prompts";
import { PROMPT_LIMITS, promptTemplateSchema, type PromptTemplateInput } from "@/schemas/prompt";
import { usePromptStore } from "@/store/prompt-store";

interface NewPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_VALUES: PromptTemplateInput = { title: "", description: "", category: "writing", prompt: "" };

export function NewPromptDialog({ open, onOpenChange }: NewPromptDialogProps) {
  const addCustomPrompt = usePromptStore((state) => state.addCustomPrompt);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromptTemplateInput>({
    resolver: zodResolver(promptTemplateSchema),
    defaultValues: EMPTY_VALUES,
    mode: "onTouched",
  });

  const promptLength = useWatch({ control, name: "prompt" }).length;

  function close() {
    onOpenChange(false);
    reset(EMPTY_VALUES);
  }

  const onSubmit = handleSubmit((values) => {
    addCustomPrompt(values);
    toast.success("Prompt saved", { description: `“${values.title}” is now in your library.` });
    close();
  });

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={onSubmit} noValidate className="grid gap-5">
          <DialogHeader>
            <DialogTitle>Create a prompt</DialogTitle>
            <DialogDescription>
              Save instructions you reuse. Add variables like <code className="font-mono">{"{{topic}}"}</code> to fill
              in later.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="prompt-title">Title</FieldLabel>
              <Input
                id="prompt-title"
                placeholder="Weekly status update"
                aria-invalid={Boolean(errors.title)}
                {...register("title")}
              />
              <FieldError errors={[errors.title]} />
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="prompt-description">Description</FieldLabel>
              <Input
                id="prompt-description"
                placeholder="Turns my notes into a crisp update for stakeholders"
                aria-invalid={Boolean(errors.description)}
                {...register("description")}
              />
              <FieldError errors={[errors.description]} />
            </Field>

            <Field data-invalid={Boolean(errors.category)}>
              <FieldLabel htmlFor="prompt-category">Category</FieldLabel>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="prompt-category" className="w-full" aria-invalid={Boolean(errors.category)}>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROMPT_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.category]} />
            </Field>

            <Field data-invalid={Boolean(errors.prompt)}>
              <FieldLabel htmlFor="prompt-body">Prompt</FieldLabel>
              <Textarea
                id="prompt-body"
                rows={5}
                placeholder={"Summarize these notes for {{audience}} in five bullet points:\n\n{{notes}}"}
                aria-invalid={Boolean(errors.prompt)}
                aria-describedby="prompt-body-count"
                className="font-mono text-sm"
                {...register("prompt")}
              />
              <FieldDescription id="prompt-body-count" className="flex justify-between">
                <span>Use double curly braces for variables.</span>
                <span className={promptLength > PROMPT_LIMITS.prompt ? "text-destructive" : undefined}>
                  {promptLength}/{PROMPT_LIMITS.prompt}
                </span>
              </FieldDescription>
              <FieldError errors={[errors.prompt]} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save prompt
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
