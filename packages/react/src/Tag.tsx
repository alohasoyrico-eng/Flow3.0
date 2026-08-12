import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { tagPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type TagVariant = "metadata" | "status" | "platform" | "link";
export type TagTone = "neutral" | "info" | "success" | "warning" | "danger";
export type TagState = "default" | "hover" | "pressed" | "focus" | "disabled";
export type TagDensity = "sm" | "md" | "lg";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement> & ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  variant?: TagVariant;
  tone?: TagTone;
  state?: TagState;
  density?: TagDensity;
  icon?: string;
  interactive?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface TagComponent extends ForwardRefExoticComponent<TagProps & RefAttributes<HTMLSpanElement | HTMLButtonElement>> {
  displayName: "Tag";
  platformContract: typeof tagPlatformContract;
}

const validVariants = new Set<TagVariant>(["metadata", "status", "platform", "link"]);
const validTones = new Set<TagTone>(["neutral", "info", "success", "warning", "danger"]);
const validStates = new Set<TagState>(["default", "hover", "pressed", "focus", "disabled"]);
const validTypes = new Set<NonNullable<TagProps["type"]>>(["button", "submit", "reset"]);

function normalizeVariant(variant: TagVariant | undefined): TagVariant {
  return variant && validVariants.has(variant) ? variant : "metadata";
}

function normalizeTone(tone: TagTone | undefined): TagTone {
  return tone && validTones.has(tone) ? tone : "neutral";
}

function normalizeState({ disabled = false, state = "default" }: { disabled?: boolean; state?: TagState } = {}): TagState {
  if (disabled) return "disabled";
  return state && validStates.has(state) ? state : "default";
}

export const Tag = forwardRef<HTMLSpanElement | HTMLButtonElement, TagProps>(function Tag({
  label,
  variant = "metadata",
  tone = "neutral",
  state = "default",
  density,
  icon = "",
  interactive = false,
  disabled = false,
  className = "",
  type = "button",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedTone = normalizeTone(tone);
  const resolvedState = normalizeState({ disabled, state });
  const resolvedType = validTypes.has(type) ? type : "button";
  const canInteract = Boolean(rest.onClick || resolvedType === "submit" || resolvedType === "reset");
  const isInteractive = (Boolean(interactive) || resolvedVariant === "link") && canInteract;
  const element = isInteractive ? "button" : "span";
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  return React.createElement(
    element,
    {
      ...flowRestProps(rest),
      ref,
      className: ["tag", className].filter(Boolean).join(" "),
      type: isInteractive ? resolvedType : undefined,
      disabled: isInteractive ? resolvedState === "disabled" : undefined,
      "aria-disabled": !isInteractive && resolvedState === "disabled" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
      "data-interactive": isInteractive ? "true" : undefined,
    },
    icon ? React.createElement("span", { className: "tag__icon", "aria-hidden": "true" }, icon) : null,
    React.createElement("span", { className: "tag__label" }, label),
  );
}) as TagComponent;

Tag.displayName = "Tag";
Tag.platformContract = tagPlatformContract;
