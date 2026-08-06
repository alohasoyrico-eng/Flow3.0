import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import { accordionPlatformContract } from "../../components/src/platforms/index.js";

export type AccordionDensity = "sm" | "md" | "lg";

export interface AccordionItem {
  id?: string;
  title?: string;
  label?: string;
  content?: ReactNode;
  description?: ReactNode;
  open?: boolean;
  disabled?: boolean;
  icon?: string;
  meta?: string;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  multiple?: boolean;
  density?: AccordionDensity;
  onExpandedChange?: (expandedIds: string[]) => void;
}

export interface AccordionComponent extends ForwardRefExoticComponent<AccordionProps & RefAttributes<HTMLDivElement>> {
  displayName: "Accordion";
  platformContract: typeof accordionPlatformContract;
}

export const Accordion: AccordionComponent;
