import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type OnThisPageNavState = "default" | "sticky" | "collapsed" | "active-section" | "overflow" | "mobile" | "dark";
export type OnThisPageNavDensity = SurfaceDensity;

export interface OnThisPageNavItem extends FlowDataAttributes {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeTone?: BadgeProps["tone"];
  onClick?: ButtonProps["onClick"];
}

export interface OnThisPageNavProps extends FlowDataAttributes {
  label?: string;
  items?: OnThisPageNavItem[];
  density?: OnThisPageNavDensity;
  state?: OnThisPageNavState;
  collapsed?: boolean;
  sticky?: boolean;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface OnThisPageNavComponent extends ForwardRefExoticComponent<OnThisPageNavProps & RefAttributes<HTMLDivElement>> {
  displayName: "OnThisPageNav";
}

const validStates = new Set<OnThisPageNavState>(["default", "sticky", "collapsed", "active-section", "overflow", "mobile", "dark"]);

function sanitizeRestProps(rest: object): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest as Record<string, unknown>)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  state,
  collapsed,
  sticky,
  items,
}: {
  state?: OnThisPageNavState;
  collapsed?: boolean;
  sticky?: boolean;
  items: OnThisPageNavItem[];
}): OnThisPageNavState {
  if (collapsed) return "collapsed";
  if (state && validStates.has(state)) return state;
  if (items.some((item) => item.active)) return "active-section";
  if (sticky) return "sticky";
  return "default";
}

function itemKey(item: OnThisPageNavItem, index: number): string {
  return item.id || `${item.label}-${index}`;
}

export const OnThisPageNav = forwardRef<HTMLDivElement, OnThisPageNavProps>(function OnThisPageNav({
  label = "On this page",
  items = [],
  density,
  state,
  collapsed = false,
  sticky = false,
  children,
  surface,
  className = "",
  ...rest
}, ref) {
  const normalizedItems = (Array.isArray(items) ? items : []).filter((item) => Boolean(item?.id && item?.label));
  const resolvedState = resolveState({
    ...(state !== undefined ? { state } : {}),
    collapsed,
    sticky,
    items: normalizedItems,
  });

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["on-this-page-nav", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      role: "navigation",
      state: "default",
      "aria-label": rest["aria-label"] ?? label,
      "data-flow-pattern": "on-this-page-nav",
      "data-on-this-page-nav-state": resolvedState,
      "data-collapsed": String(collapsed),
      "data-sticky": String(sticky),
      ...(density !== undefined ? { density } : {}),
    },
    React.createElement("div", { "data-flow-slot": "on-this-page-nav.label" }, label),
    normalizedItems.length
      ? React.createElement(
        "div",
        { "data-flow-slot": "on-this-page-nav.items" },
        normalizedItems.map((item, index) => React.createElement(
          "div",
          { key: itemKey(item, index), "data-flow-slot": "on-this-page-nav.item" },
          React.createElement(Button, {
            label: item.label,
            variant: item.active ? "secondary" : "tertiary",
            state: item.active ? "focus" : item.disabled ? "disabled" : "default",
            "aria-current": item.active ? "location" : undefined,
            "data-flow-slot": "on-this-page-nav.item-action",
            ...(density !== undefined ? { density } : {}),
            ...(item.disabled !== undefined ? { disabled: item.disabled } : {}),
            ...(item.onClick !== undefined ? { onClick: item.onClick } : {}),
            ...(item.href !== undefined ? { "data-href": item.href } : {}),
            ...sanitizeRestProps(item),
          }),
          item.badge ? React.createElement(Badge, {
            label: item.badge,
            variant: "status",
            state: item.disabled ? "disabled" : item.active ? "focus" : "default",
            live: false,
            "data-flow-slot": "on-this-page-nav.item-badge",
            ...(density !== undefined ? { density } : {}),
            ...(item.badgeTone !== undefined ? { tone: item.badgeTone } : {}),
          }) : null,
        )),
      )
      : null,
    children ? React.createElement("div", { "data-flow-slot": "on-this-page-nav.body" }, children) : null,
  );
}) as OnThisPageNavComponent;

OnThisPageNav.displayName = "OnThisPageNav";
