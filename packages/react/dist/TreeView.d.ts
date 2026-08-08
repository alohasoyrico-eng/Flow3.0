import type { ButtonHTMLAttributes, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { treeViewPlatformContract } from "#flow/platforms";

export type TreeViewDensity = "sm" | "md" | "lg";
export type TreeViewState = "default" | "hover" | "focus" | "expanded" | "selected" | "disabled";
export type TreeViewExpandedChangeEvent = MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export interface TreeViewNode extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children" | "role" | "aria-expanded" | "aria-selected" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  key?: string;
  id?: string;
  label: string;
  level?: number;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, "style" | "onSelect" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label?: string;
  nodes: TreeViewNode[];
  state?: TreeViewState;
  density?: TreeViewDensity;
  selectedKey?: string;
  onSelect?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onExpandedChange?: (expandedKeys: string[], event: TreeViewExpandedChangeEvent) => void;
}

export interface TreeViewComponent extends ForwardRefExoticComponent<TreeViewProps & RefAttributes<HTMLUListElement>> {
  displayName: "TreeView";
  platformContract: typeof treeViewPlatformContract;
}

export const TreeView: TreeViewComponent;
