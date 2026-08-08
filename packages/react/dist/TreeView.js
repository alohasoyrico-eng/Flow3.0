import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { treeViewPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { flowStateProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validStates = new Set(["default", "hover", "focus", "expanded", "selected", "disabled"]);

function nodeKey(node) {
  return String(node?.key ?? node?.id);
}

function normalizeNodes(nodes) {
  const source = Array.isArray(nodes) ? nodes : [];
  return source.filter((node) => {
    const stableKey = node?.key ?? node?.id;
    return node?.label && stableKey !== undefined && stableKey !== null && stableKey !== "";
  }).map((node) => ({
    ...node,
    key: nodeKey(node),
    label: node.label,
    level: Math.max(1, Math.min(5, Number(node?.level ?? 1))),
    expandable: node?.expanded != null,
    expanded: Boolean(node?.expanded),
    selected: Boolean(node?.selected),
  }));
}

function visibleKeys(nodes, expandedKeys) {
  const hiddenByLevel = [];
  return nodes.filter((node) => {
    while (hiddenByLevel.length && hiddenByLevel[hiddenByLevel.length - 1] >= node.level) hiddenByLevel.pop();
    const visible = hiddenByLevel.length === 0;
    if (node.expandable && !expandedKeys.includes(node.key)) hiddenByLevel.push(node.level);
    return visible;
  }).map((node) => node.key);
}

export const TreeView = forwardRef(function TreeView({
  label,
  nodes,
  state = "expanded",
  density,
  selectedKey,
  onSelect,
  onExpandedChange,
  className = "",
  ...rest
}, ref) {
  const normalizedNodes = useMemo(() => normalizeNodes(nodes), [nodes]);
  const isSelectedKeyControlled = selectedKey !== undefined;
  const [selected, setSelected] = useState(() => selectedKey ?? normalizedNodes.find((node) => node.selected)?.key ?? "");
  const [expanded, setExpanded] = useState(() => normalizedNodes.filter((node) => node.expanded).map((node) => node.key));
  const controlRefs = useRef(new Map());
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedState = normalizeFlowValue(state, validStates, "expanded");
  const visible = visibleKeys(normalizedNodes, expanded);

  useEffect(() => {
    if (isSelectedKeyControlled) setSelected(selectedKey ?? "");
  }, [isSelectedKeyControlled, selectedKey]);

  if (!normalizedNodes.length) return null;

  const focusKey = (key) => requestAnimationFrame(() => controlRefs.current.get(key)?.focus());
  const commitSelected = (node, event) => {
    if (!node || node.disabled) return;
    if (!isSelectedKeyControlled) setSelected(node.key);
    onSelect?.(node.key, event);
    focusKey(node.key);
  };
  const commitExpanded = (node, nextExpanded, event) => {
    if (!node?.expandable || node.disabled) return;
    setExpanded((current) => {
      const next = nextExpanded
        ? [...new Set([...current, node.key])]
        : current.filter((key) => key !== node.key);
      onExpandedChange?.(next, event);
      return next;
    });
  };
  const move = (node, direction) => {
    const enabled = visible
      .map((key) => normalizedNodes.find((candidate) => candidate.key === key))
      .filter((candidate) => candidate && !candidate.disabled);
    const index = Math.max(0, enabled.findIndex((candidate) => candidate.key === node.key));
    focusKey(enabled[Math.max(0, Math.min(enabled.length - 1, index + direction))]?.key);
  };
  const edge = (position) => {
    const enabled = visible
      .map((key) => normalizedNodes.find((candidate) => candidate.key === key))
      .filter((candidate) => candidate && !candidate.disabled);
    focusKey(position === "first" ? enabled[0]?.key : enabled[enabled.length - 1]?.key);
  };

  return React.createElement(
    "ul",
    {
      ...flowRestProps(rest),
      ref,
      className: ["tree-view", className].filter(Boolean).join(" "),
      role: "tree",
      "aria-label": label,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    normalizedNodes.map((node) => {
      const isExpanded = expanded.includes(node.key);
      const isSelected = selected === node.key;
      const isVisible = visible.includes(node.key);
      const { key, id, label: nodeLabel, level, expanded: nodeExpanded, expandable, selected: nodeSelected, disabled, icon, children, onClick, onKeyDown, ...nodeRest } = node;
      return React.createElement(
        "li",
        {
          key: node.key,
          className: "tree-view__item",
          "data-tree-item": "",
          "data-key": node.key,
          "data-level": String(node.level),
          "data-expanded": node.expandable ? String(isExpanded) : undefined,
          "data-selected": String(isSelected),
          role: "none",
          hidden: !isVisible,
        },
        React.createElement(Button, {
          ...nodeRest,
          ref: (control) => {
            if (control) controlRefs.current.set(node.key, control);
            else controlRefs.current.delete(node.key);
          },
          label: nodeLabel,
          variant: "secondary",
          disabled: Boolean(disabled),
          icon: node.expandable ? icon ?? "folder" : icon ?? "",
          trailingIcon: node.expandable ? "expand_more" : "",
          density: resolvedDensity,
          className: "tree-view__control",
          "data-tree-control": "",
          role: "treeitem",
          "aria-level": String(node.level),
          "aria-expanded": node.expandable ? String(isExpanded) : undefined,
          "aria-selected": String(isSelected),
          tabIndex: isSelected || (!selected && visible[0] === node.key) ? 0 : -1,
          onClick: (event) => {
            onClick?.(event);
            if (event.defaultPrevented) return;
            commitSelected(node, event);
            if (node.expandable) commitExpanded(node, !isExpanded, event);
          },
          onKeyDown: (event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              move(node, 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              move(node, -1);
            } else if (event.key === "Home") {
              event.preventDefault();
              edge("first");
            } else if (event.key === "End") {
              event.preventDefault();
              edge("last");
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              commitExpanded(node, true, event);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              commitExpanded(node, false, event);
            }
          },
        }),
      );
    }),
  );
});

TreeView.displayName = "TreeView";
TreeView.platformContract = treeViewPlatformContract;
