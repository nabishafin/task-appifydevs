"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { requestCompletion } from "@/features/chat/lib/mock-responder";
import type { MessageBlock } from "@/types/chat";
import type { ResponseStyle } from "@/types/settings";

export type CompareResult =
  | { status: "idle" }
  | { status: "loading"; modelId: string }
  | { status: "success"; modelId: string; blocks: MessageBlock[]; durationMs: number }
  | { status: "error"; modelId: string; message: string };

/** Runs one prompt against several models in parallel with independent loading states. */
export function useCompareRun(slots: number) {
  const [results, setResults] = useState<CompareResult[]>(() =>
    Array.from({ length: slots }, () => ({ status: "idle" })),
  );
  const controllers = useRef<AbortController[]>([]);

  useEffect(() => () => controllers.current.forEach((controller) => controller.abort()), []);

  const runSlot = useCallback(async (index: number, prompt: string, modelId: string, style?: ResponseStyle) => {
    controllers.current[index]?.abort();
    const controller = new AbortController();
    controllers.current[index] = controller;
    const update = (result: CompareResult) =>
      setResults((current) => current.map((item, itemIndex) => (itemIndex === index ? result : item)));

    update({ status: "loading", modelId });
    const startedAt = performance.now();
    try {
      const blocks = await requestCompletion({ prompt, modelId, style, signal: controller.signal });
      update({ status: "success", modelId, blocks, durationMs: Math.round(performance.now() - startedAt) });
    } catch (error) {
      if (controller.signal.aborted) return;
      update({
        status: "error",
        modelId,
        message: error instanceof Error ? error.message : "The model did not respond.",
      });
    }
  }, []);

  const runAll = useCallback(
    (prompt: string, modelIds: string[], style?: ResponseStyle) => {
      modelIds.forEach((modelId, index) => void runSlot(index, prompt, modelId, style));
    },
    [runSlot],
  );

  const isRunning = results.some((result) => result.status === "loading");

  return { results, runAll, runSlot, isRunning };
}
