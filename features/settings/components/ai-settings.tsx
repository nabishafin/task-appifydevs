"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { ModelIcon } from "@/components/shared/model-icon";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { getModel, MODELS } from "@/data/models";
import { cn } from "@/lib/utils";
import { CUSTOM_INSTRUCTIONS_LIMIT, customInstructionsSchema, type CustomInstructionsInput } from "@/schemas/settings";
import { usePreferencesStore } from "@/store/preferences-store";
import type { ResponseStyle } from "@/types/settings";
import { SettingRow, SettingsCard, SettingsSection } from "./settings-section";

const STYLE_OPTIONS: ReadonlyArray<{ value: ResponseStyle; label: string }> = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

function CustomInstructionsForm() {
  const customInstructions = usePreferencesStore((state) => state.customInstructions);
  const setPreference = usePreferencesStore((state) => state.setPreference);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<CustomInstructionsInput>({
    resolver: zodResolver(customInstructionsSchema),
    values: { customInstructions },
    mode: "onChange",
  });
  const length = useWatch({ control, name: "customInstructions" }).length;

  const onSubmit = handleSubmit((values) => {
    setPreference("customInstructions", values.customInstructions);
    reset(values);
    toast.success("Custom instructions saved", { description: "Stored in this browser for future requests." });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3 px-4 py-4 sm:px-5">
      <Field data-invalid={Boolean(errors.customInstructions)}>
        <FieldLabel htmlFor="custom-instructions">Custom instructions</FieldLabel>
        <FieldDescription id="custom-instructions-help">
          What should every model know about you and how you like answers?
        </FieldDescription>
        <Textarea
          id="custom-instructions"
          rows={4}
          placeholder="I'm a frontend developer. Prefer TypeScript examples and keep explanations short."
          aria-describedby="custom-instructions-help custom-instructions-count"
          aria-invalid={Boolean(errors.customInstructions)}
          {...register("customInstructions")}
        />
        <div className="flex items-start justify-between gap-3">
          <FieldError errors={[errors.customInstructions]} />
          <p
            id="custom-instructions-count"
            className={cn(
              "ml-auto text-xs text-subtle-foreground",
              length > CUSTOM_INSTRUCTIONS_LIMIT && "text-destructive",
            )}
          >
            {length}/{CUSTOM_INSTRUCTIONS_LIMIT}
          </p>
        </div>
      </Field>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={!isDirty}>
          Save instructions
        </Button>
      </div>
    </form>
  );
}

export function AISettings() {
  const defaultModelId = usePreferencesStore((state) => state.defaultModelId);
  const responseStyle = usePreferencesStore((state) => state.responseStyle);
  const sendOnEnter = usePreferencesStore((state) => state.sendOnEnter);
  const showSuggestions = usePreferencesStore((state) => state.showSuggestions);
  const setPreference = usePreferencesStore((state) => state.setPreference);
  const defaultModel = getModel(defaultModelId);

  return (
    <SettingsSection id="ai" title="AI preferences" description="Defaults for every new conversation.">
      <SettingsCard>
        <SettingRow label="Default model" description="Used when you start a new chat." htmlFor="default-model" stacked>
          <Select
            value={defaultModelId}
            onValueChange={(value) => {
              setPreference("defaultModelId", value);
              toast.success(`Default model set to ${getModel(value).name}`);
            }}
          >
            <SelectTrigger id="default-model" className="w-full sm:w-56">
              <ModelIcon providerId={defaultModel.providerId} size="xs" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingRow>
        <SettingRow label="Response length" description="How much detail models include by default." stacked>
          <SegmentedControl
            id="settings-style"
            label="Response length"
            value={responseStyle}
            onValueChange={(value) => setPreference("responseStyle", value)}
            options={STYLE_OPTIONS}
          />
        </SettingRow>
        <SettingRow
          label="Send with Enter"
          description="When off, use Ctrl/⌘ + Enter to send and Enter for a new line."
          htmlFor="send-on-enter"
        >
          <Switch
            id="send-on-enter"
            checked={sendOnEnter}
            onCheckedChange={(value) => setPreference("sendOnEnter", value)}
          />
        </SettingRow>
        <SettingRow
          label="Suggested prompts"
          description="Show starter ideas on the empty chat screen."
          htmlFor="show-suggestions"
        >
          <Switch
            id="show-suggestions"
            checked={showSuggestions}
            onCheckedChange={(value) => setPreference("showSuggestions", value)}
          />
        </SettingRow>
        <CustomInstructionsForm />
      </SettingsCard>
    </SettingsSection>
  );
}
