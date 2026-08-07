import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { treeViewPlatformContract } from "#flow/platforms";

export type TreeViewDensity = "sm" | "md" | "lg";
export type TreeViewState = "default" | "hover" | "focus" | "expanded" | "selected" | "disabled";

export interface TreeViewNode {
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
  onSelect?: (key: string) => void;
  onExpandedChange?: (expandedKeys: string[]) => void;
}

export interface TreeViewComponent extends ForwardRefExoticComponent<TreeViewProps & RefAttributes<HTMLUListElement>> {
  displayName: "TreeView";
  platformContract: typeof treeViewPlatformContract;
}

export const TreeView: TreeViewComponent;
