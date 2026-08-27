import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, MouseEvent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { accordionPlatformContract } from "#flow/platforms";

export type AccordionDensity = "sm" | "md" | "lg";
export type AccordionVariant = "single" | "multiple";
export type AccordionSurface = "raised" | "flat";

export interface AccordionItem extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children" | "aria-controls" | "aria-expanded" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  id: string;
  title: string;
  content: ReactNode;
  open?: boolean;
  disabled?: boolean;
  icon?: string;
  meta?: string;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  items: AccordionItem[];
  variant?: AccordionVariant;
  surface?: AccordionSurface;
  multiple?: boolean;
  expandedIds?: string[];
  density?: AccordionDensity;
  onExpandedChange?: (expandedIds: string[], event: MouseEvent<HTMLButtonElement>) => void;
}

export interface AccordionComponent extends ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> {
  displayName: "Accordion";
  platformContract: typeof accordionPlatformContract;
}

export const Accordion: AccordionComponent;
