import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { inlineValidationPlatformContract } from "@design-system/components/platforms";

export type InlineValidationState = "default" | "info" | "success" | "warning" | "error" | "disabled";

export interface InlineValidationProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string;
  message?: string;
  state?: InlineValidationState;
  id?: string;
  fullWidth?: boolean;
  field?: boolean;
  live?: boolean;
}

export interface InlineValidationComponent extends ForwardRefExoticComponent<InlineValidationProps & RefAttributes<HTMLDivElement>> {
  displayName: "InlineValidation";
  platformContract: typeof inlineValidationPlatformContract;
}

export const InlineValidation: InlineValidationComponent;
