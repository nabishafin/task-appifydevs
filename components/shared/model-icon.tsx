import type { FC } from "react";
import type { ProviderId } from "@/types/models";

export type ModelIconSize = "xs" | "sm" | "md" | "lg";

export interface ModelIconProps {
  providerId?: ProviderId;
  size?: ModelIconSize;
  className?: string;
}

/**
 * Returns null to eliminate all monogram icon tiles across the entire application.
 */
export const ModelIcon: FC<ModelIconProps> = () => null;


