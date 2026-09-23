"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CUSTOM_INSTRUCTIONS_MAX, TRANSLATE_LANGUAGES } from "@/data/extension";
import { cn } from "@/lib/utils";
import { useExtensionStore } from "@/store/extension-store";

const schema = z.object({
  translateTo: z.enum(TRANSLATE_LANGUAGES, { error: "Choose a language." }),
  customInstructions: z
    .string()
    .trim()
    .max(CUSTOM_INSTRUCTIONS_MAX, `Keep instructions under ${CUSTOM_INSTRUCTIONS_MAX} characters.`),
});

type FormValues = z.infer<typeof schema>;

function toLanguage(value: string): FormValues["translateTo"] {
  return TRANSLATE_LANGUAGES.find((language) => language === value) ?? "Spanish";
}

/** Translation target and custom instructions, validated with zod before saving. */
export function TranslationForm() {
  const settings = useExtensionStore((state) => state.settings);
  const updateSettings = useExtensionStore((state) => state.updateSettings);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      translateTo: toLanguage(settings.translateTo),
      customInstructions: settings.customInstructions,
    },
  });
  const { control, register, handleSubmit, reset, formState } = form;
  const instructions = useWatch({ control, name: "customInstructions" }) ?? "";
  const overLimit = instructions.length > CUSTOM_INSTRUCTIONS_MAX;

  function onSubmit(values: FormValues) {
    updateSettings(values);
    reset(values);
    toast.success("Preferences saved", { description: `Translations now target ${values.translateTo}.` });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3 px-3 py-3">
      <Controller
        control={control}
        name="translateTo"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1.5">
            <FieldLabel htmlFor="extension-translate-to" className="text-[13px]">
              Translate to
            </FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                id="extension-translate-to"
                aria-invalid={fieldState.invalid}
                onBlur={field.onBlur}
                className="h-9 w-full text-[13px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRANSLATE_LANGUAGES.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={[fieldState.error]} className="text-xs" />
          </Field>
        )}
      />

      <Field data-invalid={Boolean(formState.errors.customInstructions)} className="gap-1.5">
        <FieldLabel htmlFor="extension-instructions" className="text-[13px]">
          Custom instructions
        </FieldLabel>
        <Textarea
          id="extension-instructions"
          rows={3}
          placeholder="e.g. Answer in British English and keep code examples in TypeScript."
          aria-invalid={Boolean(formState.errors.customInstructions)}
          aria-describedby="extension-instructions-hint"
          className="min-h-20 resize-none text-[13px]"
          {...register("customInstructions")}
        />
        <div className="flex items-start justify-between gap-2">
          <FieldDescription id="extension-instructions-hint" className="text-xs">
            Added to every extension request.
          </FieldDescription>
          <span
            className={cn("shrink-0 text-xs tabular-nums", overLimit ? "text-destructive" : "text-subtle-foreground")}
          >
            {instructions.length}/{CUSTOM_INSTRUCTIONS_MAX}
          </span>
        </div>
        <FieldError errors={[formState.errors.customInstructions]} className="text-xs" />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" disabled={!formState.isDirty} onClick={() => reset()}>
          Discard
        </Button>
        <Button type="submit" size="sm" disabled={!formState.isDirty || !formState.isValid}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
