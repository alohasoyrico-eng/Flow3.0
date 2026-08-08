import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import { accordionPlatformContract } from "#flow/platforms";

export type AccordionDensity = "sm" | "md" | "lg";
export type AccordionVariant = "single" | "multiple";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  open?: boolean;
  disabled?: boolean;
  icon?: string;
  meta?: string;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  items: AccordionItem[];
  variant?: AccordionVariant;
  multiple?: boolean;
  expandedIds?: string[];
  density?: AccordionDensity;
  onExpandedChange?: (expandedIds: string[]) => void;
}

export interface AccordionComponent extends ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> {
  displayName: "Accordion";
  platformContract: typeof accordionPlatformContract;
}

export const Accordion: AccordionComponent;
