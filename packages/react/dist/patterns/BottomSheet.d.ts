import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { DrawerProps } from "../Drawer.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { ListItem } from "../List.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type BottomSheetState = "closed" | "open" | "dragging" | "loading" | "invalid" | "destructive" | "permission-blocked" | "disabled";
export type BottomSheetDensity = "sm" | "md" | "lg";

export interface BottomSheetValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface BottomSheetAction extends ButtonProps {
  key?: string;
}

export interface BottomSheetProps extends FlowDataAttributes {
  label: string;
  description?: string;
  density?: BottomSheetDensity;
  state?: BottomSheetState;
  open?: boolean;
  dragging?: boolean;
  loading?: boolean;
  invalid?: boolean;
  destructive?: boolean;
  permissionBlocked?: boolean;
  disabled?: boolean;
  triggerLabel?: string;
  closeLabel?: string;
  items?: ListItem[];
  actions?: BottomSheetAction[];
  validation?: BottomSheetValidation;
  drawer?: Partial<DrawerProps>;
  className?: string;
  onOpenChange?: DrawerProps["onOpenChange"];
  onAction?: (key: string, event?: MouseEvent<HTMLElement>) => void;
  onSelect?: (key: string, event?: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface BottomSheetComponent extends ForwardRefExoticComponent<BottomSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "BottomSheet";
}

export const BottomSheet: BottomSheetComponent;
