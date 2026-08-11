import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AccordionProps } from "../Accordion.js";
import type { ButtonProps } from "../Button.js";
import type { DrawerProps } from "../Drawer.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { InputProps, InputValueMeta } from "../Input.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SearchProps } from "./Search.js";
import type { SidebarProps, SidebarRoute } from "./Sidebar.js";

export type HelpCenterState = "closed" | "open" | "loading" | "results" | "empty" | "topic-selected" | "error" | "disabled";
export type HelpCenterDensity = InputProps["density"];

export interface HelpCenterTopic extends Omit<TagProps, "children"> {
  key: string;
  label: string;
  count?: number;
}

export interface HelpCenterArticle extends Omit<AccordionProps["items"][number], "content"> {
  id: string;
  title: string;
  topic?: string;
  summary?: string;
  content?: AccordionProps["items"][number]["content"];
  open?: boolean;
}

export interface HelpCenterProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: HelpCenterDensity;
  state?: HelpCenterState;
  open?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  disabled?: boolean;
  query?: string;
  search?: Partial<SearchProps>;
  sidebar?: Partial<SidebarProps>;
  topics?: HelpCenterTopic[];
  articles?: HelpCenterArticle[];
  selectedTopicKey?: string;
  topicInput?: Partial<InputProps>;
  recovery?: Partial<EmptyStateProps> & { action?: Partial<ButtonProps> & { label: string } };
  drawer?: Partial<DrawerProps>;
  className?: string;
  onQueryChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onTopicSelect?: (key: string, topic: HelpCenterTopic, event: MouseEvent<HTMLButtonElement>) => void;
  onDrawerOpenChange?: DrawerProps["onOpenChange"];
  onRecoveryAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onRouteSelect?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface HelpCenterComponent extends ForwardRefExoticComponent<HelpCenterProps & RefAttributes<HTMLDivElement>> {
  displayName: "HelpCenter";
}

export const HelpCenter: HelpCenterComponent;
